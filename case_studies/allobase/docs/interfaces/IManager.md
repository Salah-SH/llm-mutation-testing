# Solidity API

## IManager

### factory

```solidity
function factory() external view returns (contract IFactory)
```

Returns the current factory contract address

_Can not be changed any more_

### issueFeeRecipient

```solidity
function issueFeeRecipient() external view returns (address)
```

Returns the current issue fee recipient

_Can be changed by the current fee controller via setIssueFeeRecipient_

### redeemFeeRecipient

```solidity
function redeemFeeRecipient() external view returns (address)
```

Returns the current redeem fee recipient

_Can be changed by the current fee controller via setRedeemFeeRecipient_

### managementFeeRecipient

```solidity
function managementFeeRecipient() external view returns (address)
```

Returns the current management fee recipient

_Can be changed by the current fee controller via setManagementFeeRecipient_

### factoryController

```solidity
function factoryController() external view returns (address)
```

Returns the current factory controller

_Can be changed by the current factory controller via setFactoryController_

### feeController

```solidity
function feeController() external view returns (address)
```

Returns the current fee controller

_Can be changed by the current fee controller via setFeeController_

### assetController

```solidity
function assetController() external view returns (address)
```

Returns the current asset controller

_Can be changed by the current asset controller via setAssetController_

### syncController

```solidity
function syncController() external view returns (address)
```

Returns the current sync controller

_Can be changed by the current sync controller via setSyncController_

### rebaseController

```solidity
function rebaseController() external view returns (address)
```

Returns the current rebase controller

_Can be changed by the current rebase controller via setRebaseController_

### rebaseInterval

```solidity
function rebaseInterval() external view returns (uint256)
```

Returns the current rebase interval

_Can be changed by the current fee controller via setRebaseInterval_

### feeBase

```solidity
function feeBase() external pure returns (uint256)
```

Returns the fee base

### rebaseFeeRates

```solidity
function rebaseFeeRates(string symbol) external view returns (uint256)
```

Returns the rebase fee rate for a given symbol, or 0 if it does not exist

_Can be changed by the current fee controller via setRebaseFeeRate_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| symbol | string | The symbol of the ERC20 token |

### rebaseHistories

```solidity
function rebaseHistories(string symbol) external view returns (uint256)
```

Returns the rebase history timestamp for a given symbol, or 0 if it does not exist

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| symbol | string | The symbol of the ERC20 token |

### initialize

```solidity
function initialize(address _issueFeeRecipient, address _redeemFeeRecipient, address _managementFeeRecipient, address _feeController, address _assetController, address _factoryController, address _syncController, address _rebaseController, address _factory) external
```

_initialize the contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _issueFeeRecipient | address | The issue fee recipient |
| _redeemFeeRecipient | address | The redeem fee recipient |
| _managementFeeRecipient | address | The management fee recipient |
| _feeController | address | The fee controller |
| _assetController | address | The asset controller |
| _factoryController | address | The factory controller |
| _syncController | address | The sync controller |
| _rebaseController | address | The rebase controller |
| _factory | address | The factory contract address |

### setIssueFeeRecipient

```solidity
function setIssueFeeRecipient(address newRecipient) external
```

Updates the current issue fee recipient

_Must be called by the current fee controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newRecipient | address | The new issue fee recipient |

### setRedeemFeeRecipient

```solidity
function setRedeemFeeRecipient(address newRecipient) external
```

Updates the current redeem fee recipient

_Must be called by the current fee controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newRecipient | address | The new redeem fee recipient |

### setManagementFeeRecipient

```solidity
function setManagementFeeRecipient(address newRecipient) external
```

Updates the current management fee recipient

_Must be called by the current fee controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newRecipient | address | The new management fee recipient |

### setFactoryController

```solidity
function setFactoryController(address newController) external
```

Updates the current factory controller

_Must be called by the current factory controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newController | address | The new factory controller |

### setFeeController

```solidity
function setFeeController(address newController) external
```

Updates the current fee controller

_Must be called by the current fee controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newController | address | The new fee controller |

