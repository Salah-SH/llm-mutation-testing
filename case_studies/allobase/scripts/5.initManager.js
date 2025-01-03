const { ethers, upgrades } = require("hardhat");

async function main() {
    const factoryAddr = '';
    const managerAddr = '';
    const Manager = await ethers.getContractFactory('Manager');
    const manager = await Manager.attach(managerAddr);
    [owner] = await ethers.getSigners();
    await manager.initialize(
        owner.address,
        owner.address,
        owner.address,
        owner.address,
        owner.address,
        owner.address,
        owner.address,
        owner.address,
        factoryAddr);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });