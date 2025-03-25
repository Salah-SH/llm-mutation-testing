const { expect } = require("chai");

describe("Kill Mutant Test for Address Zero Check Mutation", function () {
    let manager;

    beforeEach(async () => {
        const Manager = await ethers.getContractFactory("Manager");
        manager = await Manager.deploy();
        await manager.deployed();
    });

    it("Should revert when setting ERC721 implementation address to zero after mutant is applied", async () => {
        const factoryController = await manager.factoryController();

        // Impersonating the factory controller address to perform the operation
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [factoryController],
        });

        const factoryControllerSigner = await ethers.provider.getSigner(factoryController);

        // Attempt to set ERC721 implementation to zero address after the mutant is applied
        const zeroAddress = "0x0000000000000000000000000000000000000000";

        // Manually update ERC721 implementation address to zero address - this should revert
        try {
            await manager.connect(factoryControllerSigner).setERC721Impl(zeroAddress);
        } catch (error) {
            // If it reverts as expected, the test case is successful
            return;
        }
        throw new Error("The operation did not revert as expected");
    });

});