import { getFilesFromPath } from 'files-from-path';
import fs from 'fs';
import { Web3Storage } from 'web3.storage';
import os from 'os';
import path from 'path';

// Load config
const config = require('./config');

// Configure NFT.storage
const token = config.web3StorageAPIKey;
const client = new Web3Storage({ token });


export const checkFiles = (images: string[], metadata: string[]) => {
    // Check images length is equal to metadata length
    if (images.length !== metadata.length) {
      throw Error('Images files must have matching number of metadata files associated to it');
    }
  
    function parseFileName(path: string | null): number {
      // Check file name is not null
      if (!path) {
        throw Error('File cannot be null');
      }
  
      // Extract fileName from path
      const fileName = path.match(
        /([a-zA-Z0-9\s_\\.\-:]+)(.png|.jpg|.gif|.json)?$/i
      )![1];
  
      // Check that file name is an Integer
      if (isNaN(parseInt(fileName, 10))) {
        throw Error('Filenames must be numeric.Please enter a valid fileName: ' + fileName);
      }
      return parseInt(fileName, 10);
    }
  
    // We need to ensure that the files are numerically sorted (as opposed to lexicographically)
    const sortedImages = [...images.map(parseFileName)].sort(function (a, b) {
      return a - b;
    });
    const sortedMetadata = [...metadata.map(parseFileName)].sort(function (a, b) {
      return a - b;
    });
    let lastValue;
    // Check each image is sequentially named with a number and has a matching metadata file
    for (let i = 0; i < sortedImages.length; i++) {
      const image = sortedImages[i];
      const json = sortedMetadata[i];
      if (image !== json) {
        throw Error('Images must have matching JSON files');
      }
      if (lastValue && lastValue + 1 !== image) {
        throw Error('Images must be sequential');
      }
      lastValue = image;
    }
  };

  export async function web3StorageUpload() {
    // Config
    console.log(
      'Deploying files to IPFS via NFT.storage using the following configuration:'
    );
    console.log(config);
    console.log("Uplaoding");
  
    const imagesBasePath = path.join(__dirname, 'images/');
    const metadataBasePath = path.join(__dirname, 'metadata/');
  
    // Get list of images and metadata
    const images = fs.readdirSync(imagesBasePath);
    const metadata = fs.readdirSync(metadataBasePath);
  
    checkFiles(images, metadata);
  
    // Upload images folder
    const imageFiles = await getFilesFromPath(imagesBasePath);
    const imagesBaseUri = await client.put(imageFiles as any);
  
    console.log("");
    console.log(imagesBaseUri);
  
    // Create temp upload folder for metadata
    const tmpFolder = fs.mkdtempSync(path.join(os.tmpdir(), 'metadata-'));
  
    // Update metadata with IPFS hashes
    metadata.map(async (file, index: number) => {
      // Read JSON file
      let metadata = JSON.parse(
        fs.readFileSync(`${metadataBasePath}/${file}`, 'utf8')
      );
  
      // Set image to upload image IPFS hash
      metadata.image = `ipfs://${imagesBaseUri}/images/${images[index]}`;
  
      // Write updated metadata to tmp folder
      // We add 1, because token IDs start at 1
      fs.writeFileSync(`${tmpFolder}/${index + 1}`, JSON.stringify(metadata));
    });
// Upload tmpFolder
const files = await getFilesFromPath(tmpFolder);
const result = await client.put(files as any);

// Project will have been uploaded into a randomly name folder
const projectPath = tmpFolder.split('/').pop();

// Set base token uri
const baseTokenUri = `ipfs://${result}/${projectPath}`;

console.log('Set this field in your config.js file: ');
console.log('baseTokenUri: ', baseTokenUri);

// const status = await client.status(imagesBaseUri);
// console.log("");
// console.log(status);
// return {
//   baseTokenUri,
// };
}

web3StorageUpload();