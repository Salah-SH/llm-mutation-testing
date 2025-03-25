const { expect } = require("chai");

describe("Manager", function () {
    it("Kill the Mutant - Changing '!=' to '>=', should only be set by Fee Controller", async function () {
        const Manager = await ethers.getContractFactory("Manager");
        const manager = await Manager.deploy();
        await manager.deployed();

        const symbol = "PDAL";
        const newFeeRate = 101; // Setting the fee rate slightly above 100%

        // Deploy a new account to act as a different wallet
        const [wallet1] = await ethers.getSigners();

        // Check if setting the rebase fee rate to a value slightly above 100% fails when sender is not the Fee Controller
        await expect(manager.connect(wallet1).setRebaseFeeRateTo(symbol, newFeeRate))
            .to.be.revertedWith('onlyFeeController');

    });
});