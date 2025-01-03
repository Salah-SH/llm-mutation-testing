const { expect } = require("chai");
const { ethers} = require("hardhat");

var erc721ImplV1, erc20ImplV1, erc20WrapperImplV1, syncImplV1;
var erc721ImplV2, erc20ImplV2, erc20WrapperImplV2, syncImplV2;
var factory, manager;

const name = "BitDeerBDG";
const symbol = "BDG";

describe.only("Template: ", function() {
    it("Deploy ERC721 V1", async function() {
        const Tpl = await ethers.getContractFactory("ERC721Tpl");
        erc721ImplV1 = await Tpl.deploy();
        await erc721ImplV1.deployed();
    });

    it("Deploy ERC721 V2", async function() {
        const Tpl = await ethers.getContractFactory("ERC721TplV2");
        erc721ImplV2 = await Tpl.deploy();
        await erc721ImplV2.deployed();
    });

    it("Deploy ERC20 V1", async function() {
        const Tpl = await ethers.getContractFactory("ERC20Tpl");
        erc20ImplV1 = await Tpl.deploy();
        await erc20ImplV1.deployed();
    });

    it("Deploy ERC20 V2", async function() {
        const Tpl = await ethers.getContractFactory("ERC20TplV2");
        erc20ImplV2 = await Tpl.deploy();
        await erc20ImplV2.deployed();
    });

    it("Deploy ERC20Wrapper V1", async function() {
        const Tpl = await ethers.getContractFactory("ERC20WrapperTpl");
        erc20WrapperImplV1 = await Tpl.deploy();
        await erc20WrapperImplV1.deployed();
    });

    it("Deploy ERC20Wrapper V2", async function() {
        const Tpl = await ethers.getContractFactory("ERC20WrapperTplV2");
        erc20WrapperImplV2 = await Tpl.deploy();
        await erc20WrapperImplV2.deployed();
    });

    it("Deploy Sync V1", async function() {
        const Tpl = await ethers.getContractFactory("SyncTpl");
        syncImplV1 = await Tpl.deploy();
        await syncImplV1.deployed();
    });

    it("Deploy Sync V2", async function() {
        const Tpl = await ethers.getContractFactory("SyncTplV2");
        syncImplV2 = await Tpl.deploy();
        await syncImplV2.deployed();
    });
});

describe.only("Factory: ", function() {
    it("Deploy Factory V1", async function() {
        const Factory = await ethers.getContractFactory("Factory");
        const factoryImplV1 = await Factory.deploy();
        await factoryImplV1.deployed();

        [manager] = await ethers.getSigners();
        const ABI = ["function initialize(address, address, address, address, address)"];
        const abi = new ethers.utils.Interface(ABI);
        const data = abi.encodeFunctionData(
            "initialize",
            [erc721ImplV1.address, erc20ImplV1.address, erc20WrapperImplV1.address, syncImplV1.address, manager.address]
        )
        const FacotryProxy = await ethers.getContractFactory("ERC1967Proxy");
        const factoryProxy = await FacotryProxy.deploy(factoryImplV1.address, data);
        await factoryProxy.deployed();

        factory = await Factory.attach(factoryProxy.address);
        expect(await factory.ERC721Impl()).to.equal(erc721ImplV1.address)
        expect(await factory.ERC20Impl()).to.equal(erc20ImplV1.address)
        expect(await factory.ERC20WrapperImpl()).to.equal(erc20WrapperImplV1.address)
        expect(await factory.syncImpl()).to.equal(syncImplV1.address)
    });

    it("Create Triple", async function() {
        await factory.createTriple(name, symbol, 'oz');
        const triple = await factory.getTriple(symbol);
        expect( await factory.getTriplesLength()).to.equal(1);
        
        // erc721
        const ERC721Token = await ethers.getContractFactory("ERC721Tpl");
        const T721 = await ERC721Token.attach(triple.ERC721);
        expect(await T721.name()).to.equal(name + " NFT");
        expect(await T721.symbol()).to.equal(symbol + "NFT");

        // erc20
        const ERC20Token = await ethers.getContractFactory("ERC20Tpl");
        const T20 = await ERC20Token.attach(triple.ERC20);
        expect(await T20.name()).to.equal(name);
        expect(await T20.symbol()).to.equal(symbol);

        // erc20 wrapper
        const ERC20WrapperToken = await ethers.getContractFactory("ERC20WrapperTpl");
        const T20Wrapper = await ERC20WrapperToken.attach(triple.ERC20Wrapper);
        expect(await T20Wrapper.name()).to.equal(name + " Wrapper");
        expect(await T20Wrapper.symbol()).to.equal("w" + symbol);

        // sync
        const syncAddr = await factory.getSync(symbol);
        const Sync = await ethers.getContractFactory("SyncTpl");
        const sync = await Sync.attach(syncAddr);
        expect(await sync.symbol()).to.equal(symbol);
    });

    it("Set Template address: ERC721Impl, ERC20Impl, ERC20WrapperImpl, syncImpl", async function() {
        await factory.setERC721Impl(erc721ImplV2.address);
        expect(await factory.ERC721Impl()).to.equal(erc721ImplV2.address)

        await factory.setERC20Impl(erc20ImplV2.address);
        expect(await factory.ERC20Impl()).to.equal(erc20ImplV2.address)

        await factory.setERC20WrapperImpl(erc20WrapperImplV2.address);
        expect(await factory.ERC20WrapperImpl()).to.equal(erc20WrapperImplV2.address)

        await factory.setSyncImpl(syncImplV2.address);
        expect(await factory.syncImpl()).to.equal(syncImplV2.address)
    });
});