const fs = require('fs');
const util = require('util');

/**
 * We want to use async/await with fs.readFile - util.promisfy gives us that
 */
const readFile = util.promisify(fs.readFile);

/**
 * Logic for fetching users information
 */
class loginService {
  /**
   * Constructor
   * @param {*} datafile Path to a JSOn file that contains the users data
   */
  constructor(datafile) {
    this.datafile = datafile;
  }

  /**
   * Returns a list of users name and password
   */
  async getNames() {
    const data = await this.getData();

    // We are using map() to transform the array we get into another one
    return data.map((user) => {
      return { name: user.name, password: user.password };
    });
  }

  /**
   * Get user information provided a email
   * @param {*} email
   */
  async getUser(email) {
    const data = await this.getData();
    const user = data.find((elm) => {
      return elm.email === email;
    });
    if (!user) return null;
    return {
      name: user.name,
      email: user.email,
      password: user.password,
    };
  }

  /**
   * Fetches users data from the JSON file provided to the constructor
   */
  async getData() {
    const data = await readFile(this.datafile, 'utf8');
    return JSON.parse(data);
  }
}

module.exports = loginService;
