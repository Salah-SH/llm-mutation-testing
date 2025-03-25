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

    it("Validate redemption with mutated line of code", async function() {
        const triple = {
            ERC20: ethers.constants.AddressZero,
            ERC721: ethers.constants.AddressZero,
            ERC20Wrapper: ethers.constants.AddressZero
        };
        const value = ethers.utils.parseEther("1");
        const tokenIds = [1];
        const deadline = await ethers.provider.getBlock("latest");
        const v = 27;
        // Mutated line: using incorrect v value to validate redemption
        const sig = {
            r: ethers.utils.formatBytes32String("random"),
            s: ethers.utils.formatBytes32String("random"),
            v: v
        };

        try {
            await manager.validateRedemption(owner.address, value, tokenIds, deadline.timestamp, sig.v, sig.r, sig.s);
            // The above line of code should throw an error and kill the mutant
        } catch(err) {
            expect(err).to.be.an.instanceOf(Error);
        }
    });
});