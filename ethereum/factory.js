import web3 from "./web3";
import FactoryContract from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(FactoryContract.interface),
  "0x5e16EBe4237FF603195E59D1c43C50b4a4c22CBD"
);

export default instance;
