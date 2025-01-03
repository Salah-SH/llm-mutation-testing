// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.8.3;

import '../contracts/Factory.sol';
import '../contracts/templates/ERC20Tpl.sol';
import '../contracts/templates/ERC20WrapperTpl.sol';
import '../contracts/templates/ERC721Tpl.sol';
import '../contracts/templates/SyncTpl.sol';
import '../contracts/templates/ERC1967Proxy.sol';
import '../contracts/mocks/ERC20TplWithBurn.sol';

import '../contracts/interfaces/IFactory.sol';

contract Alice {
    constructor() {}

    function approvalErc721(
        address erc721,
        address spender,
        uint256 tokenId
    ) public {
        (bool t, ) = erc721.call(abi.encodeWithSignature('approve(address,uint256)', spender, tokenId));
        require(t);
    }

    function approveAllErc721(
        address erc721,
        address operator,
        bool approved
    ) public {
        (bool t, ) = erc721.call(abi.encodeWithSignature('setApprovalForAll(address,bool)', operator, approved));
        require(t);
    }
}

contract TplERC721EchidnaTest {
    using StringsUpgradeable for uint256;

    IFactory.triple t;
    uint256 internal _initUnderlyingSupply;
    uint256 internal _initSupply;
    string internal _baseUri;

    Alice internal alice;

    constructor() payable {
        address f = address(new ERC1967Proxy(address(0x40), new bytes(0)));
        IFactory(f).initialize(address(0x41), address(0x42), address(0x43), address(0x44), address(this));
        (t, , ) = IFactory(f).createTriple('PD ALLO', 'PDAL', 'OZ');

        alice = new Alice();

        alice.approveAllErc721(t.ERC721, address(this), true);

        uint256 nums = 100;
        uint256[] memory underlyings = new uint256[](nums);
        string[] memory tokenURIs = new string[](nums);
        uint8 decimals = IERC721Tpl(t.ERC721).underlyingDecimals();

        uint256 initUnderlyingSupply = 0;
        for (uint256 i = 0; i < nums; i++) {
            uint256 underlying = 1 * decimals;
            underlyings[i] = underlying;
            tokenURIs[i] = '';
            initUnderlyingSupply += underlying;
        }

        IERC721Tpl(t.ERC721).issue(address(this), underlyings, tokenURIs);
        IERC721Tpl(t.ERC721).issue(address(alice), underlyings, tokenURIs);

        _baseUri = 'ipfs://abc/';
        IERC721Tpl(t.ERC721).setBaseURI(_baseUri);

        _initUnderlyingSupply = initUnderlyingSupply * 2;
        _initSupply = nums * 2;
    }

    function fuzzIssue(uint256[] calldata underlyings, string[] calldata tokenURIs) public {
        IERC721Tpl erc721 = IERC721Tpl(t.ERC721);
        uint256 totalSupply = erc721.totalSupply();
        uint256 totalUnderlying = erc721.totalUnderlying();

        address mintTo = msg.sender;
        uint256 count = underlyings.length;
        uint256 balanceBefore = erc721.balanceOf(mintTo);
        uint256 newUnderlying = 0;
        for (uint256 i = 0; i < count; i++) {
            newUnderlying += underlyings[i];
        }

        erc721.issue(mintTo, underlyings, tokenURIs);

        _initSupply += count;
        _initUnderlyingSupply += newUnderlying;

        assert(erc721.totalSupply() == totalSupply + count && erc721.totalSupply() == _initSupply);
        assert(
            erc721.totalUnderlying() == totalUnderlying + newUnderlying &&
                erc721.totalUnderlying() == _initUnderlyingSupply
        );
        assert(erc721.balanceOf(mintTo) == balanceBefore + count);
    }

    function fuzzRedeem(uint256[] calldata tokenIds) public {
        IERC721Tpl erc721 = IERC721Tpl(t.ERC721);
        uint256 totalSupply = erc721.totalSupply();
        uint256 totalUnderlying = erc721.totalUnderlying();

        uint256 count = tokenIds.length;
        uint256 balanceBefore = erc721.balanceOf(address(this));
        uint256 burnUnderlying = 0;
        for (uint256 i = 0; i < count; i++) {
            burnUnderlying += erc721.underlyingOf(tokenIds[i]);
        }

        erc721.redeem(tokenIds);

        _initSupply -= count;
        _initUnderlyingSupply -= burnUnderlying;

        assert(erc721.totalSupply() == totalSupply - count && erc721.totalSupply() == _initSupply);
        assert(
            erc721.totalUnderlying() == totalUnderlying - burnUnderlying &&
                erc721.totalUnderlying() == _initUnderlyingSupply
        );
        assert(erc721.balanceOf(address(this)) == balanceBefore - count);
    }

    function fuzzTransferFrom(address to, uint256 tokenId) public {
        IERC721Tpl erc721 = IERC721Tpl(t.ERC721);

        uint256 totalUnderlying = erc721.totalUnderlying();
        uint256 totalSupply = erc721.totalSupply();
        address from = erc721.ownerOf(tokenId);
        uint256 balanceFrom = erc721.balanceOf(from);
        uint256 balanceTo = erc721.balanceOf(to);

        erc721.transferFrom(address(this), to, tokenId);

        assert(erc721.ownerOf(tokenId) == to);
        if (from != to) {
            assert(erc721.balanceOf(from) == balanceFrom - 1);
            assert(erc721.balanceOf(to) == balanceTo + 1);
        } else {
            assert(erc721.balanceOf(from) == balanceFrom);
        }
        assert(erc721.totalUnderlying() == totalUnderlying && _initUnderlyingSupply == totalUnderlying);
        assert(erc721.totalSupply() == totalSupply);
    }

    function fuzzSetTokenURI(uint256 tokenId, string memory tokenUri) public {
        IERC721Tpl erc721 = IERC721Tpl(t.ERC721);

        erc721.setTokenURI(tokenId, tokenUri);

        string memory uri = erc721.tokenURI(tokenId);

        if (bytes(tokenUri).length > 0) {
            assert(keccak256(abi.encodePacked(_baseUri, tokenUri)) == keccak256(bytes(uri)));
        } else {
            assert(keccak256(abi.encodePacked(_baseUri, tokenId.toString())) == keccak256(bytes(uri)));
        }
    }

    function fuzzApprove(address to, uint256 tokenId) public {
        IERC721Tpl erc721 = IERC721Tpl(t.ERC721);

        erc721.approve(to, tokenId);

        assert(erc721.getApproved(tokenId) == to);
    }

    function fuzzSetApprovalForAll(address operator, bool approved) public {
        IERC721Tpl erc721 = IERC721Tpl(t.ERC721);

        erc721.setApprovalForAll(operator, approved);
        alice.approveAllErc721(t.ERC721, operator, approved);

        assert(erc721.isApprovedForAll(address(this), operator) == approved);
        assert(erc721.isApprovedForAll(address(alice), operator) == approved);
    }
}
