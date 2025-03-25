const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Mutation test for Manager contract", function () {
    let manager;

    beforeEach(async () => {
        const Manager = await ethers.getContractFactory("Manager");
        manager = await Manager.deploy();
        await manager.deployed();
    });

    it("Should revert when setting the rebase fee rate to a value above 100%", async () => {
        const symbol = "ABC";
        const feeRate = 11000; // Attempt to set fee rate above 100%
        
        await expect(manager.setRebaseFeeRateTo(symbol, feeRate)).to.be.reverted;
    });
});