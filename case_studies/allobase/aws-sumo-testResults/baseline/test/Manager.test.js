const { expect } = require("chai");
const { ethers} = require("hardhat");
const { verifyTypedData } = require ('ethers/lib/utils');

var _owner, _issueFeeRecipient, _redeemFeeRecipient, _managementFeeRecipient, _ctrlAddr, _spender, _freezeAddr, _oversightAddr;
var owner, issueFeeRecipient, redeemFeeRecipient, managementFeeRecipient, ctrlAddr, spender, manager, freezeAddr, oversightAddr;
var erc721ImplV1, erc20ImplV1, erc20WrapperImplV1, syncImplV1;
var erc721ImplV2, erc20ImplV2, erc20WrapperImplV2, syncImplV2;
var factory;
var issueFeeRate = 1000, redeemFeeRate = 2000, rebaseFeeRate = 100, feeBase;
var uniV2Pair, uniV2Pair2;

const name = "BitDeerPDAL";
const symbol = "PDAL";
const baseURIs = ["https://test.io/ipfs/", "https://ipfs.io/ipfs/"];
const tokenURIs = ["0.json", "1.json"];
const deadline = ethers.BigNumber.from(1704038400);  // 2024-01-01

describe.only("Template: ", function() {
    it("Deploy ERC721 V1", async function() {
        const Tpl = await ethers.getContractFactory("ERC721Tpl");
        erc721ImplV1 = await Tpl.deploy();
        await erc721ImplV1.deployed();
    });

    it("Deploy ERC20 V1", async function() {
        const Tpl = await ethers.getContractFactory("ERC20Tpl");
        erc20ImplV1 = await Tpl.deploy();
        await erc20ImplV1.deployed();
    });

    it("Deploy ERC20Wrapper V1", async function() {
        const Tpl = await ethers.getContractFactory("ERC20WrapperTpl");
        erc20WrapperImplV1 = await Tpl.deploy();
        await erc20WrapperImplV1.deployed();
    });

    it("Deploy Sync V1", async function() {
        const Tpl = await ethers.getContractFactory("SyncTpl");
        syncImplV1 = await Tpl.deploy();
        await syncImplV1.deployed();
    });
});

describe.only("Factory: ", function() {
    it("Deploy Factory", async function() {
        const Factory = await ethers.getContractFactory("Factory");
        const factoryImplV1 = await Factory.deploy();
        await factoryImplV1.deployed();

        const data = [];
        const FacotryProxy = await ethers.getContractFactory("ERC1967Proxy");
        const factoryProxy = await FacotryProxy.deploy(factoryImplV1.address, data);
        await factoryProxy.deployed();

        factory = await Factory.attach(factoryProxy.address);


    });
});

