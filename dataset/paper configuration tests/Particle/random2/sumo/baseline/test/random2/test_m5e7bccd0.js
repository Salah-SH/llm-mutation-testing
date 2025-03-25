// This test case aims to kill the mutant by upgrading implementation without factory controller address

const { expect } = require("chai");

describe("Manager Mutation Test - Killing the Mutant", function () {
    let manager;

    before(async () => {
        const Manager = await ethers.getContractFactory("Manager");
        manager = await Manager.deploy();
        await manager.deployed();
    });

    it("Test to kill the mutant by upgrading implementation without factory controller", async function () {
        // Deploy a new implementation contract
        const newImpl = "0x0000000000000000000000000000000000000001";
        
        // Ensure factoryController is not set

        // Upgrade the implementation of the proxy without factory controller address
        await expect(manager.upgradeImplTo(manager.address, newImpl)).to.be.revertedWith(
            "onlyFactoryController"
        );
    });
});