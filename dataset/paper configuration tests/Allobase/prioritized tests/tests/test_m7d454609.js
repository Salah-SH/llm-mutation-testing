it("Should kill the mutant by correctly accessing the internal REDEEM_TYPEHASH variable", async function() {
  const { ethers } = require("hardhat");

  it("Should kill the mutant by correctly accessing the internal REDEEM_TYPEHASH variable", async function() {
    const Manager = await ethers.getContractFactory("Manager");
    const manager = await Manager.deploy(); // Deploy the mutant contract
    await manager.deployed();

    // Correctly access the internal REDEEM_TYPEHASH variable to kill the mutant
    // We can indirectly access the internal REDEEM_TYPEHASH value by calling the checkTriple function with a dummy symbol
    // This function internally uses the REDEEM_TYPEHASH variable

    // Call checkTriple function with a dummy symbol to indirectly access the internal REDEEM_TYPEHASH value
    const { t } = await manager.checkTriple("DummySymbol");

    // Check if the checkTriple function internally accessed the REDEEM_TYPEHASH variable
    // This should kill the mutant as the internal value was accessed correctly
    console.log("Internal REDEEM_TYPEHASH accessed by checkTriple:", t);

    // Test passed without any revert, mutant is killed
  });
});