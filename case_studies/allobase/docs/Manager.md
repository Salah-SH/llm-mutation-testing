# Solidity API

## Manager

### factory

```solidity
contract IFactory factory
```

_See {IManager-factory}._

### issueFeeRecipient

```solidity
address issueFeeRecipient
```

_See {IManager-issueFeeRecipient}._

### redeemFeeRecipient

```solidity
address redeemFeeRecipient
```

_See {IManager-redeemFeeRecipient}._

### managementFeeRecipient

```solidity
address managementFeeRecipient
```

_See {IManager-managementFeeRecipient}._

### factoryController

```solidity
address factoryController
```

_See {IManager-factoryController}._

### feeController

```solidity
address feeController
```

_See {IManager-feeController}._

### assetController

```solidity
address assetController
```

_See {IManager-assetController}._

### syncController

```solidity
address syncController
```

_See {IManager-syncController}._

### rebaseController

```solidity
address rebaseController
```

_See {IManager-rebaseController}._

### rebaseInterval

```solidity
uint256 rebaseInterval
```

_See {IManager-rebaseInterval}._

### rebaseFeeRates

```solidity
mapping(string => uint256) rebaseFeeRates
```

_See {IManager-rebaseFeeRates}._

### rebaseHistories

```solidity
mapping(string => uint256) rebaseHistories
```

_See {IManager-rebaseHistories}._

### DOMAIN_SEPARATOR

```solidity
bytes32 DOMAIN_SEPARATOR
```

_Returns the domain separator used in the encoding of the signature for {validateRedemption}, as defined by {EIP712}._

### REDEEM_TYPEHASH

```solidity
bytes32 REDEEM_TYPEHASH
```

### nonces

```solidity
mapping(address => uint256) nonces
```

_Returns the current nonce for `owner`. This value must be
included whenever a signature is generated for {validateRedemption}.

Every successful call to {validateRedemption} increases ``owner``'s nonce by one. This
prevents a signature from being used multiple times._

### FactorySet

```solidity
event FactorySet(address oldAddr, address newAddr)
```

Emitted when factory is set

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| oldAddr | address | The old address of factory |
| newAddr | address | The new address of factory |

### IssueFeeRecipientSet

```solidity
event IssueFeeRecipientSet(address oldAddr, address newAddr)
```

Emitted when issue fee recipient is set

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| oldAddr | address | The old address of issue fee recipient |
| newAddr | address | The new address of issue fee recipient |

### RedeemFeeRecipientSet

```solidity
event RedeemFeeRecipientSet(address oldAddr, address newAddr)
```

Emitted when redeem fee recipient is set

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| oldAddr | address | The old address of redeem fee recipient |
| newAddr | address | The new address of redeem fee recipient |

### ManagementFeeRecipientSet

```solidity
event ManagementFeeRecipientSet(address oldAddr, address newAddr)
```

Emitted when management fee recipient is set

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| oldAddr | address | The old address of management fee recipient |
| newAddr | address | The new address of management fee recipient |

### FactoryControllerSet

```solidity
event FactoryControllerSet(address oldAddr, address newAddr)
```

Emitted when factory controller is set

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| oldAddr | address | The old address of factory controller |
| newAddr | address | The new address of factory controller |

### FeeControllerSet

```solidity
event FeeControllerSet(address oldAddr, address newAddr)
```

Emitted when fee controller is set

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| oldAddr | address | The old address of fee controller |
| newAddr | address | The new address of fee controller |

### AssetControllerSet

```solidity
event AssetControllerSet(address oldAddr, address newAddr)
```

Emitted when asset controller is set

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| oldAddr | address | The old address of asset controller |
| newAddr | address | The new address of asset controller |

### SyncControllerSet

```solidity
event SyncControllerSet(address oldAddr, address newAddr)
```

Emitted when sync controller is set

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| oldAddr | address | The old address of sync controller |
| newAddr | address | The new address of sync controller |

### RebaseControllerSet

```solidity
event RebaseControllerSet(address oldAddr, address newAddr)
```

Emitted when rebase controller is set

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| oldAddr | address | The old address of rebase controller |
| newAddr | address | The new address of rebase controller |

### RebaseIntervalSet

```solidity
event RebaseIntervalSet(uint256 oldInterval, uint256 newInterval)
```

Emitted when rebase interval is set

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| oldInterval | uint256 | The old interval of rebase |
| newInterval | uint256 | The new interval of rebase |

### IssueFeeRateSetTo

```solidity
event IssueFeeRateSetTo(string symbol, uint256 oldRate, uint256 newRate)
```

Emitted when issue fee rate is set

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| symbol | string | The ERC20 token symbol |
| oldRate | uint256 | The old rate of issue fee |
| newRate | uint256 | The new rate of issue fee |

### RedeemFeeRateSetTo

```solidity
event RedeemFeeRateSetTo(string symbol, uint256 oldRate, uint256 newRate)
```

