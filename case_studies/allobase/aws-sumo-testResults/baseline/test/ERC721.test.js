const { expect } = require("chai");
// const { loadFixture } = require("ethereum-waffle");
const {waffle} = require("hardhat");
const { deployTokens } = require('./helper.js');
const {loadFixture} = waffle;

describe.only("Test ERC721Underlying", function () {
  async function deployTokensAndMint() {
    [managerEoaMock, addr2, addr3] = await ethers.getSigners();

    const {factory, manager, nft, ft, wft} = await deployTokens('AU ALLO', 'AUAL', 'OZ');
    await nft.connect(managerEoaMock).issue(addr2.address, [
      ethers.BigNumber.from("100"),
      ethers.BigNumber.from("200"),
    ], ['','2-b']);

    await nft.connect(managerEoaMock).safeIssue(addr2.address, [
      ethers.BigNumber.from("300"),
    ], [''], '0x');

    let ERC721ReceiverMock;
    ERC721ReceiverMock = await ethers.getContractFactory("ERC721ReceiverMock1");
    ERC721ReceiverMock1 = await ERC721ReceiverMock.deploy();

    ERC721ReceiverMock = await ethers.getContractFactory("ERC721ReceiverMock2");
    ERC721ReceiverMock2 = await ERC721ReceiverMock.deploy();

    ERC721ReceiverMock = await ethers.getContractFactory("ERC721ReceiverMock3");
    ERC721ReceiverMock3 = await ERC721ReceiverMock.deploy();

    ERC721ReceiverMock = await ethers.getContractFactory("ERC721ReceiverMock4");
    ERC721ReceiverMock4 = await ERC721ReceiverMock.deploy();

    return {factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3, ERC721ReceiverMock1, ERC721ReceiverMock2, ERC721ReceiverMock3, ERC721ReceiverMock4};
  }

  it("Metadata", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await loadFixture(deployTokensAndMint);
    
    expect(await nft.name()).to.equal("AU ALLO NFT");
    expect(await nft.symbol()).to.equal("AUALNFT");

    expect(await nft.tokenURI(1)).to.equal("");
    expect(await nft.tokenURI(2)).to.equal("");

    await nft.connect(managerEoaMock).setBaseURI('www.blockallo.com/');
    expect(await nft.tokenURI(1)).to.equal("www.blockallo.com/1");
    expect(await nft.tokenURI(2)).to.equal("www.blockallo.com/2-b");
    expect(await nft.tokenURI(3)).to.equal("www.blockallo.com/3");

    await nft.connect(managerEoaMock).setTokenURI(1, "1-a");
    expect(await nft.tokenURI(1)).to.equal("www.blockallo.com/1-a");
    expect(await nft.tokenURI(2)).to.equal("www.blockallo.com/2-b");
    expect(await nft.tokenURI(3)).to.equal("www.blockallo.com/3");
    expect(await nft.underlyingUnit()).to.equal("OZ");

    await expect(nft.connect(managerEoaMock).setTokenURI(100, "100-a")).to.be.revertedWith("ERC721: invalid token ID");
  });

  it("Balance", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3} = await loadFixture(deployTokensAndMint);
    expect(await nft.balanceOf(addr2.address)).to.equal(3);
    expect(await nft.totalSupply()).to.equal(3);
    expect(await nft.ownerOf(1)).to.equal(addr2.address);
    expect(await nft.ownerOf(2)).to.equal(addr2.address);
    expect(await nft.ownerOf(3)).to.equal(addr2.address);
  });

  it("Underlying", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3} = await loadFixture(deployTokensAndMint);
    expect(await nft.totalUnderlying()).to.equal(600);
    expect(await nft.underlyingOf(1)).to.equal(100);
    expect(await nft.underlyingOf(2)).to.equal(200);
    expect(await nft.underlyingOf(3)).to.equal(300);
    expect(await nft.underlyingDecimals()).to.equal(18);
  });

  it("issue", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3, ERC721ReceiverMock1, ERC721ReceiverMock2, ERC721ReceiverMock3, ERC721ReceiverMock4} = await loadFixture(deployTokensAndMint);

    await expect(nft.connect(managerEoaMock).issue(addr3.address, [
      ethers.BigNumber.from("0"),
      ethers.BigNumber.from("500")
    ], ['',''])).to.be.revertedWith("ERC721: mint underlying out of bounds");

    await expect(nft.connect(managerEoaMock).issue(addr3.address, [
      ethers.BigNumber.from("1"),
      ethers.BigNumber.from("0x1000000000000000000000000")
    ], ['',''])).to.be.revertedWith("ERC721: mint underlying out of bounds");

    await nft.connect(managerEoaMock).pause();
    await expect(nft.connect(managerEoaMock).issue(addr3.address, [
      ethers.BigNumber.from("400"),
      ethers.BigNumber.from("500")
    ], ['',''])).to.be.revertedWith("Pausable: paused");
    await nft.connect(managerEoaMock).unpause();

    await nft.connect(managerEoaMock).issue(addr3.address, [
      ethers.BigNumber.from("400"),
      ethers.BigNumber.from("500")
    ], ['','']);

    expect(await nft.balanceOf(addr3.address)).to.equal(2);
    expect(await nft.ownerOf(4)).to.equal(addr3.address);
    expect(await nft.ownerOf(5)).to.equal(addr3.address);
    expect(await nft.totalUnderlying()).to.equal(1500);

    await nft.connect(managerEoaMock).pause();
    await expect(nft.connect(managerEoaMock).safeIssue(ERC721ReceiverMock1.address, [
      ethers.BigNumber.from("400"),
      ethers.BigNumber.from("500"),
    ], ['', ''], '0x')).to.be.revertedWith("Pausable: paused");
    await nft.connect(managerEoaMock).unpause();

    await nft.connect(managerEoaMock).safeIssue(ERC721ReceiverMock1.address, [
      ethers.BigNumber.from("400"),
      ethers.BigNumber.from("500"),
    ], ['', ''], '0x');

    expect(await nft.balanceOf(ERC721ReceiverMock1.address)).to.equal(2);
    expect(await nft.totalSupply()).to.equal(7);
    expect(await nft.ownerOf(6)).to.equal(ERC721ReceiverMock1.address);
    expect(await nft.ownerOf(7)).to.equal(ERC721ReceiverMock1.address);

    await expect(nft.connect(managerEoaMock).safeIssue(ERC721ReceiverMock2.address, [
      ethers.BigNumber.from("400"),
      ethers.BigNumber.from("500"),
    ], ['', ''], '0x')).to.be.revertedWith("ERC721: transfer to non ERC721Receiver implementer");

    await expect(nft.connect(managerEoaMock).safeIssue(ERC721ReceiverMock3.address, [
      ethers.BigNumber.from("400"),
      ethers.BigNumber.from("500"),
    ], ['', ''], '0x')).to.be.revertedWith("ERC721: transfer to non ERC721Receiver implementer");

    await expect(nft.connect(managerEoaMock).safeIssue(ERC721ReceiverMock4.address, [
      ethers.BigNumber.from("400"),
      ethers.BigNumber.from("500"),
    ], ['', ''], '0x')).to.be.revertedWith("ERC721Receiver revert test");
  });

  it("Redeem", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3} = await loadFixture(deployTokensAndMint);
    expect(await nft.balanceOf(addr2.address)).to.equal(3);

    const params = [
      ethers.BigNumber.from("2"),
      ethers.BigNumber.from("3")
    ];
    await expect(nft.connect(managerEoaMock).redeem(params)).to.be.revertedWith("ERC721: burn not owner");

    await nft.connect(addr2).transferFrom(addr2.address, managerEoaMock.address, ethers.BigNumber.from("2"));
    await nft.connect(addr2).transferFrom(addr2.address, managerEoaMock.address, ethers.BigNumber.from("3"));

    await nft.connect(managerEoaMock).pause();
    await expect(nft.connect(managerEoaMock).redeem(params)).to.be.revertedWith("Pausable: paused");
    await nft.connect(managerEoaMock).unpause();

    await nft.connect(managerEoaMock).redeem(params);
    expect(await nft.balanceOf(addr2.address)).to.equal(1);
    expect(await nft.balanceOf(manager.address)).to.equal(0);
    expect(await nft.totalSupply()).to.equal(1);
    expect(await nft.totalUnderlying()).to.equal(100);
    expect(await nft.ownerOf(1)).to.equal(addr2.address);
    await expect(nft.ownerOf(2)).to.be.revertedWith("ERC721: invalid token ID");
    await expect(nft.ownerOf(3)).to.be.revertedWith("ERC721: invalid token ID");
    await expect(nft.underlyingOf(2)).to.be.revertedWith("ERC721: invalid token ID");
    await expect(nft.underlyingOf(3)).to.be.revertedWith("ERC721: invalid token ID");
  });

  it("Transfer", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3, ERC721ReceiverMock1, ERC721ReceiverMock2, ERC721ReceiverMock3, ERC721ReceiverMock4 } = await loadFixture(deployTokensAndMint);

    await nft.connect(addr2).transferFrom(addr2.address, addr3.address, ethers.BigNumber.from("2"));

    expect(await nft.balanceOf(addr2.address)).to.equal(2);
    expect(await nft.balanceOf(addr3.address)).to.equal(1);
    expect(await nft.ownerOf(2)).to.equal(addr3.address);
    expect(await nft.ownerOf(3)).to.equal(addr2.address);

    // expect underlying not change
    expect(await nft.underlyingOf(1)).to.equal(100);
    expect(await nft.underlyingOf(2)).to.equal(200);
    expect(await nft.underlyingOf(3)).to.equal(300);

    await nft.connect(addr2)["safeTransferFrom(address,address,uint256)"](addr2.address, addr3.address, ethers.BigNumber.from("3"));
    expect(await nft.balanceOf(addr2.address)).to.equal(1);
    expect(await nft.balanceOf(addr3.address)).to.equal(2);
    expect(await nft.ownerOf(3)).to.equal(addr3.address);
    expect(await nft.ownerOf(1)).to.equal(addr2.address);

    await expect(nft.connect(addr2)["safeTransferFrom(address,address,uint256)"](addr2.address, ERC721ReceiverMock2.address, ethers.BigNumber.from("1"))).to.be.revertedWith("ERC721: transfer to non ERC721Receiver implementer");
    await expect(nft.connect(addr2)["safeTransferFrom(address,address,uint256)"](addr2.address, ERC721ReceiverMock3.address, ethers.BigNumber.from("1"))).to.be.revertedWith("ERC721: transfer to non ERC721Receiver implementer");
    await expect(nft.connect(addr2)["safeTransferFrom(address,address,uint256)"](addr2.address, ERC721ReceiverMock4.address, ethers.BigNumber.from("1"))).to.be.revertedWith("ERC721Receiver revert test");
    await nft.connect(addr2)["safeTransferFrom(address,address,uint256)"](addr2.address, ERC721ReceiverMock1.address, ethers.BigNumber.from("1"));
  });

  it("Approve", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await loadFixture(deployTokensAndMint);

    await nft.connect(addr2).approve(managerEoaMock.address, ethers.BigNumber.from("2"));
    expect(await nft.getApproved(ethers.BigNumber.from("2"))).to.equal(managerEoaMock.address);
    expect(await nft.isApprovedForAll(addr2.address, managerEoaMock.address)).to.equal(false);

    await expect(nft.getApproved(ethers.BigNumber.from("100"))).to.be.revertedWith("ERC721: invalid token ID");

    await nft.connect(managerEoaMock).transferFrom(addr2.address, addr3.address, ethers.BigNumber.from("2"));

    await nft.connect(addr2).setApprovalForAll(managerEoaMock.address, true);
    expect(await nft.isApprovedForAll(addr2.address, managerEoaMock.address)).to.equal(true);

    await nft.connect(addr2).setApprovalForAll(managerEoaMock.address, false);
    expect(await nft.isApprovedForAll(addr2.address, managerEoaMock.address)).to.equal(false);

    
    
  });

  it("Pause", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await loadFixture(deployTokensAndMint);
    await nft.connect(managerEoaMock).pause();
    expect(await nft.paused()).to.equal(true);

    await expect(nft.connect(addr2).transferFrom(addr2.address, addr3.address, ethers.BigNumber.from("2"))).to.be.revertedWith("Pausable: paused");
    await expect(nft.connect(addr2)["safeTransferFrom(address,address,uint256)"](addr2.address, addr3.address, ethers.BigNumber.from("2"))).to.be.revertedWith("Pausable: paused");
    await expect(nft.connect(addr2)["safeTransferFrom(address,address,uint256,bytes)"](addr2.address, addr3.address, ethers.BigNumber.from("2"), '0x')).to.be.revertedWith("Pausable: paused");

    await nft.connect(managerEoaMock).unpause();
    expect(await nft.paused()).to.equal(false);

    await nft.connect(addr2).transferFrom(addr2.address, addr3.address, ethers.BigNumber.from("2"));
  });

  it("supportsInterface", async function () {
    const { nft } = await loadFixture(deployTokensAndMint);
    // expect(await nft.supportsInterface("0x780e9d63")).to.equal(true); // type(IERC721Enumerable).interfaceId
    expect(await nft.supportsInterface("0x80ac58cd")).to.equal(true); // type(IERC721).interfaceId
    expect(await nft.supportsInterface("0x5b5e139f")).to.equal(true); // type(IERC721Metadata).interfaceId
  });

  it("Upgrade", async function () {
    const { factory, manager, nft, ft, wft, managerEoaMock, addr2, addr3 } = await loadFixture(deployTokensAndMint);

    let oldImpl = await nft.connect(managerEoaMock).implementation();
    let ERC721Token = await ethers.getContractFactory("ERC721Tpl");
    let erc721OldImpl = await ERC721Token.attach(oldImpl);
    await expect(erc721OldImpl.initialize('a', 'b', factory.address, ft.address, 'oz')).to.be.revertedWith("Initializable: contract is already initialized");
    expect(await erc721OldImpl.proxiableUUID()).to.equal("0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc");

    let newImpl = await ethers.getContractFactory("ERC721TplV2");
    erc721NewImpl = await newImpl.deploy();
    await expect(nft.connect(addr2).upgradeTo(erc721NewImpl.address)).to.be.revertedWith("Not manager");
    await expect(erc721OldImpl.connect(managerEoaMock).upgradeTo(erc721NewImpl.address)).to.be.revertedWith("Function must be called through delegatecall");
    await nft.connect(managerEoaMock).upgradeTo(erc721NewImpl.address);

    expect(await nft.connect(managerEoaMock).implementation()).to.equal(erc721NewImpl.address);

    expect(await nft.name()).to.equal("AU ALLO NFTv2");

    // stay unchanged after upgrading
    expect(await nft.symbol()).to.equal("AUALNFT");
    expect(await nft.balanceOf(addr2.address)).to.equal(3);
    expect(await nft.totalSupply()).to.equal(3);
    expect(await nft.ownerOf(1)).to.equal(addr2.address);
    expect(await nft.ownerOf(2)).to.equal(addr2.address);
    expect(await nft.ownerOf(3)).to.equal(addr2.address);
    expect(await nft.totalUnderlying()).to.equal(600);
    expect(await nft.underlyingOf(1)).to.equal(100);
    expect(await nft.underlyingOf(2)).to.equal(200);
    expect(await nft.underlyingOf(3)).to.equal(300);
    expect(await nft.underlyingDecimals()).to.equal(18);
  });

  // async function permitSig(nft, tokenId, deadline, spenderAddr) {
  //   const nonce = ethers.BigNumber.from(await nft.nonces(tokenId));
    
  //   const domain = {
  //       name: await nft.name(),
  //       version: '1',
  //       chainId: await nft.signer.getChainId(),
  //       verifyingContract: nft.address
  //   };

  //   const types = {
  //       Permit: [
  //           {name:'spender', type:'address'},
  //           {name:'tokenId', type:'uint256'},
  //           {name:'nonce', type:'uint256'},
  //           {name:'deadline', type:'uint256'}
  //       ]
  //   };

  //   const message = {
  //       spender: spenderAddr,
  //       tokenId: tokenId,
  //       nonce: nonce,
  //       deadline: deadline
  //   };

  //   const signature = await nft.signer._signTypedData(domain, types, message);
  //   const sig = ethers.utils.splitSignature(signature);
  //   return sig;
  // }

  // it("Permit", async function () {
  //   const { nft, manager, addr2 : managerEoaMock, addr3 : spender} = await loadFixture(deployTokensAndMint);

  //   const tokenId = ethers.BigNumber.from(1);
  //   expect(await nft.getApproved(tokenId)).to.equal("0x0000000000000000000000000000000000000000");

  //   const deadlinePassed = ethers.BigNumber.from(1640995200);  // 2022-01-01
  //   const sigPassed = await permitSig(nft.connect(managerEoaMock), tokenId, deadlinePassed, spender.address);
  //   await expect(nft.permit(spender.address, tokenId, deadlinePassed, sigPassed.v, sigPassed.r, sigPassed.s)).to.be.revertedWith("ERC721: Permit expired");

  //   const deadline = ethers.BigNumber.from(1956528000);  // 2032-01-01
  //   const sig = await permitSig(nft.connect(managerEoaMock), tokenId, deadline, spender.address);
  //   await nft.permit(spender.address, tokenId, deadline, sig.v, sig.r, sig.s);
  //   expect(await nft.getApproved(tokenId)).to.equal(spender.address);
  // });



});