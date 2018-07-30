const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const CampaignFactory = require("../ethereum/build/CampaignFactory.json");
const Campaign = require("../ethereum/build/Campaign.json");

let accounts;
let cactory;
let campaignAddreas;
let campaign;

beforeEach(async () => {
  // get array of test accounts
  accounts = await web3.eth.getAccounts();

  // deploy campaign factory contract using first test account
  factory = await new web3.eth.Contract(JSON.parse(CampaignFactory.interface))
    .deploy({ data: CampaignFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods
    .createCampaign("100")
    .send({ from: accounts[0], gas: "1000000" });

  [campaignAddreas] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(
    JSON.parse(Campaign.interface),
    campaignAddreas
  );
});

describe("Campaigns", () => {
  it("deploys a factory", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("manager is first account", async () => {
    const manager = await campaign.methods.manager().call();
    assert(accounts[0], manager);
  });

  it("allow people to contribute money", async () => {
    await campaign.methods
      .contribute()
      .send({ value: "200", from: accounts[1] });

    const isApprover = await campaign.methods.approvers(accounts[1]).call();
    assert.ok(isApprover);
  });

  it("require minimum contribution", async () => {
    try {
      await campaign.methods
        .contribute()
        .send({ value: "50", from: accounts[1] });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("allows manager to make a payment request", async () => {
    await campaign.methods
      .createRequest("buy description", 500, accounts[1])
      .send({ from: accounts[0], gas: "1000000" });

    const newRequest = campaign.methods.requests(0).call();
    assert("buy description", newRequest.description);
  });

  it("process requests", async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether")
    });

    await campaign.methods
      .createRequest("A", web3.utils.toWei("5", "ether"), accounts[1])
      .send({ from: accounts[0], gas: "1000000" });

    await campaign.methods
      .approveRequest(0)
      .send({ from: accounts[0], gas: "1000000" });

    await campaign.methods
      .finalizeRequest(0)
      .send({ from: accounts[0], gas: "1000000" });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);

    assert(balance > 104);
  });
});