describe.only("Manager: ", function() {
    it("Deploy Manager", async function() {
       [
            _owner, 
            _issueFeeRecipient, 
            _redeemFeeRecipient, 
            _managementFeeRecipient,
            _ctrlAddr, 
            _spender, 
            _freezeAddr,
            _oversightAddr
        ] = await ethers.getSigners();

        owner = await _owner.getAddress();
        issueFeeRecipient = await _issueFeeRecipient.getAddress();
        redeemFeeRecipient = await _redeemFeeRecipient.getAddress();
        managementFeeRecipient = await _managementFeeRecipient.getAddress();
        ctrlAddr = await _ctrlAddr.getAddress();
        spender = await _spender.getAddress();
        freezeAddr = await _freezeAddr.getAddress();
        oversightAddr =  await _oversightAddr.getAddress();

        const Manager = await ethers.getContractFactory("Manager");
        const managerImplV1 = await Manager.deploy();
        await managerImplV1.deployed();

        const data = [];
        const ManagerProxy = await ethers.getContractFactory("ERC1967Proxy");
        const managerProxy = await ManagerProxy.deploy(managerImplV1.address, data);
        await managerProxy.deployed();

        manager = await Manager.attach(managerProxy.address);
        feeBase = (await manager.feeBase()).toNumber();
    });

    it("Init factory: initialize", async function() {
        await factory.initialize(erc721ImplV1.address, erc20ImplV1.address, erc20WrapperImplV1.address, syncImplV1.address, manager.address);
    });

    it("Init manager: initialize", async function() {
        await manager.initialize(owner, owner, owner, owner, owner, owner, owner, owner, factory.address);
    });

    it("Create triple: ERC721、ERC20 and ERC20Wrapper", async function() {
        // create triple
        await manager.createTriple(name, symbol, 'oz');
        await expect(manager.createTriple(name, symbol, 'oz')).to.be.revertedWith('already exists');
        const triple = await factory.getTriple(symbol);
        await manager.setBaseURITo(triple.ERC721, baseURIs[0]);
        
        expect( await factory.getTriplesLength()).to.equal(1);
        expect( await factory.getTriplesLength()).to.equal(await factory.getTriplesLength());

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
    });

    it("Get original address: issueFeeRecipient, redeemFeeRecipient, stroageFeeRecipient, \
    feeController, assetController", async function() {
        expect(await manager.issueFeeRecipient()).to.equal(owner);
        expect(await manager.redeemFeeRecipient()).to.equal(owner);
        expect(await manager.managementFeeRecipient()).to.equal(owner);
        expect(await manager.feeController()).to.equal(owner);
        expect(await manager.assetController()).to.equal(owner);
    });

    it("Set fee address: issueFeeRecipient, redeemFeeRecipient, managementFeeRecipient", async function() {
        // set address
        await manager.setIssueFeeRecipient(issueFeeRecipient);
        await manager.setRedeemFeeRecipient(redeemFeeRecipient);
        await manager.setManagementFeeRecipient(managementFeeRecipient);

        // check current address
        expect(await manager.issueFeeRecipient()).to.equal(issueFeeRecipient);
        expect(await manager.redeemFeeRecipient()).to.equal(redeemFeeRecipient);
        expect(await manager.managementFeeRecipient()).to.equal(managementFeeRecipient);
    });  

    it("Set fee rate: RebaseFeeRate", async function() {
        // const triple = await factory.getTriple(symbol);
        const triple = await factory.allTriples(0);
        const ERC20Token = await ethers.getContractFactory("ERC20Tpl");
        const T20 = await ERC20Token.attach(triple.ERC20);

        await manager.setRebaseFeeRateTo(await T20.symbol(), rebaseFeeRate);

        expect(await manager.rebaseFeeRates(await T20.symbol())).to.equal(rebaseFeeRate);
    });

    it("IssueTo", async function() {
        const triple = await factory.getTriple(symbol);
        const ERC20Token = await ethers.getContractFactory("ERC20Tpl");
        const T20 = await ERC20Token.attach(triple.ERC20);
        const decimal = await T20.decimals();
        const ERC20WrapperToken = await ethers.getContractFactory("ERC20WrapperTpl");
        const T20Wrapper = await ERC20WrapperToken.attach(triple.ERC20Wrapper);

        const amount0 = ethers.BigNumber.from(100).mul(ethers.BigNumber.from(10).pow(decimal))
        const amount1 = ethers.BigNumber.from(200).mul(ethers.BigNumber.from(10).pow(decimal))
        await manager.issueTo(symbol, owner, issueFeeRate, ["", ""], [amount0, amount1]);

        const balanceOwner = await T20.balanceOf(owner);
        const balanceIssueFeeRecipient = await T20.balanceOf(issueFeeRecipient);
        
        const allAmounts = amount0.add(amount1);
        expect(balanceIssueFeeRecipient).to.equal(allAmounts.mul(issueFeeRate).div(feeBase));
        expect(balanceOwner).to.equal(allAmounts.sub(balanceIssueFeeRecipient));
        expect(await T20.totalSupply()).to.equal(allAmounts);
        
        const ERC721Token = await ethers.getContractFactory("ERC721Tpl");
        const T721 = await ERC721Token.attach(triple.ERC721);

        expect(await T721.ownerOf(1)).to.equal(triple.ERC20)
        expect(await T721.underlyingOf(1)).to.equal(amount0)

        expect(await T721.ownerOf(2)).to.equal(triple.ERC20)
        expect(await T721.underlyingOf(2)).to.equal(amount1)

        // wrap
        const amount3 = ethers.BigNumber.from(10).mul(ethers.BigNumber.from(10).pow(decimal))
        await T20.wrap(amount3);
        expect(await T20.balanceOf(owner)).to.equal(balanceOwner.sub(amount3));
        expect(await T20Wrapper.balanceOf(owner)).to.equal(amount3);
    });

    async function permitSig(T20, value, deadline, spenderAddr) {
        const nonce = ethers.BigNumber.from(await T20.nonces(owner));
        
        const domain = {
            name: await T20.name(),
            version: '1',
            chainId: await T20.signer.getChainId(),
            verifyingContract: T20.address
        };

        const types = {
            Permit: [
                {name:'owner', type:'address'},
                {name:'spender', type:'address'},
                {name:'value', type:'uint256'},
                {name:'nonce', type:'uint256'},
                {name:'deadline', type:'uint256'}
            ]
        };

        const message = {
            owner: owner,
            spender: spenderAddr,
            value: value,
            nonce: nonce,
            deadline: deadline
        };

        const signature = await T20.signer._signTypedData(domain, types, message);
        const sig = ethers.utils.splitSignature(signature);
        return sig;
    }

    it("Freeze and UnFreeze", async function() {
        const triple = await factory.getTriple(symbol);
        const ERC20Token = await ethers.getContractFactory("ERC20Tpl");
        const T20 = await ERC20Token.attach(triple.ERC20);
        const ERC20WrapperToken = await ethers.getContractFactory("ERC20WrapperTpl");
        const T20Wrapper = await ERC20WrapperToken.attach(triple.ERC20Wrapper);

        await manager.freezeTo(triple.ERC20, freezeAddr);
        expect(await T20.isFrozen(freezeAddr)).to.equal(true);

        await manager.freezeTo(triple.ERC20Wrapper, freezeAddr);
        expect(await T20Wrapper.isFrozen(freezeAddr)).to.equal(true);

        await manager.unfreezeTo(triple.ERC20, freezeAddr);
        expect(await T20.isFrozen(freezeAddr)).to.equal(false);

        await manager.unfreezeTo(triple.ERC20Wrapper, freezeAddr);
        expect(await T20Wrapper.isFrozen(freezeAddr)).to.equal(false);

        await manager.freezeToBoth(symbol, freezeAddr);
        expect(await T20.isFrozen(freezeAddr)).to.equal(true);
        expect(await T20Wrapper.isFrozen(freezeAddr)).to.equal(true);

        await manager.unfreezeToBoth(symbol, freezeAddr);
        expect(await T20.isFrozen(freezeAddr)).to.equal(false);
        expect(await T20Wrapper.isFrozen(freezeAddr)).to.equal(false);
    });

    it("Wipe frozen address", async function() {
        const triple = await factory.getTriple(symbol);
        const ERC20Token = await ethers.getContractFactory("ERC20Tpl");
        const T20 = await ERC20Token.attach(triple.ERC20);
        const decimal = await T20.decimals();
        const ERC20WrapperToken = await ethers.getContractFactory("ERC20WrapperTpl");
        const T20Wrapper = await ERC20WrapperToken.attach(triple.ERC20Wrapper);
        const amount = ethers.BigNumber.from(1).mul(ethers.BigNumber.from(10).pow(decimal))

        await T20.transfer(freezeAddr, amount);
        await T20Wrapper.transfer(freezeAddr, amount);
        await expect(manager.wipeFrozenAddressTo(triple.ERC20, freezeAddr, oversightAddr)).to.be.revertedWith('Wipe not frozen');
        await expect(manager.wipeFrozenAddressTo(triple.ERC20Wrapper, freezeAddr, oversightAddr)).to.be.revertedWith('Wipe not frozen');
        
        await manager.freezeToBoth(symbol, freezeAddr);
        await manager.wipeFrozenAddressTo(triple.ERC20, freezeAddr, oversightAddr);
        await manager.wipeFrozenAddressTo(triple.ERC20Wrapper, freezeAddr, oversightAddr);
        expect(await T20.balanceOf(freezeAddr)).to.equal(0);
        expect(await T20.balanceOf(oversightAddr)).to.equal(amount);
        expect(await T20Wrapper.balanceOf(freezeAddr)).to.equal(0);
        expect(await T20Wrapper.balanceOf(oversightAddr)).to.equal(amount);

        await expect(T20.transfer(freezeAddr, amount)).to.be.revertedWith('Address frozen');
        await expect(T20Wrapper.transfer(freezeAddr, amount)).to.be.revertedWith('Address frozen');

        await manager.unfreezeToBoth(symbol, freezeAddr);
        await T20.transfer(freezeAddr, amount);
        await T20Wrapper.transfer(freezeAddr, amount);
        await manager.freezeToBoth(symbol, freezeAddr);
        await manager.wipeFrozenAddressToBoth(symbol, freezeAddr, oversightAddr);
        expect(await T20.balanceOf(freezeAddr)).to.equal(0);
        expect(await T20.balanceOf(oversightAddr)).to.equal(amount.mul(2));
        expect(await T20Wrapper.balanceOf(freezeAddr)).to.equal(0);
        expect(await T20Wrapper.balanceOf(oversightAddr)).to.equal(amount.mul(2));
    });

    it("Set baseURI and tokenURI", async function() {
        const triple = await factory.getTriple(symbol);
        const ERC721Token = await ethers.getContractFactory("ERC721Tpl");
        const T721 = await ERC721Token.attach(triple.ERC721);
        expect (await T721.tokenURI(1)).to.equal(baseURIs[0] + "1");

        await manager.setBaseURITo(triple.ERC721, baseURIs[1]);
        await manager.setTokenURITo(triple.ERC721, [1, 2], tokenURIs);
        expect (await T721.tokenURI(1)).to.equal(baseURIs[1] + tokenURIs[0]);
    });

   

    async function redeemSig(value, tokenIds, deadline) {
        const nonce = ethers.BigNumber.from(await manager.nonces(owner));

        const domain = {
            name: 'manager',
            version: '1',
            chainId: await manager.signer.getChainId(),
            verifyingContract: manager.address
        };

        const types = {
            Redeem: [
                {name:'owner', type:'address'},
                {name:'value', type:'uint256'},
                {name:'tokenIds', type:'uint256[]'},
                {name:'nonce', type:'uint256'},
                {name:'deadline', type:'uint256'}
            ]
        };

        const message = {
            owner: owner,
            value: value,
            tokenIds: tokenIds,
            nonce: nonce,
            deadline: deadline
        };

        const signature = await manager.signer._signTypedData(domain, types, message);
        const sig = ethers.utils.splitSignature(signature);
        // console.log(owner, verifyTypedData(domain, types, message, signature).toLowerCase());
        return sig
    }
/*
    it("Validate redemption", async function() {
        const value = ethers.BigNumber.from(100);
        const tokenIds = [1];
        const sig = await redeemSig(value, tokenIds, deadline);
        await manager.validateRedemption(owner, value, tokenIds, deadline, sig.v, sig.r, sig.s);
    });
*/
	/*
    it("RedeemFrom", async function() {
        const triple = await factory.getTriple(symbol);
        const ERC20Token = await ethers.getContractFactory("ERC20Tpl");
        const T20 = await ERC20Token.attach(triple.ERC20);
        const decimal = await T20.decimals();
        const value0 = ethers.BigNumber.from(300).mul(ethers.BigNumber.from(10).pow(decimal));
        const deadline0 = deadline
        const sig0 = await permitSig(T20, value0, deadline0, manager.address);

        const value1 = ethers.BigNumber.from(200).mul(ethers.BigNumber.from(10).pow(decimal));;
        const tokenIds = [2];
        const deadline1 = deadline
        const sig1 = await redeemSig(value1, tokenIds, deadline1);

        const balanceOwner0 = await T20.balanceOf(owner);
        await manager.redeemFrom(
            symbol, 
            owner, 
            redeemFeeRate,
            [value0, value1],
            [deadline0, deadline1],
            [sig0.v, sig1.v],
            [sig0.r, sig0.s, sig1.r, sig1.s],
            tokenIds
        );

        const balanceOwner1 = await T20.balanceOf(owner);
        const balanceRedeemFeeRecipient = await T20.balanceOf(redeemFeeRecipient);
        expect(balanceRedeemFeeRecipient).to.equal(value1.mul(redeemFeeRate).div(feeBase));
        expect(balanceOwner0.sub(balanceOwner1)).to.equal(value1.add(balanceRedeemFeeRecipient));
        expect(await T20.balanceOf(manager.address)).to.equal(0);
    });
*/
    it("RebaseTo", async function() {
        const triple = await factory.getTriple(symbol);
        const ERC20Token = await ethers.getContractFactory("ERC20Tpl");
        const T20 = await ERC20Token.attach(triple.ERC20);
        const issueShare = (await T20.totalShares()).mul(rebaseFeeRate).div(feeBase);
        await manager.rebaseTo(symbol);
        expect(await T20.sharesOf(managementFeeRecipient)).to.equal(issueShare);
        const amount = await T20.balanceOf(managementFeeRecipient);
        expect(await T20.getTokenByShares(issueShare)).to.equal(amount);

        await expect(manager.rebaseTo(symbol)).to.be.revertedWith('Rebase too frequently');
        await manager.setRebaseInterval(1);
        await manager.rebaseTo(symbol);
    });

    it("Pause and unpause", async function() {
        const triple = await factory.getTriple(symbol);
        const ERC20Token = await ethers.getContractFactory("ERC20Tpl");
        const T20 = await ERC20Token.attach(triple.ERC20);
        const ERC20WrapperToken = await ethers.getContractFactory("ERC20WrapperTpl");
        const T20Wrapper = await ERC20WrapperToken.attach(triple.ERC20Wrapper);

        await manager.pauseTo(triple.ERC20);
        expect(await T20.paused()).to.equal(true);

        await manager.pauseTo(triple.ERC20Wrapper);
        expect(await T20Wrapper.paused()).to.equal(true);

        await manager.unpauseTo(triple.ERC20);
        expect(await T20.paused()).to.equal(false);

        await manager.unpauseTo(triple.ERC20Wrapper);
        expect(await T20Wrapper.paused()).to.equal(false);
    });

    it("Set controller address: factoryController, feeController, assetController, syncController, rebaseController", async function() {
        // set address
        await manager.setFactoryController(ctrlAddr);
        await manager.setFeeController(ctrlAddr);
        await manager.setAssetController(ctrlAddr);
        await manager.setSyncController(ctrlAddr);
        await manager.setRebaseController(ctrlAddr);

        // check current address
        expect(await manager.factoryController()).to.equal(ctrlAddr);
        expect(await manager.feeController()).to.equal(ctrlAddr);
        expect(await manager.assetController()).to.equal(ctrlAddr);
        expect(await manager.syncController()).to.equal(ctrlAddr);
        expect(await manager.syncController()).to.equal(ctrlAddr);

        await manager.connect(_ctrlAddr).setFactoryController(owner);
        await manager.connect(_ctrlAddr).setFeeController(owner);
        await manager.connect(_ctrlAddr).setAssetController(owner);
        await manager.connect(_ctrlAddr).setSyncController(owner);
        await manager.connect(_ctrlAddr).setRebaseController(owner);
    });
});

