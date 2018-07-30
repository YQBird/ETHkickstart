// use to create web3 instance
import Web3 from "web3";

// need both server&client side web3 instance
// in server side, there is no window object
let web3;

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  // we are running in browser & metamastk is running
  web3 = new Web3(window.web3.currentProvider);
} else {
  // we are running on server or metamask is not running
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/168610cf92e94654b88173cd7cb508f9"
  );

  web3 = new Web3(provider);
}

export default web3;
