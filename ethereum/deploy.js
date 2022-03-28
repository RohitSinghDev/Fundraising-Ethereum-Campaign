const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

// const interface = require("./compile").abi;
// const bytecode = require("./compile").bytecode;

const compiledFactory = require("../ethereum/build/campaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

const provider = new HDWalletProvider(
  "afraid planet close unusual brother fatal gloom kitten upset ten tunnel settle",
  "https://rinkeby.infura.io/v3/301420f28e0a4866886b3d9218b97b36"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: 10000000 });

  //   console.log(abi);
  console.log("contract deployed at", result.options.address);

  provider.engine.stop();
};

deploy();
