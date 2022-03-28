import Web3 from "web3";

// window only available inside browser, not in node js where our server is currently running

let web3;
if (typeof window !== "undefined" && typeof (window.web3 !== "undefined")) {
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.web3.currentProvider);
} else {
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/301420f28e0a4866886b3d9218b97b36"
  );
  web3 = new Web3(provider);
}

export default web3;
