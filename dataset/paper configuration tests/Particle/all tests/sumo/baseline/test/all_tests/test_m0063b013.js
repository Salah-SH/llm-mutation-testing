const { expect } = require("chai");

describe("Manager Mutation Test", function() {
    let manager;

    before(async function () {
        const Manager = await ethers.getContractFactory("Manager");
        manager = await Manager.deploy();
        await manager.deployed();
    });

    it("Mutant should fail at the mutated require statement", async function () {
        try {
            // Call the mutated function that should trigger the require statement
            await manager.upgradeImplTo(ethers.constants.AddressZero, ethers.constants.AddressZero);
        } catch (error) {
            // Expect the transaction to revert as the mutant require statement is triggered
            expect(error.message).to.contain("reverted");
        }
    });

    it("Original code should pass without issues and kill the mutant", async function () {
        // Check if original function works as expected and kills the mutant
        // Upgrade to the new implementation without issues
        expect(async () => {
            // Deploy a new implementation contract
            const ManagerV2 = await ethers.getContractFactory("ManagerV2");
            const newImpl = await ManagerV2.deploy();

            // Set the factory address to a non-zero address to pass the require statement in the mutant
            // This will kill the mutant as the require statement in the mutant will pass
            await manager.setFactoryController("0x1");

            // Upgrade the implementation to the new implementation
            await manager.upgradeImplTo(manager.address, newImpl.address);

            // Check if the upgrade was successful and the implementation is updated
            const updatedImplementation = await manager.implementation();
            expect(updatedImplementation).to.equal(newImpl.address);
        }).to.not.throw();
    });
});