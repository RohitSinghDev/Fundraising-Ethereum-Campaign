const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider({ gasLimit: 10000000 }));
// increased gas limit to 10M
const compiledFactory = require("../ethereum/build/campaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: "10000000" });

  await factory.methods
    .createCampaign("100")
    .send({ from: accounts[0], gas: "10000000" }); //in this function call we only get recepit/transaction hash

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
  //   the above method is for the already deployed contract, we pass the address of deployed contract
});

describe("Campaign", () => {
  it("deploys factory and a campaign", async () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });
  it("creater of campaing marked as manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0], "manager not verified");
  });

  it("allows people to contribute and marks them as approvers", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: "200",
    });

    const isContributer = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributer);
  });

  it("requires a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: "10",
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("manager can create request", async () => {
    await campaign.methods
      .createRequest("buy cake", "100", accounts[2])
      .send({ from: accounts[0], gas: 10000000 });

    const reqs = await campaign.methods.requests(0).call();

    assert.equal("buy cake", reqs.description);
  });

  it("processes requests", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: web3.utils.toWei("10", "ether"),
    });

    await campaign.methods
      .createRequest("apple", web3.utils.toWei("5", "ether"), accounts[2])
      .send({ from: accounts[0], gas: "10000000" });

    await campaign.methods
      .approveRequest(0)
      .send({ from: accounts[1], gas: "10000000" });

    let initialBal = await web3.eth.getBalance(accounts[2]);
    initialBal = web3.utils.fromWei(initialBal, "ether");
    initialBal = parseFloat(initialBal);

    await campaign.methods
      .finalizeRequest(0)
      .send({ from: accounts[0], gas: "10000000" });

    let finalBal = await web3.eth.getBalance(accounts[2]);
    finalBal = web3.utils.fromWei(finalBal, "ether");
    finalBal = parseFloat(finalBal);
    // console.log(finalBal, initialBal);
    const deposit = finalBal - initialBal;
    // console.log(deposit);

    // the amount of ether is not updated after each test

    assert.equal(deposit, 5);
  });
});
