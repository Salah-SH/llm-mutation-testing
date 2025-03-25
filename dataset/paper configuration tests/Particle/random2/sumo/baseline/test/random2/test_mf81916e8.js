const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Manager Mutation Test", function() {
    let owner, manager;

    before(async () => {
        [owner] = await ethers.getSigners();

        const Manager = await ethers.getContractFactory("Manager");
        manager = await Manager.deploy();
        await manager.deployed();
    });

    it("Validate redemption with mutated code", async function() {
        const value = ethers.BigNumber.from(100);
        const tokenIds = [1];
        const deadline = ethers.BigNumber.from(1704038400);
        
        const sig = {
            v: 27,
            r: "0x8a22787d590190c2401bb97f67dd94d80e036dbdec71e06d7ffbf0a3fd35d5",
            s: "0x15202d1c71b9e808b753662ea8dc95d7bd6fff5e61725c69d3bc3cba06f96cc7"
        };

        try {
            await manager.validateRedemption(owner.address, value, tokenIds, deadline, sig.v, sig.r, sig.s);
        } catch (error) {
            // If the test case killed the mutant, it should throw an error
            return;
        }
    
        // If the test case did not kill the mutant, this line should not be reached
        throw new Error("The mutation was not killed by the test case");
    });
});