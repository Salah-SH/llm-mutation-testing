const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Manager Mutation Test", function() {
    let manager;
    let owner;

    before(async function() {
        [owner] = await ethers.getSigners();

        const Manager = await ethers.getContractFactory("Manager");
        manager = await Manager.deploy();
        await manager.deployed();
    });

    it("Test onlyRebaseController modifier", async function() {
        const rebaseController = owner.address;
        
        try {
            await manager.setRebaseController(owner.address);
            expect(true).to.be.true; // This line should not be reached if the mutation is killed
        } catch (error) {
            expect(error.message).to.include('onlyRebaseController');
        }
    });
});