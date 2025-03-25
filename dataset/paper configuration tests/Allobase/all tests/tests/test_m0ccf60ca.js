const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Manager Mutation Test", function() {
    let manager;
    
    before(async () => {
        const Manager = await ethers.getContractFactory("Manager");
        manager = await Manager.deploy();
        await manager.deployed();
    });

    it("Validate Redemption with incorrect signature should revert", async function() {
        const symbol = "TEST";
        const owner = "0x12345";
        const value = 100;
        const tokenIds = [1, 2];
        const deadline = 1704020400;  // 2024-01-01
        const v = 27; // Incorrect signature v

        const sig = {
            v: v,
            r: "0x1234",
            s: "0x5678"
        };

        await expect(manager.validateRedemption(owner, value, tokenIds, deadline, sig.v, sig.r, sig.s)).to.be.reverted;
    });
});