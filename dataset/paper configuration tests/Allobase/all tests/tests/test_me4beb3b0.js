const { expect } = require("chai");

describe("Test ERC20 Mutation", function() {
  it("Kill Mutant by Testing Issued Event", async function() {
    const rewireERC20Tpl = async (ft) => {
      // Rewire the ERC20Tpl contract to expose the internal _mintShare function for testing
      await ft.deployed();
      const contractWithInternalFunction = await ethers.getContractFactory("ERC20Tpl", ft.signer);
      const rewire = await contractWithInternalFunction.attach(ft.address);
      
      return rewire;
    };

    it("Test Issued Event", async function() {
        const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await loadFixture(deployTokensAndMint);

        // Charge rebase fee before issuing tokens
        await ft.connect(managerEoaMock).chargeFeeRebase(ethers.BigNumber.from('2000'), managerEoaMock.address);

        // Call the rewireERC20Tpl function to expose the internal _mintShare function
        const ftRewired = await rewireERC20Tpl(ft);

        // Issue tokens from addr2 to addr3
        await ft.connect(managerEoaMock).issue(addr3.address, ethers.BigNumber.from('1'));

        let contractBalance = await ft.balanceOf(ft.address);
        let addr2Balance = await ft.balanceOf(addr2.address);
        let addr3Balance = await ft.balanceOf(addr3.address);

        // Check total supply distribution after issuing tokens
        expect(contractBalance).to.equal(0);
        expect(addr2Balance).to.equal(0);
        expect(addr3Balance).to.equal(1);
    });
  });
});