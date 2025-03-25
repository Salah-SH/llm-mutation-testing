const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Manager: Mutation Test", function() {
    let manager;
    
    before(async () => {
        const Manager = await ethers.getContractFactory("Manager");
        manager = await Manager.deploy();
        await manager.deployed();
    });

    it("Validate redemption with incorrect signature should revert", async function() {
        const owner = "0x1234567890123456789012345678901234567890";
        const value = 100;
        const tokenIds = [1];
        const deadline = 1735689600; // Future timestamp
        const signature = {
            v: 28,
            r: "0x1234567890123456789012345678901234567890123456789012345678901234",
            s: "0x1234567890123456789012345678901234567890123456789012345678901234"
        };

        await expect(manager.validateRedemption(owner, value, tokenIds, deadline, signature.v, signature.r, signature.s))
            .to.be.revertedWith('invalid signature');
    });
});