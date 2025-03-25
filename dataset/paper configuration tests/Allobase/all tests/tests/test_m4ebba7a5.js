const { expect } = require("chai");

describe("Mutation Test: Greater Than Mutation", function () {
    it("Should kill the greater than mutant", async function () {
        const Manager = await ethers.getContractFactory("Manager");
        const manager = await Manager.deploy();

        // Set the rebase interval to a value less than or equal to 3600 * 8 (28800)
        const newRebaseInterval = 28800;

        // Since the mutation changed the operator from '>' to '>=', the test should now fail
        // The mutation should be killed by updating the test to expect a revert due to setting a value equal to the original value
        await expect(manager.setRebaseInterval(newRebaseInterval)).to.be.reverted;
    });
});