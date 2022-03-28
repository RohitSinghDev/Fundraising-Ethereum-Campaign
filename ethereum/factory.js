import web3 from "./web3";
const compiledFactory = require("./build/campaignFactory.json");

const instance = new web3.eth.Contract(
  compiledFactory.abi,
  "0x5CB26AcC10AE9366EB9b73A478e56da1d0d5B499"
);

export default instance;
