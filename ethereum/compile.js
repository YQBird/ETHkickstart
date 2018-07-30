const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

const buildPath = path.resolve(__dirname, "build");
// clean build folder before compile contract
fs.removeSync(buildPath);

const contractPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(contractPath, "utf8");
const output = solc.compile(source, 1).contracts;

// create folder before write compiled contract into file
fs.ensureDirSync(buildPath);

for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(":", "") + ".json"),
    output[contract]
  );
}
