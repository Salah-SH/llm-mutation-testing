const { expect } = require("chai");

describe("Mutation Test: emit RebaseFeeRateSetTo mutation", function () {
    it("Should revert with error message 'onlyFeeController' on original contract when calling setRebaseFeeRateTo function without being the fee controller", async function () {
        const Manager = await ethers.getContractFactory("Manager");
        const manager = await Manager.deploy();

        try {
            await manager.setRebaseFeeRateTo("Symbol", 10); // Test the setRebaseFeeRateTo function without being the fee controller
            throw new Error("The function should have reverted");
        } catch (error) {
            expect(error.message).to.contain("onlyFeeController");
        }
    });
});