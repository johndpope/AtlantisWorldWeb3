var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Assets = artifacts.require("./Assets.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Assets);
};
