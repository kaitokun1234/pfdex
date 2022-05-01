const DAI = artifacts.require("DAI");
const LINK = artifacts.require("LINK");
const COMP = artifacts.require("COMP");
const DEX = artifacts.require("DEX");

const toWei = (number) => web3.utils.toWei(web3.utils.toBN(number), 'ether');

module.exports = async function (deployer){
  await deployer.deploy(DAI);
  const dai = await DAI.deployed();
  await deployer.deploy(LINK);
  const link = await LINK.deployed();
  await deployer.deploy(COMP);
  const comp = await COMP.deployed();

  await deployer.deploy(DEX, [dai.address, link.address, comp.address]);
  const dex = await DEX.deployed();

   await dai.transfer(dex.address, toWei(1000000));
   await link.transfer(dex.address, toWei(1000000));
   await comp.transfer(dex.address, toWei(1000000));
}