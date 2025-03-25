describe("Test ERC20 Mutation", function() {
    it("Transfer Zero Shares Should Revert Mutant", async function () {
        const { ethers } = require("hardhat");
        
        let ft;
        let owner;
        let nonOwner;

        before(async () => {
            const ERC20Tpl = await ethers.getContractFactory("ERC20Tpl");
            ft = await ERC20Tpl.deploy();
            await ft.deployed();

            owner = await ft.manager();
            nonOwner = "0x0123456789ABCDEF0123456789ABCDEF0123456A";
            
            const managerAddress = owner;
            const underlyingNFTAddress = "0x0123456789ABCDEF0123456789ABCDEF01234568";
            const wrapperAddress = "0x0123456789ABCDEF0123456789ABCDEF01234569";
            
            await ft.initialize("TestToken", "TT", managerAddress, underlyingNFTAddress, wrapperAddress);
        });

        it("revert with 'ERC20: transfer zero' message", async () => {
            await expect(ft.connect(owner).transferShare(nonOwner, 0)).to.be.revertedWith("ERC20: transfer zero");
        });
    });
});