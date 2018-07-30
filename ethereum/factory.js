import web3 from "./web3";
import FactoryContract from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(FactoryContract.interface),
  "0x55B873292EDE281a2bC756189131B9EEB1A09CDf"
);

export default instance;
