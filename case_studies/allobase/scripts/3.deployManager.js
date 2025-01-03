const { ethers, upgrades } = require("hardhat");

async function main() {
    // [owner] = await ethers.getSigners();
    // const m = await ethers.getContractFactory('Manager');
    // manager = await upgrades.deployProxy(
    //     m,
    //     [owner.address, owner.address, owner.address, owner.address, owner.address, owner.address, owner.address, owner.address],
    //     { initializer: 'initialize', kind: 'uups' }
    // );

    const Manager = await ethers.getContractFactory("Manager");
    const managerImplV1 = await Manager.deploy();
    await managerImplV1.deployed();

    const data = [];
    const ManagerProxy = await ethers.getContractFactory("ERC1967Proxy");
    const manager = await ManagerProxy.deploy(managerImplV1.address, data);
    await manager.deployed();
    console.log("Manager deployed to:", manager.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });