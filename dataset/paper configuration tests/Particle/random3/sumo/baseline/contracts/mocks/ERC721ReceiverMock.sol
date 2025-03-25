// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.8.3;

import '@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol';

contract ERC721ReceiverMock1 {
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return IERC721ReceiverUpgradeable.onERC721Received.selector;
    }
}

contract ERC721ReceiverMock2 {
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return 0xaaaaaaaa;
    }
}

contract ERC721ReceiverMock3 {
    function onERC721ReceivedAAA(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return 0xf0b9e5ba;
    }
}

contract ERC721ReceiverMock4 {
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        revert('ERC721Receiver revert test');
    }
}
