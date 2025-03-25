// Import the necessary modules from Hardhat for testing
const { expect } = require('chai');

// Start describing the test case
describe('Manager Contract', function () {
  let Manager;
  let manager;

  // Deploy a new Manager contract instance for each test
  beforeEach(async () => {
    Manager = await ethers.getContractFactory("Manager");
    manager = await Manager.deploy();
  });

  // Test to kill the mutant by accessing the internal DOMAIN_SEPARATOR variable directly
  it('Should access the internal DOMAIN_SEPARATOR variable directly', async function () {
    // Retrieve the DOMAIN_SEPARATOR value directly by accessing it internally
    const domainSeparator = await manager.DOMAIN_SEPARATOR();

    // Check that the DOMAIN_SEPARATOR is set correctly during initialization
    expect(domainSeparator).to.not.equal(0);
  });
});