const GoldCoin = artifacts.require("GoldCoin");
const JPYCoin = artifacts.require("JPYCoin");
const OilCoin = artifacts.require("OilCoin");
const DEX = artifacts.require("DEX");

const toWei = (number) => web3.utils.toWei(web3.utils.toBN(number), 'ether');

module.exports = async function (deployer){
  await deployer.deploy(GoldCoin);
  const gldc = await GoldCoin.deployed();
  await deployer.deploy(OilCoin);
  const oilc = await OilCoin.deployed();
  await deployer.deploy(JPYCoin);
  const jpyc = await JPYCoin.deployed();

  await deployer.deploy(DEX, [gldc.address, oilc.address, jpyc.address]);
  const dex = await DEX.deployed();

  // await gldc.transfer(dex.address, toWei(1000000));
  // await oilc.transfer(dex.address, toWei(1000000));
  // await jpyc.transfer(dex.address, toWei(1000000));
}