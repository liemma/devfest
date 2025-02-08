const Web3 = require("web3");
require("dotenv").config();

const MIDNIGHT_URL = process.env.MIDNIGHT_URL;
const web3 = new Web3(new Web3.providers.HttpProvider(MIDNIGHT_URL));

module.exports = web3;
