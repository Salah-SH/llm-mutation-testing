require("@nomiclabs/hardhat-waffle");
require('@openzeppelin/hardhat-upgrades');
// require('hardhat-contract-sizer');
// require('hardhat-storage-layout');
// require("hardhat-gas-reporter");
require('solidity-coverage');
require('solidity-docgen');

/** @type import('hardhat/config').HardhatUserConfig */

// Go to https://infura.io/ and create a new project
// Replace this with your Infura project ID
const INFURA_PROJECT_ID = "";

// Replace this private key with your Goerli account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
const GOERLI_PRIVATE_KEY = "";

module.exports = {
  solidity: {
    version: '0.8.3',
    settings: {
        optimizer: {
            enabled: true,
            runs: 200,
        },
        outputSelection: {
            "*": {
                "*": ["storageLayout"],
            },
          },
    },
  },

  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true
  },

  gasReporter: {
    enabled: true
  },

  docgen: {
    pages: 'files',
    exclude: ['mocks']
  },

  networks: {
    hardhat: {
      allowUnlimitedContractSize: true
    },
    
    //goerli: {
    //  url: `https://goerli.infura.io/v3/${INFURA_PROJECT_ID}`,
    //  accounts: [`0x${GOERLI_PRIVATE_KEY}`]
    //}
  }
};