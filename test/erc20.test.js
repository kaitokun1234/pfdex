const GoldCoin = artifacts.require("GoldCoin");
const JPYCoin = artifacts.require("JPYCoin");
const OilCoin = artifacts.require("OilCoin");

const BN = require("bn.js");
const chai = require("chai");
const { expect } = chai;
const toWei = (number) => web3.utils.toWei(web3.utils.toBN(number), 'ether');
chai.use(require("chai-bn")(BN));

const truffleAssert = require("truffle-assertions");

contract("ERC20 token test", (accounts) => {
    let jpyc, oilc, gldc;

    const owner = accounts[0];
    const alice = accounts[1];
    const bob = accounts[2];

    before(async () => {
        jpyc = await JPYCoin.deployed();
        oilc = await OilCoin.deployed();
        gldc = await GoldCoin.deployed();
    })

    describe("Supply", () => {
        it("Should return token names and symbols correctly", async () => {
            expect(await jpyc.name()).to.equal("JPYCoin");
            expect(await oilc.symbol()).to.equal("OILC");
        })

        it("Should have users correct first supply", async () => {
            const ownerBalance = await jpyc.balanceOf(owner);
            const aliceBalance = await jpyc.balanceOf(alice);
            const bobBalance = await jpyc.balanceOf(bob);
            expect(await jpyc.totalSupply()).to.bignumber.equal(ownerBalance);
            expect(aliceBalance).to.bignumber.equal(toWei(0));
            expect(bobBalance).to.bignumber.equal(toWei(0));
        })
    })

    it("Should have correct total supply", async () => {
        expect(await gldc.totalSupply()).to.bignumber.equal(toWei(1000000));
    })

    describe("transfer", () => {
        it("Should revert when transfer amount > balance", async () => {
            const ownerBalance = await gldc.balanceOf(owner);
            const transferAmount = ownerBalance.add(new BN(1));
            await truffleAssert.reverts(gldc.transfer(alice, transferAmount));
        });

        it("Should update correct balance after transfer", async() =>{
            const bobBalance = await oilc.balanceOf(bob);
            const transferAmount = new BN(100);
            await oilc.transfer(bob, transferAmount);
            const newBobBalance = await oilc.balanceOf(bob);
            expect(bobBalance.add(transferAmount)).to.bignumber.equal(newBobBalance);
        })
    })
})