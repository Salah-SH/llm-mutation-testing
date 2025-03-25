const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Kill Mutant - ERC20Tpl FEE_BASE Mutation', function () {
  it('Verify FEE_BASE after mutation', async function () {
    const ERC20Tpl = await ethers.getContractFactory('ERC20Tpl');
    const ft = await ERC20Tpl.deploy();
    await ft.deployed();

    // Access the private constant FEE_BASE by calling the public function getFeeBase()
    const feeBase = await ft.FEE_BASE(); // Accessing the function that returns FEE_BASE

    const FEE_BASE_MUTATED = ethers.BigNumber.from(10).pow(12); // Original value of FEE_BASE

    // Expect the result of the function call to reflect the original FEE_BASE value
    expect(feeBase).to.equal(FEE_BASE_MUTATED);
  });
});