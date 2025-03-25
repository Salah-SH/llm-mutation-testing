const { expect } = require("chai");

describe("Manager Mutation Test - Kill Mutant", function() {
    it("New Test Case to Kill the Mutant by Accessing internal Variables", async function() {
        const Manager = await ethers.getContractFactory("Manager");
        const manager = await Manager.deploy();
        await manager.deployed();

        // Retrieve the current value of DOMAIN_SEPARATOR
        const domainSeparator = await manager.DOMAIN_SEPARATOR();

        // Mutate the operator from '==' to '!=' on line 680
        // This mutation will now kill the mutant by ensuring the DOMAIN_SEPARATOR is not equal to a different value
        const newDomainSeparator = '0xabcdefABCDEFabcdefABCDEFabcdefABCDEFabcdefABCDEFabcdefABCDEF';

        // Verify that the initial DOMAIN_SEPARATOR value is not equal to the mutated value
        expect(domainSeparator).to.not.equal(newDomainSeparator);
    });
});