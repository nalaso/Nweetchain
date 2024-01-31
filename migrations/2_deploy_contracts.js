const Nweetchain = artifacts.require("Nweetchain");

module.exports = function(deployer) {
   deployer.deploy(Nweetchain)
};