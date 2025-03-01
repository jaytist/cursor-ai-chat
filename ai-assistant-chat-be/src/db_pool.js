import pg from "pg";

class DbPool {
  #_pool = null;

  connect(connectionString) {
    this.#_pool = new pg.Pool({ connectionString: connectionString });
    return this.#_pool.query(`SELECT 1 + 1;`);
  }

  close() {
    if (this.#_pool) {
      return this.#_pool.end();
    }
  }

  query(queryString, params) {
    return this.#_pool.query(queryString, params);
  }
}

export default new DbPool();
