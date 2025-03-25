describe("Kill Mutant Test: ", function() {
    it("Mutant should be killed by setting valid factory address: Change != to > in Manager contract", async function() {
        const { ethers } = require("hardhat");

        let owner;
        let factory;
        
        before(async () => {
            const [account] = await ethers.getSigners();
            owner = account.address;

            const Factory = await ethers.getContractFactory("Factory");
            factory = await Factory.deploy();
            await factory.deployed();
        });

        it("should kill the mutant by setting a valid factory address and rebase interval", async function() {
            const Manager = await ethers.getContractFactory("Manager");
            const manager = await Manager.deploy();
            await manager.deployed();

            // Setting a valid factory address
            await manager.initialize(owner, owner, owner, owner, owner, owner, owner, owner, factory.address);

            // Setting a rebase interval
            const newRebaseInterval = 86400; // Setting the rebase interval to 1 day
            await manager.setRebaseInterval(newRebaseInterval);

            // Setting a rebase fee rate that will trigger the mutated condition
            const symbol = "TEST";
            await factory.createTriple(symbol, "Test", "Test");

            const ERC20Token = await ethers.getContractFactory("ERC20Tpl");
            const T20 = await ERC20Token.attach(await manager.factory.getTriple(symbol).ERC20);

            const rebaseFeeRate = 110; // Simulating a fee rate higher than 100%
            await manager.setRebaseFeeRateTo(symbol, rebaseFeeRate);

            // Ensure the rebase fee rate has been set
            expect(await manager.rebaseFeeRates(symbol)).to.equal(rebaseFeeRate);

            // The following test should kill the mutant by expecting a revert when trying to rebase
            await expect(manager.rebaseTo(symbol)).to.be.revertedWith('Rebase too frequently');
        });
    });
});