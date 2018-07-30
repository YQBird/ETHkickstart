const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compileFactory = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider(
  "open dolphin syrup sniff hub lumber okay quality banana summer festival infant",
  "https://rinkeby.infura.io/v3/168610cf92e94654b88173cd7cb508f9"
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log(`Attempting to deploy from account ${accounts[0]}`);

  const result = await new web3.eth.Contract(
    JSON.parse(compileFactory.interface)
  )
    .deploy({ data: compileFactory.bytecode })
    .send({ gas: "1000000", from: accounts[0] });

  console.log(`Contract deployed to ${result.options.address}`);
};

try {
  deploy();
} catch (e) {
  console.log(e);
}
