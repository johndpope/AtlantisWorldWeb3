var Assets = artifacts.require("Assets.sol");
var AirdropNFT = artifacts.require("AirdropNFT.sol");

module.exports = function(deployer) {
  deployer.deploy(Assets);
  deployer.deploy(AirdropNFT);
};