describe.only("Sync: ", function() {
    it("Deploy UniswapV2PairMock", async function() {
        const UniV2Pair = await ethers.getContractFactory("UniswapV2PairMock");
        uniV2Pair = await UniV2Pair.deploy();
        await uniV2Pair.deployed();

        const UniV2Pair2 = await ethers.getContractFactory("UniswapV2PairMock");
        uniV2Pair2 = await UniV2Pair2.deploy();
        await uniV2Pair2.deployed();
    });

    it("Set defi pair", async function() {
        const syncAddr = await factory.getSync(symbol);
        await manager.setDefiPairTo(syncAddr, uniV2Pair.address)
        await manager.setDefiPairTo(syncAddr, uniV2Pair2.address)

        const Sync = await ethers.getContractFactory("SyncTpl");
        const sync = await Sync.attach(syncAddr);

        expect(await sync.getDefiPairsLength()).to.equal(2);
        expect(await sync.allDefiPairs(0)).to.equal(uniV2Pair.address);
        expect(await sync.contains(uniV2Pair.address)).to.equal(true);
    });

    it("exec sync", async function() {
        const syncAddr = await factory.getSync(symbol);
        const Sync = await ethers.getContractFactory("SyncTpl");
        const sync = await Sync.attach(syncAddr);

        await sync.sync();
        expect(await uniV2Pair.reserve0()).to.equal(1);
        expect(await uniV2Pair.reserve1()).to.equal(2);
        expect(await uniV2Pair2.reserve0()).to.equal(1);
        expect(await uniV2Pair2.reserve1()).to.equal(2);
    });

    it("Del defi pair", async function() {
        const syncAddr = await factory.getSync(symbol);
        await manager.delDefiPairTo(syncAddr, uniV2Pair.address)

        const Sync = await ethers.getContractFactory("SyncTpl");
        const sync = await Sync.attach(syncAddr);

        expect(await sync.getDefiPairsLength()).to.equal(1);
        expect(await sync.allDefiPairs(0)).to.equal(uniV2Pair2.address);
        expect(await sync.contains(uniV2Pair.address)).to.equal(false);
    });
});

