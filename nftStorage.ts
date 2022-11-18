import { getFilesFromPath } from "files-from-path";
import fs from "fs";
import { NFTStorage } from "nft.storage";
import os from "os";
import path from "path";

// Load config
const config = require("./config");

// Configure NFT.storage
const token = config.nftStorageApiKey;
const client = new NFTStorage({ token });

// function to check file consistency and sort filenames
export const checkFiles = (images: string[], metadata: string[]) => {
  // Check images length is equal to metadata length
  if (images.length !== metadata.length) {
    throw new Error(
      "Images files must have matching number of metadata files associated to it"
    );
  }

  // function to sanity test parse the name part from full filename
  const parseFileName = (path: string | null): number => {
    // Check file name is not null
    if (!path) {
      throw new Error("'File cannot be null'");
    }

    // Extract fileName from path
    const fileNameWithExtensions = path.match(
      /([a-zA-Z0-9\s_\\.\-:]+)(.png|.jpg|.gif|.json)?$/i
    )![1];

    // extract just the name of the file from the filename (remove extensions)
    const fileName = fileNameWithExtensions.toString().split(".")[0];
    
    // console.log("filename: ", fileName, " path: ", path);

    // Check that file name is an Integer
    if (isNaN(Number(fileName.toString()))) {
      throw new Error(
        `Filenames must be numeric.Please enter a valid fileName: ${fileName}`
      );
    }
    return parseInt(fileName, 10);
  };

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

    // check if both image and json filenames are matching
    if (image !== json) {
      throw new Error("Images must have matching JSON files");
    }

    // check if
    if (lastValue && lastValue + 1 !== image) {
      throw new Error("Images must be sequential");
    }
    lastValue = image;
  }
};

export async function nftStorageUpload() {
  // Config
  console.log(
    "Deploying files to IPFS via NFT.storage using the following configuration:"
  );
  console.log(config);
  console.log("Uploading...");

  const imagesBasePath = path.join(__dirname, "images/");
  const metadataBasePath = path.join(__dirname, "metadata/");

  // Get list of images and metadata
  const images = fs.readdirSync(imagesBasePath);
  const metadata = fs.readdirSync(metadataBasePath);
  let baseTokenUri;

  try {
    checkFiles(images, metadata);
    // Upload images folder
    const imageFiles = await getFilesFromPath(imagesBasePath);
    const imagesBaseUri = await client.storeDirectory(imageFiles as any);

    console.log("");
    console.log("image folder uri: ", imagesBaseUri);

    // Create temp upload folder for metadata
    const tmpFolder = fs.mkdtempSync(path.join(__dirname, "metadata-"));

    // Update metadata with IPFS hashes
    metadata.map(async (file, index: number) => {
      // Read JSON file
      let metadataFileJSON = JSON.parse(
        fs.readFileSync(`${metadataBasePath}/${file}`, "utf8")
      );

      // Set image to upload image IPFS hash
      metadataFileJSON.image = `ipfs://${imagesBaseUri}/images/${images[index]}`;

      // Write updated metadata to tmp folder
      // We add 1, because token IDs start at 1
      fs.writeFileSync(
        `${tmpFolder}/${index + 1}`,
        JSON.stringify(metadataFileJSON)
      );
    });

    // Upload tmpFolder
    const metadataFiles = await getFilesFromPath(tmpFolder);
    const metadataBaseUri = await client.storeDirectory(metadataFiles as any);

    // Project will have been uploaded into a randomly name folder
    const projectPath = tmpFolder.split("/")[0];

    // Set base token uri
    baseTokenUri = `ipfs://${metadataBaseUri}/${projectPath}`;

    console.log("Set this field in your config.js file: ");
    console.log("baseTokenUri: ", baseTokenUri);

    const status = await client.status(imagesBaseUri);
    console.log("");
    console.log("Status of Image Upload: ", status);
  } catch (err) {
    console.error(err);
  }

  return {
    baseTokenUri,
  };
}

try {
  nftStorageUpload();
} catch (err) {
  console.log(err);
  console.log(err.name);
  console.log(err.message);
}

// repalce temp folder to current path