Emitted when redeem fee rate is set

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| symbol | string | The ERC20 token symbol |
| oldRate | uint256 | The old rate of redeem fee |
| newRate | uint256 | The new rate of redeem fee |

### RebaseFeeRateSetTo

```solidity
event RebaseFeeRateSetTo(string symbol, uint256 oldRate, uint256 newRate)
```

Emitted when rebase fee rate is set

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| symbol | string | The ERC20 token symbol |
| oldRate | uint256 | The old rate of rebase fee |
| newRate | uint256 | The new rate of rebase fee |

### RebasedTo

```solidity
event RebasedTo(string symbol, uint256 timestamp)
```

Emitted when rebase executed

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| symbol | string | The ERC20 token symbol |
| timestamp | uint256 | The timestamp when rebase executed |

### BaseURISetTo

```solidity
event BaseURISetTo(address tokenAddr, string baseURI)
```

Emitted when baseURI is set

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenAddr | address | The ERC721 contract address |
| baseURI | string | The new baseURI |

### TokenURISetTo

```solidity
event TokenURISetTo(address tokenAddr, uint256[] tokenIds, string[] tokenURIs)
```

Emitted when tokenURI is set

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenAddr | address | The ERC721 contract address |
| tokenIds | uint256[] | The tokenIds need to be updated |
| tokenURIs | string[] | The new tokenURIs |

### Erc721IssuedTo

```solidity
event Erc721IssuedTo(string symbol, address toAddr, uint256[] erc20Amounts, string[] tokenURIs)
```

Emitted when ERC721 token is issued

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| symbol | string | The ERC20 token symbol |
| toAddr | address | The receive address |
| erc20Amounts | uint256[] | The ERC20 token amounts |
| tokenURIs | string[] | The ERC721 tokenURIs |

### Erc721RedeemedFrom

```solidity
event Erc721RedeemedFrom(string symbol, address fromAddr, uint256[] tokenIds)
```

Emitted when ERC721 token is redeemed

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| symbol | string | The ERC20 token symbol |
| fromAddr | address | The address to be redeemed from |
| tokenIds | uint256[] | The ERC721 tokenId to be redeemed |

### Erc20IssuedTo

```solidity
event Erc20IssuedTo(string symbol, address toAddr, uint256 amount)
```

Emitted when ERC20 token is issued

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| symbol | string | The ERC20 token symbol |
| toAddr | address | The receive address |
| amount | uint256 | The ERC20 token amount to be issued |

### Erc20RedeemedFrom

```solidity
event Erc20RedeemedFrom(string symbol, address fromAddr, uint256 amount)
```

Emitted when ERC20 token is redeemed

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| symbol | string | The ERC20 token symbol |
| fromAddr | address | The address to be redeemed from |
| amount | uint256 | The ERC20 token amount to be redeemed |

### PausedTo

```solidity
event PausedTo(address tokenAddr)
```

Emitted when pause executed

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenAddr | address | The ERC20 or ERC20Wrapper contract address |

### UnpausedTo

```solidity
event UnpausedTo(address tokenAddr)
```

Emitted when unpause executed

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenAddr | address | The ERC20 or ERC20Wrapper contract address |

### UpgradedTo

```solidity
event UpgradedTo(address proxy, address oldImpl, address newImpl)
```

Emitted when proxy upgraded

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| proxy | address | The proxy contract |
| oldImpl | address | The old implementation |
| newImpl | address | The new implementation |

### onlyFeeController

```solidity
modifier onlyFeeController()
```

### onlyAssetController

```solidity
modifier onlyAssetController()
```

### onlyFactoryController

```solidity
modifier onlyFactoryController()
```

### onlySyncController

```solidity
modifier onlySyncController()
```

### onlyRebaseController

```solidity
modifier onlyRebaseController()
```

### constructor

```solidity
constructor() public
```

### initialize

```solidity
function initialize(address _issueFeeRecipient, address _redeemFeeRecipient, address _managementFeeRecipient, address _feeController, address _assetController, address _factoryController, address _syncController, address _rebaseController, address _factory) public
```

_See {IManager-initialize}._

### feeBase

```solidity
function feeBase() public pure returns (uint256)
```

_See {IManager-feeBase}._

### setIssueFeeRecipient

```solidity
function setIssueFeeRecipient(address newRecipient) external
```

_See {IManager-setIssueFeeRecipient}._

### setRedeemFeeRecipient

```solidity
function setRedeemFeeRecipient(address newRecipient) external
```

_See {IManager-setRedeemFeeRecipient}._

### setManagementFeeRecipient

```solidity
function setManagementFeeRecipient(address newRecipient) external
```

_See {IManager-setManagementFeeRecipient}._

### setFactoryController

```solidity
function setFactoryController(address newController) external
```

_See {IManager-setFactoryController}._

### setFeeController

```solidity
function setFeeController(address newController) external
```

_See {IManager-setFeeController}._

### setAssetController

```solidity
function setAssetController(address newController) external
```

_See {IManager-setAssetController}._

