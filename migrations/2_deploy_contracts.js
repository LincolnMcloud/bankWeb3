var Bank = artifacts.require("./bank.sol");

module.exports = function(deployer){
  deployer.deploy(Bank);
}