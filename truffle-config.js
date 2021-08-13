require('dotenv').config();
const path = require("path");
const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(
          process.env.METAMASK_WALLET_SECRET,
          'https://rinkeby.infura.io/v3/69faa0ff70d74c9894ec5cf1a4062ff6'
        )
      },
      from: '0x775C72FB1C28c46F5E9976FFa08F348298fBCEC0',
      networkCheckTimeout: 100000,
      network_id: 4,
      skipDryRun: true
    },
    mumbaiMatic: {
      provider: function () {
        return new HDWalletProvider(
          process.env.METAMASK_WALLET_SECRET,
          'https://matic-mumbai.chainstacklabs.com'
        )
      },
      networkCheckTimeout: 100000,
      network_id: 80001,
      skipDryRun: true
    }
  },
  compilers: {
    solc: {
      version: '0.8.0+commit.c7dfd78e',
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY,
    polygonscan: process.env.MATICSCAN_API_KEY
  }
};
