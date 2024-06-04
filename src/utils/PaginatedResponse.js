module.exports = class PaginatedResponse {
  /**
   * Paginated model for paginated response
   * @param {any} results
   * @param {number} totalDocs
   * @param {string} previous
   * @param {string} next
   * @param {boolean} hasNext
   * @param {boolean} hasPrev
   */
  constructor(results, totalDocs, previous, next, hasNext, hasPrev) {
    this.results = results;
    this.totalDocs = totalDocs;
    this.previous = previous;
    this.next = next;
    this.hasNext = hasNext;
    this.hasPrev = hasPrev;
  }
};