### setAssetController

```solidity
function setAssetController(address newController) external
```

Updates the current asset controller

_Must be called by the current asset controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newController | address | The new asset controller |

### setSyncController

```solidity
function setSyncController(address newController) external
```

Updates the current sync controller

_Must be called by the current sync controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newController | address | The new sync controller |

### setRebaseController

```solidity
function setRebaseController(address newController) external
```

Updates the current rebase controller

_Must be called by the current rebase controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newController | address | The new rebase controller |

### setRebaseInterval

```solidity
function setRebaseInterval(uint256 newInterval) external
```

Updates the current rebase interval

_Must be called by the current fee controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newInterval | uint256 | The new rebase interval |

### setRebaseFeeRateTo

```solidity
function setRebaseFeeRateTo(string symbol, uint256 feeRate) external
```

Updates the current rebase fee rate for a given symbol

_Must be called by the current fee controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| symbol | string | The symbol of the ERC20 token |
| feeRate | uint256 | The new rebase fee rate |

### rebaseTo

```solidity
function rebaseTo(string symbol) external
```

Does rebase for management fee collection for a given symbol

_Must be called by the current asset controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| symbol | string | The symbol of the ERC20 token |

### pauseTo

```solidity
function pauseTo(address tokenAddr) external
```

Triggers stopped state

_Must be called by the current asset controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenAddr | address | The ERC20 or ERC20Wrapper contract address |

### unpauseTo

```solidity
function unpauseTo(address tokenAddr) external
```

Returns to normal state

_Must be called by the current asset controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenAddr | address | The ERC20 or ERC20Wrapper contract address |

### freezeTo

```solidity
function freezeTo(address tokenAddr, address addr) external
```

Freezes an address balance

_Must be called by the current asset controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenAddr | address | The ERC20 or ERC20Wrapper contract address |
| addr | address | The address to freeze |

### unfreezeTo

```solidity
function unfreezeTo(address tokenAddr, address addr) external
```

Unfreezes an address balance

_Must be called by the current asset controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenAddr | address | The ERC20 or ERC20Wrapper contract address |
| addr | address | The address to unfreeze |

### freezeToBoth

```solidity
function freezeToBoth(string symbol, address addr) external
```

Freezes an address balance both on ERC20 and ERC20 wrapper contract

_Must be called by the current asset controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| symbol | string | The symbol of the ERC20 token |
| addr | address | The address to freeze |

### unfreezeToBoth

```solidity
function unfreezeToBoth(string symbol, address addr) external
```

Unfreezes an address balance both on ERC20 and ERC20 wrapper contract

_Must be called by the current asset controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| symbol | string | The symbol of the ERC20 token |
| addr | address | The address to freeze |

### wipeFrozenAddressTo

```solidity
function wipeFrozenAddressTo(address tokenAddr, address fromAddr, address toAddr) external
```

Wipes the balance of a frozen address

_Must be called by the current asset controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenAddr | address | The ERC20 or ERC20Wrapper contract address |
| fromAddr | address | The frozen address to wipe |
| toAddr | address | The address to receive the wiped token |

### wipeFrozenAddressToBoth

```solidity
function wipeFrozenAddressToBoth(string symbol, address fromAddr, address toAddr) external
```

Wipes the balance of a frozen address both on ERC20 and ERC20 wrapper contract

_Must be called by the current asset controller
 @param symbol The symbol of the ERC20 token_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| symbol | string |  |
| fromAddr | address | The frozen address to wipe |
| toAddr | address | The address to receive the wiped token |

### createTriple

```solidity
function createTriple(string name, string symbol, string underlyingUnit) external returns (struct IFactory.triple t, address s)
```

Create a new triple

_Must be called by the current factory controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| name | string | The ERC20 token name |
| symbol | string | The ERC20 token symbol |
| underlyingUnit | string | The unit of underlying amount, eg `kg`, `oz` |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| t | struct IFactory.triple | The erc721/erc20/erc20Wrapper address triple |
| s | address | The address of the Sync contract |

