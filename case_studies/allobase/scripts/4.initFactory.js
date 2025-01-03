const { ethers, upgrades } = require("hardhat");

async function main() {
    const factoryAddr = '';
    const managerAddr = '';
    const Factory = await ethers.getContractFactory('Factory');
    const factory = await Factory.attach(factoryAddr);
    [owner] = await ethers.getSigners();
    await factory.initialize(
        owner.address,
        owner.address,
        owner.address,
        owner.address,
        managerAddr);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });