const { expect } = require("chai");

describe("ERC20Tpl _totalShares mutation test", function() {
  it("should have _totalShares as private variable", async function() {
    const ERC20Tpl = await ethers.getContractFactory("ERC20Tpl");
    const erc20 = await ERC20Tpl.deploy();
    
    expect(erc20._totalShares).to.equal(undefined); // This will pass for the original code and fail for the mutant
  });
});