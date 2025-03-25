const { expect } = require("chai");

describe("Kill Mutant - setSyncController Mutation", function() {
    let manager;

    before(async function () {
        const Manager = await ethers.getContractFactory("Manager");
        manager = await Manager.deploy();
        await manager.deployed();
    });

    it("Test mutant - setSyncController mutation should revert when setting the same controller address", async function() {
        const oldSyncController = await manager.syncController();
        const newSyncController = "0x0000000000000000000000000000000000000001"; // Different address for new controller

        // Trying to set the sync controller to the same address should revert
        await expect(manager.setSyncController(oldSyncController)).to.be.revertedWith('onlySyncController');

        // Confirm the sync controller remains the same
        const currentSyncController = await manager.syncController();
        expect(currentSyncController).to.equal(oldSyncController);
    });
});