const { expect } = require("chai");

describe("Manager test case to kill the mutant", function() {
    it("Verify that the 'validateRedemption' function rejects invalid redemption requests for the mutant", async function() {
        const Manager = await ethers.getContractFactory("Manager");
        const manager = await Manager.deploy();

        // Setting up required addresses and values
        const ownerAddress = "0x1234567890123456789012345678901234567890"; // Sample owner address
        const value = 100;
        const tokenIds = [1, 2];
        const deadline = Math.floor(new Date("2024-01-01").getTime() / 1000);

        // Valid signature
        const sig = {
            v: 27, // Sample v value
            r: "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef", // Sample r value
            s: "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"  // Sample s value
        };

        // Mutated contract method call - invalid deadline
        const invalidDeadline = Math.floor(new Date("2022-01-01").getTime() / 1000); // Using an earlier date
        await expect(manager.validateRedemption(ownerAddress, value, tokenIds, invalidDeadline, sig.v, sig.r, sig.s)).to.be.revertedWith('deadline expired');
    });
});