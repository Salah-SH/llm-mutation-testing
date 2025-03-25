describe("Test case to kill the >= mutant", function() {
    it("Should revert when trying to set rebase fee rate without having fee controller permissions", async function() {
        const { ethers } = require("hardhat");

        let manager;
        let owner;
        let feeController;

        // Deploy the Manager contract
        before(async () => {
            const Manager = await ethers.getContractFactory("Manager");
            manager = await Manager.deploy();
            await manager.deployed();

            [owner, feeController] = await ethers.getSigners();

            // Set the initial rebase interval
            await manager.setRebaseInterval(3600);
        });

        it("Should revert when trying to set rebase fee rate without fee controller permissions", async function() {
            // Change the rebase interval to trigger the mutation
            await manager.setRebaseInterval(3599);

            try {
                // Call setRebaseFeeRateTo function without fee controller permissions
                await manager.connect(owner).setRebaseFeeRateTo("BTC", 10);
                // Fail the test if the above call did not revert
                assert(false, "The function should have reverted");
            } catch (error) {
                // Check if the revert reason is related to 'onlyFeeController' modifier
                assert(error.message.includes("onlyFeeController"), true, "Revert reason is not 'onlyFeeController'");
            }
        });
    });
});