### setSyncController

```solidity
function setSyncController(address newController) external
```

_See {IManager-setSyncController}._

### setRebaseController

```solidity
function setRebaseController(address newController) external
```

_See {IManager-setRebaseController}._

### setRebaseInterval

```solidity
function setRebaseInterval(uint256 newInterval) external
```

_See {IManager-setRebaseInterval}._

### checkTriple

```solidity
function checkTriple(string symbol) internal view returns (struct IFactory.triple t)
```

### checkFeeRate

```solidity
function checkFeeRate(uint256 feeRate) internal pure
```

### setRebaseFeeRateTo

```solidity
function setRebaseFeeRateTo(string symbol, uint256 feeRate) external
```

_See {IManager-setRebaseFeeRateTo}._

### rebaseTo

```solidity
function rebaseTo(string symbol) external
```

_See {IManager-rebaseTo}._

### pauseTo

```solidity
function pauseTo(address tokenAddr) external
```

_See {IManager-pauseTo}._

### unpauseTo

```solidity
function unpauseTo(address tokenAddr) external
```

_See {IManager-unpauseTo}._

### freezeTo

```solidity
function freezeTo(address tokenAddr, address addr) external
```

_See {IManager-freezeTo}._

### unfreezeTo

```solidity
function unfreezeTo(address tokenAddr, address addr) external
```

_See {IManager-unfreezeTo}._

### freezeToBoth

```solidity
function freezeToBoth(string symbol, address addr) external
```

_See {IManager-freezeToBoth}._

### unfreezeToBoth

```solidity
function unfreezeToBoth(string symbol, address addr) external
```

_See {IManager-unfreezeToBoth}._

### wipeFrozenAddressTo

```solidity
function wipeFrozenAddressTo(address tokenAddr, address fromAddr, address toAddr) external
```

_See {IManager-wipeFrozenAddressTo}._

### wipeFrozenAddressToBoth

```solidity
function wipeFrozenAddressToBoth(string symbol, address fromAddr, address toAddr) external
```

_See {IManager-wipeFrozenAddressToBoth}._

### setBaseURITo

```solidity
function setBaseURITo(address tokenAddr, string baseURI) external
```

_See {IManager-setBaseURITo}._

### setTokenURITo

```solidity
function setTokenURITo(address tokenAddr, uint256[] tokenIds, string[] tokenURIs) external
```

_See {IManager-setTokenURITo}._

### createTriple

```solidity
function createTriple(string name, string symbol, string underlyingUnit) external returns (struct IFactory.triple t, address s)
```

_See {IManager-createTriple}._

### issueTo

```solidity
function issueTo(string symbol, address toAddr, uint256 issueFeeRate, string[] tokenURIs, uint256[] erc20Amounts) external
```

_See {IManager-issueTo}._

### getTokenWeights

```solidity
function getTokenWeights(struct IFactory.triple t, uint256[] erc721TokenIds) internal view returns (uint256 tokenWeights)
```

_Gets ERC721 token underlying weight:kg/oz_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| t | struct IFactory.triple | The triple |
| erc721TokenIds | uint256[] | The ERC721 tokenIds |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenWeights | uint256 | The underlying token weight |

### redeemFrom

```solidity
function redeemFrom(string symbol, address fromAddr, uint256 redeemFeeRate, uint256[2] amount, uint256[2] deadline, uint8[2] v, bytes32[4] rs, uint256[] erc721TokenIds) external
```

_See {IManager-redeemFrom}._

### validateRedemption

```solidity
function validateRedemption(address owner, uint256 value, uint256[] tokenIds, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public
```

### setDefiPairTo

```solidity
function setDefiPairTo(address syncAddr, address pair) external
```

_See {IManager-setDefiPairTo}._

### delDefiPairTo

```solidity
function delDefiPairTo(address syncAddr, address pair) external
```

_See {IManager-delDefiPairTo}._

### setERC721Impl

```solidity
function setERC721Impl(address newImpl) external
```

_See {IManager-setERC721Impl}._

### setERC20Impl

```solidity
function setERC20Impl(address newImpl) external
```

_See {IManager-setERC20Impl}._

### setERC20WrapperImpl

```solidity
function setERC20WrapperImpl(address newImpl) external
```

_See {IManager-setERC20WrapperImpl}._

### setSyncImpl

```solidity
function setSyncImpl(address newImpl) external
```

_See {IManager-setSyncImpl}._

### upgradeImplTo

```solidity
function upgradeImplTo(address proxy, address newImpl) external
```

_See {IManager-upgradeImplTo}._

### _upgradeSelf

```solidity
function _upgradeSelf(address newImplementation) internal virtual
```

_Upgrade the implementation of the proxy to `newImplementation`.

Calls {_authorizeUpgrade}.

Emits an {Upgraded} event._

### _authorizeUpgrade

```solidity
function _authorizeUpgrade(address) internal
```

### implementation

```solidity
function implementation() public view returns (address)
```