describe.only("Upgrade: ", function() {
    it("Upgrade ERC721", async function() {
        const tpl = await ethers.getContractFactory("ERC721TplV2");
        erc721ImplV2 = await tpl.deploy();
        await manager.setERC721Impl(erc721ImplV2.address);
        expect(await factory.ERC721Impl()).to.equal(erc721ImplV2.address)

        const triple = await factory.getTriple(symbol);

        await manager.upgradeImplTo(triple.ERC721, erc721ImplV2.address);

        const T721 = await tpl.attach(triple.ERC721);
        expect(await T721.implementation()).to.equal(erc721ImplV2.address);

        expect(await T721.name()).to.equal(name + " NFTv2");
        expect(await T721.symbol()).to.equal(symbol + "NFT");
    });

    it("Upgrade ERC20", async function() {
        const tpl = await ethers.getContractFactory("ERC20TplV2");
        erc20ImplV2 = await tpl.deploy();
        await manager.setERC20Impl(erc20ImplV2.address);
        expect(await factory.ERC20Impl()).to.equal(erc20ImplV2.address)

        const triple = await factory.getTriple(symbol);

        await manager.upgradeImplTo(triple.ERC20, erc20ImplV2.address);

        const T20 = await tpl.attach(triple.ERC20);
        expect(await T20.implementation()).to.equal(erc20ImplV2.address);

        expect(await T20.name()).to.equal(name + "v2");
        expect(await T20.symbol()).to.equal(symbol);
    });

    it("Upgrade ERC20Wrapper", async function() {
        const tpl = await ethers.getContractFactory("ERC20WrapperTplV2");
        erc20WrapperImplV2 = await tpl.deploy();
        await manager.setERC20WrapperImpl(erc20WrapperImplV2.address);
        expect(await factory.ERC20WrapperImpl()).to.equal(erc20WrapperImplV2.address)

        const triple = await factory.getTriple(symbol);

        await manager.upgradeImplTo(triple.ERC20Wrapper, erc20WrapperImplV2.address);

        const T20Wrapper = await tpl.attach(triple.ERC20Wrapper);
        expect(await T20Wrapper.implementation()).to.equal(erc20WrapperImplV2.address);

        expect(await T20Wrapper.name()).to.equal(name + " Wrapperv2");
        expect(await T20Wrapper.symbol()).to.equal("w" + symbol);
    });

    it("Upgrade Sync", async function() {
        const tpl = await ethers.getContractFactory("SyncTplV2");
        syncImplV2 = await tpl.deploy();
        await manager.setSyncImpl(syncImplV2.address);
        expect(await factory.syncImpl()).to.equal(syncImplV2.address)

        const s = await factory.getSync(symbol);

        await manager.upgradeImplTo(s, syncImplV2.address);

        const sync = await tpl.attach(s);
        expect(await sync.implementation()).to.equal(syncImplV2.address);

        expect(await sync.name()).to.equal(symbol + "v2");
        expect(await sync.symbol()).to.equal(symbol);
    });

    it("Upgrade Factory", async function() {
        let tpl = await ethers.getContractFactory("FactoryV2");
        factoryImplV2 = await tpl.deploy();

        await manager.upgradeImplTo(factory.address, factoryImplV2.address);
        factory = await tpl.attach(factory.address);

        expect(await factory.implementation()).to.equal(factoryImplV2.address);
        expect(await factory.name()).to.equal("factory v2");

        const triple = await factory.getTriple(symbol);
        tpl = await ethers.getContractFactory("ERC20TplV2");
        const T20 = await tpl.attach(triple.ERC20);
        expect(await T20.symbol()).to.equal(symbol);
    });

    it("Upgrade Manager", async function() {
        let tpl = await ethers.getContractFactory("ManagerV2");
        managerImplV2 = await tpl.deploy();

        await manager.upgradeImplTo(manager.address, managerImplV2.address);
        manager = await tpl.attach(manager.address);

        expect(await manager.implementation()).to.equal(managerImplV2.address);
        expect(await manager.name()).to.equal("manager v2");
        expect(await manager.factory()).to.equal(factory.address);
        expect(await factory.manager()).to.equal(manager.address);
    });
});
