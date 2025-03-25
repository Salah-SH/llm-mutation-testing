it("Kill Mutant: Check if require statement is properly reverted with 'zero address' mutation", async function() {
    const { ethers } = require("hardhat");

    it("Kill Mutant: Check if require statement is properly reverted with 'zero address' mutation", async function() {
        // Deploy the Manager contract using the Manager factory
        const Manager = await ethers.getContractFactory("Manager");
        const manager = await Manager.deploy();
        await manager.deployed();

        // Deploy the ERC20Tpl contract using the ERC20Tpl factory
        const ERC20Tpl = await ethers.getContractFactory("ERC20Tpl");
        const ERC20Token = await ERC20Tpl.deploy();
        await ERC20Token.deployed();

        // Mock the necessary values for the test
        const symbol = "TEST";
        await manager.initialize(
            ethers.constants.AddressZero,
            ethers.constants.AddressZero,
            ethers.constants.AddressZero,
            ethers.constants.AddressZero,
            ethers.constants.AddressZero,
            ethers.constants.AddressZero,
            ethers.constants.AddressZero,
            ethers.constants.AddressZero,
            ERC20Token.address
        );

        // Call the setRedeemFeeRecipient function with a zero address as the new recipient
        // This should revert with the 'zero address' error message
        // Mutant: require(newRecipient != address(0), 'zero address'); is mutated to a comment
        await expect(manager.setRedeemFeeRecipient(ethers.constants.AddressZero)).to.be.revertedWith("Commented require statement");
    });
});