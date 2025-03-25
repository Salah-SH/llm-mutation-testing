describe("Mutant Test: ", function() {
    it("Mutated require statement should revert correctly", async function() {
        const { ethers } = require("hardhat");
        const { expect } = require("chai");
        
        let manager;
        
        before(async () => {
            const Manager = await ethers.getContractFactory("Manager");
            manager = await Manager.deploy();
            await manager.deployed();
        });
        
        it("Testing the mutated require statement", async function() {
            const tokenAddr = "0x0000000000000000000000000000000000000000"; // Address set to 0x0
            await expect(manager.wipeFrozenAddressTo(tokenAddr, owner, oversightAddr)).to.be.revertedWith('zero address');
        });
    });
});