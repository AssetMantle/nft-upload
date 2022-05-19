# NFT Collection Upload!


Once the assets and metadata files are ready, next step is to upload the same at some storage mechanism. It is recommended to use decentralized storage solution such as IPFS.

Option 1 : Using NFT.storage and script

Please ensure that your images are named numerically in a sequential manner.

**Steps**
```shell
Note: Install nodejs in your system
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
