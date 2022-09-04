const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

/**
 * Logic for reading and writing registeration data
 */
class registerService {
  /**
   * Constructor
   * @param {*} datafile Path to a JSOn file that contains the user data
   */
  constructor(datafile) {
    this.datafile = datafile;
  }

  /**
   * Add a new user item
   * @param {*} name The name of the user
   * @param {*} email
   * @param {*} password
   */
  async addEntry(name, email, password) {
    const data = (await this.getData()) || [];
    data.push({ name, email, password });
    return writeFile(this.datafile, JSON.stringify(data));
  }

  /**
   * Get user information provided an email
   * @param {*} email
   */
  async getUser(email) {
    const data = await this.getData();
    const user = data.find((elm) => {
      return elm.email === email;
    });
    if (!user) return null;
    return {
      email: user.email,
      password: user.password,
    };
  }

  /**
   * Fetches user data from the JSON file provided to the constructor
   */
  async getData() {
    const data = await readFile(this.datafile, 'utf8');
    if (!data) return [];
    return JSON.parse(data);
  }
}

module.exports = registerService;