### setBaseURITo

```solidity
function setBaseURITo(address tokenAddr, string baseURI) external
```

Updates the current baseURI for a given symbol

_Must be called by the current asset controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenAddr | address | The ERC721 contract address |
| baseURI | string | The new baseURI |

### setTokenURITo

```solidity
function setTokenURITo(address tokenAddr, uint256[] tokenIds, string[] tokenURIs) external
```

Updates the tokenURI for a given symbol

_Must be called by the current asset controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenAddr | address | The ERC721 contract address |
| tokenIds | uint256[] | The tokenIds need to be updated |
| tokenURIs | string[] | The new tokenURIs |

### issueTo

```solidity
function issueTo(string symbol, address toAddr, uint256 issueFeeRate, string[] tokenURIs, uint256[] erc20Amounts) external
```

Issues ERC721 and ERC20 token for a given symbol

_Must be called by the current asset controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| symbol | string | The ERC20 token symbol |
| toAddr | address | The receive address |
| issueFeeRate | uint256 | The issue fee rate |
| tokenURIs | string[] | The ERC721 tokenURIs |
| erc20Amounts | uint256[] | The ERC20 token amounts |

### redeemFrom

```solidity
function redeemFrom(string symbol, address fromAddr, uint256 redeemFeeRate, uint256[2] amount, uint256[2] deadline, uint8[2] v, bytes32[4] rs, uint256[] erc721TokenIds) external
```

Redeems ERC721 and ERC20 token for a given symbol

_Must be called by the current asset controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| symbol | string | The ERC20 token symbol |
| fromAddr | address | The address that redeem from |
| redeemFeeRate | uint256 | The redeem fee rate |
| amount | uint256[2] | The permit and redemption ERC20 token amount, 0: permit, 1: redemption |
| deadline | uint256[2] | The permit and redemption deadline, 0: permit, 1: redemption |
| v | uint8[2] | The permit and redemption signature v, 0: permit, 1: redemption |
| rs | bytes32[4] | The permit and redemption signature r/s, 0: permit r, 1: permit s, 2 redemption r, 3 redemption s |
| erc721TokenIds | uint256[] | The ERC721 tokenIds |

### setDefiPairTo

```solidity
function setDefiPairTo(address syncAddr, address pair) external
```

Inserts defi pair(eg. uniswap V2 pair) address into sync contract

_Must be called by the current sync controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| syncAddr | address | The sync contract address |
| pair | address | The defi pair(eg. uniswap V2 pair) |

### delDefiPairTo

```solidity
function delDefiPairTo(address syncAddr, address pair) external
```

Deletes defi pair(eg. uniswap V2 pair) address from sync contract

_Must be called by the current sync controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| syncAddr | address | The sync contract address |
| pair | address | The defi pair(eg. uniswap V2 pair) |

### setERC721Impl

```solidity
function setERC721Impl(address newImpl) external
```

Updates the ERC721 implementation of the factory

_Must be called by the current factory controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newImpl | address | The new ERC721 implementation of the factory |

### setERC20Impl

```solidity
function setERC20Impl(address newImpl) external
```

Updates the ERC20 implementation of the factory

_Must be called by the current factory controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newImpl | address | The new ERC20 implementation of the factory |

### setERC20WrapperImpl

```solidity
function setERC20WrapperImpl(address newImpl) external
```

Updates the ERC20 wrapper implementation of the factory

_Must be called by the current factory controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newImpl | address | The new ERC20 wrapper implementation of the factory |

### setSyncImpl

```solidity
function setSyncImpl(address newImpl) external
```

Updates the Sync implementation of the factory

_Must be called by the current factory controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newImpl | address | The new Sync implementation of the factory |

### upgradeImplTo

```solidity
function upgradeImplTo(address proxy, address newImpl) external
```

Upgrade the implementation of the proxy to `newImplementation`

_Must be called by the current factory controller_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| proxy | address | The proxy contract |
| newImpl | address | The new implementation |

