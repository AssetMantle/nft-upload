# NFT Collection Upload!

A script for nft collections to IPFS.

```shell
# Install nodejs in your system
sudo apt install nodejs npm -y
sudo npm i -g npm@latest
sudo npm i -g yarn@latest
sudo npm i -g ts-node@latest

# Create a nft-upload-project directory
# Move your images and metadata folders there
mkdir nft-upload-project
cd nft-upload-project

# Folder Structure
Project
├── images (image folder)
├── nft-upload (tool folder)
├── metadata (metadata folder)

# Install dependencies
# Change your directory to script folder
cd nft-upload
yarn install

# Create an API on nft.storage and Copy that API key
# Paste that APIKey in config.js file (nftStorageAPIKey) there.
yarn nft-storage-upload
```
