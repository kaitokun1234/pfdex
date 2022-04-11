const GoldCoin = artifacts.require("GoldCoin");
const JPYCoin = artifacts.require("JPYCoin");
const OilCoin = artifacts.require("OilCoin");
const DEX = artifacts.require("DEX");

const BN = require("bn.js");
const chai = require("chai");
const { expect } = chai;
const toWei = (number) => web3.utils.toWei(web3.utils.toBN(number), 'ether');
chai.use(require("chai-bn")(BN));

const truffleAssert = require("truffle-assertions");

contract("DEX test", (accounts) => {
    let jpyc, oilc, gldc, dex;

    const owner = accounts[0];
    const alice = accounts[1];
    const bob = accounts[2];

    before(async () => {
        jpyc = await JPYCoin.deployed();
        oilc = await OilCoin.deployed();
        gldc = await GoldCoin.deployed();
        dex = await DEX.deployed();
    })

    it("Should revert when input incorrect token Address", async() => {
        await truffleAssert.reverts(dex.sellToken(bob, toWei(1), toWei(1)));
    })

    it("Should update balance of msg.sender and dex", async() => {
        const senderBalance = jpyc.balanceOf(msg.sender);
        const dexBalance = jpyc.balanceOf(dex);
        const swapAmount = toWei(1);
        await dex.buyToken(msg.sender, swapAmount, swapAmount);
        const newsenderBalance = jpyc.balanceOf(msg.sender);
        expect(senderBalance.add(swapAmount)).to.bignumber.equal(newawnsweBalance);
    })
})