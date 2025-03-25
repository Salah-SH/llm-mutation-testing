const { expect } = require("chai");

// Run the test case to kill the mutant by providing a valid token address
describe("Manager Mutant Kill Test", function() {
    it("Kill Mutant: require modified to comment", async function() {
        const Manager = await ethers.getContractFactory("Manager");
        const manager = await Manager.deploy();
        await manager.deployed();

        // Call the killMutant function that will utilize the mutate function with correct arguments
        const killMutant = async () => {
            // Provide a valid symbol for testing
            const symbol = "ABC";

            // Call the function that indirectly triggers the mutated line
            await manager.setRebaseFeeRateTo(symbol, 100);
        };

        // Kill the mutant by successfully executing the function with valid arguments
        await expect(killMutant()).to.be.revertedWith("onlyFeeController");
    });
});