require("dotenv").config({ path: ".env.local" });
const syncModels = require("../src/config/db/syncModels");

const cheerio = require("cheerio");
const { Sequelize } = require("sequelize");

const Language = require("../src/models/Language");
const Word = require("../src/models/Word");

function parseHtmlLanguage(html) {
  const selector = cheerio.load(html);

  const languages = [];
  selector("body>table>tbody>tr").each((i, row) => {
    if (i === 0) return;

    const cells = selector(row).find("td");
    if (cells.length >= 2) {
      const code = selector(cells[0]).text().trim();
      const name = selector(cells[1]).text().trim();
      languages.push({ code, name });
    }
  });

  return languages;
}

async function fillLanguagesTable() {
  const httpResponse = await fetch(
    "http://www.lingoes.net/en/translator/langcode.htm"
  );

  if (!httpResponse.ok)
    throw new Error(`Failed to fetch JSON: ${httpResponse.statusText}`);

  const html = await httpResponse.text();

  const languages = parseHtmlLanguage(html);

  await Language.bulkCreate(languages, {
    ignoreDuplicates: true
  });
}

async function fillWordsTable() {
  const httpResponse = await fetch(
    "https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json"
  );

  if (!httpResponse.ok)
    throw new Error(`Failed to fetch JSON: ${httpResponse.statusText}`);

  const reader = httpResponse.body.getReader();
  const languageId = (
    await Language.findOne({
      attributes: ["id"],
      raw: true,
      where: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("code")),
        Sequelize.fn("LOWER", "en")
      )
    })
  ).id;

  let decoder = new TextDecoder("utf-8");
  let partialData = "";
  let chunk;

  while (!(chunk = await reader.read()).done) {
    partialData += decoder.decode(chunk.value, { stream: true });

    let count = 0;
    let lines = partialData.split("\n");
    let words = [];
    for (let i = 0; i < lines.length - 1; i++) {
      let line = lines[i];
      let regex = /"(.+)"/g;

      if (regex.test(line)) {
        let word = line.match(regex)[0].replace(/"/g, "");
        words.push({ word, languageId });
        count++;
      }
    }

    if (count >= 100 || lines.indexOf("}") !== -1) {
      await Word.bulkCreate(words, { ignoreDuplicates: true });
      words = [];
      count = 0;
    }

    partialData = lines[lines.length - 1];
  }
}

async function main() {
  await syncModels();
  await fillLanguagesTable();
  await fillWordsTable();
}

main();
