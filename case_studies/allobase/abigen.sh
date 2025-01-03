#!/bin/bash

tmpfile=$(mktemp /tmp/erc20Tpl.abi)
cat artifacts/contracts/templates/ERC20Tpl.sol/ERC20Tpl.json| jq -r '.abi' > "$tmpfile"
abigen --abi="$tmpfile" --pkg=erc20Tpl --out=abigens/erc20Tpl.go
sed -i '' -e '4s/erc20Tpl/token/' abigens/erc20Tpl.go
rm "$tmpfile"

tmpfile=$(mktemp /tmp/erc20WrapperTpl.abi)
cat artifacts/contracts/templates/ERC20WrapperTpl.sol/ERC20WrapperTpl.json| jq -r '.abi' > "$tmpfile"
abigen --abi="$tmpfile" --pkg=erc20WrapperTpl --out=abigens/erc20WrapperTpl.go
sed -i '' -e '4s/erc20WrapperTpl/token/' abigens/erc20WrapperTpl.go
rm "$tmpfile"

tmpfile=$(mktemp /tmp/erc721Tpl.abi)
cat artifacts/contracts/templates/ERC721Tpl.sol/ERC721Tpl.json| jq -r '.abi' > "$tmpfile"
abigen --abi="$tmpfile" --pkg=erc721Tpl --out=abigens/erc721Tpl.go
sed -i '' -e '4s/erc721Tpl/token/' abigens/erc721Tpl.go
rm "$tmpfile"

tmpfile=$(mktemp /tmp/syncTpl.abi)
cat artifacts/contracts/templates/SyncTpl.sol/SyncTpl.json| jq -r '.abi' > "$tmpfile"
abigen --abi="$tmpfile" --pkg=syncTpl --out=abigens/syncTpl.go
sed -i '' -e '4s/syncTpl/token/' abigens/syncTpl.go
rm "$tmpfile"

tmpfile=$(mktemp /tmp/manager.abi)
cat artifacts/contracts/Manager.sol/Manager.json| jq -r '.abi' > "$tmpfile"
abigen --abi="$tmpfile" --pkg=manager --out=abigens/manager.go
sed -i '' -e '4s/manager/token/' abigens/manager.go
rm "$tmpfile"

tmpfile=$(mktemp /tmp/factory.abi)
cat artifacts/contracts/Factory.sol/Factory.json| jq -r '.abi' > "$tmpfile"
abigen --abi="$tmpfile" --pkg=factory --out=abigens/factory.go
sed -i '' -e '4s/factory/token/' abigens/factory.go
rm "$tmpfile"


tmpfile=$(mktemp /tmp/erc20MetadataInterface.abi)

cat artifacts/@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol/IERC20MetadataUpgradeable.json| jq -r '.abi' > "$tmpfile"
abigen --abi="$tmpfile" --pkg=IERC20Metadata --out=abigens/erc20MetadataInterface.go
sed -i '' -e '4s/IERC20Metadata/token/' abigens/erc20MetadataInterface.go
rm "$tmpfile"

