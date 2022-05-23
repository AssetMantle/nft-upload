# Assets and Metadata Structure

## Collection Structure
NFT asset files (images,audio, video, GIFs) and metadata.json file to respective assets. 

Note: to link the respective assets(images/videos) with respective metadata, it is very important to have the Folder structure in the following format for Assets represtnation and minting.

```
Folder Structure:
  - images
    - 1.jpg
    - 2.jpg
    - 3.jpg
  - metadata
    - 1.json
    - 2.json
    - 3.json
```

```
type - String, bool, number, URI, height
```

## How to Structure the metadata?

```
// 1.json
{
  "properties": [
    {
      "name": "Block",
      "type": "String",
      "value": "Flash"
    },
    {
    "name": "Eyes",
    "type": "String",
    "value": "black"
    },
    {
    "name": "edition",
    "type": "number",
    "value": 1
    },
    {
    "name":"rare",
    "type": "bool",
    "value": true
    },
  ],
  "description": "This is the sample metadata file",
  "image": "ipfs://baadasdalasdas/images/1.png",
  "name": "Sample Metadata"
}

```
## Reserved Properties

The following properties are reserved at the protocol level so creators are requested to avoid using the following properties as the traits to avoid conflict of interest.
```
Authentication       
Burn                 
Expiry   
ExchangeRate
Lock                 
MaintainedProperties 
MakerOwnableSplit    
NubID                
Permissions   
Supply
TakerID              
```

More details to be announced and updated at 
https://docs.assetmantle.one/




# NFT Collection Upload



Once the assets and metadata files are ready, next step is to upload the same at some storage mechanism. It is recommended to use decentralized storage solution such as IPFS.

## Option 1 : Using NFT.storage and script

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
├── nft-upload (tool folder)
    ├── images (assets/images folder)
    ├── metadata (metadata folder)

# Install dependencies
# Change your directory to script folder
cd nft-upload
yarn install

# Create an API on nft.storage and Copy that API key

# Paste that APIKey in config.js file (nftStorageAPIKey) there.
yarn nft-storage-upload
```
