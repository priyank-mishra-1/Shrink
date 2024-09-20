import fs from "fs/promises";
import {
  calculateFrequency,
  createHuffmanHeap,
  buildHuffmanTree,
  generateCodes,
} from "./huffmanTree.js";

// Convert the input data into its Huffman encoded form
function encodeData(data, codes) {
  return data
    .split("")
    .map((char) => codes[char])
    .join("");
}

// Add padding to the binary string to make its length a multiple of 8
function addPadding(binaryString) {
  const paddingLength = (8 - (binaryString.length % 8)) % 8;
  const padding = "0".repeat(paddingLength);
  return {
    paddedBinaryString: binaryString + padding,
    paddingLength,
  };
}

// Convert a binary string to a byte array
function binaryStringToByteArray(binaryString) {
  const byteArray = [];
  for (let i = 0; i < binaryString.length; i += 8) {
    const byte = binaryString.slice(i, i + 8);
    byteArray.push(parseInt(byte, 2));
  }
  return new Uint8Array(byteArray);
}

// Save compressed data to a file with a header containing the frequency table
async function saveCompressedDataWithHeader(
  freqTable,
  data,
  paddingLength,
  filePath
) {
  const freq = Object.fromEntries(freqTable); // converting Map to JS object to stringify

  const header = JSON.stringify({ freq, paddingLength });
  // console.log(header);

  const headerLength = Buffer.byteLength(header, "utf8");

  const headerBuffer = Buffer.alloc(4 + headerLength);
  headerBuffer.writeUInt32BE(headerLength, 0);
  headerBuffer.write(header, 4, "utf8");

  const combinedData = Buffer.concat([headerBuffer, Buffer.from(data)]);
  await fs.writeFile(filePath, combinedData);
}

//encoding

async function encoding(srcPath, destPath) {
  try {
    const data = await fs.readFile(srcPath, {
      encoding: "utf8",
    });
    const freq = calculateFrequency(data);
    // console.log(freq);

    let Hheap = createHuffmanHeap(freq); // min heap
    const huffmanTree = buildHuffmanTree(Hheap);
    const codes = generateCodes(huffmanTree._root());
    // console.table(codes);

    // Generate the encoded data
    const encodedData = encodeData(data, codes);

    // Add padding to the encoded data
    const { paddedBinaryString, paddingLength } = addPadding(encodedData);

    // Convert the padded binary string to a byte array
    const byteArray = binaryStringToByteArray(paddedBinaryString);

    // Save the compressed data with the frequency table in the header
    await saveCompressedDataWithHeader(
      freq,
      byteArray,
      paddingLength,
      destPath
    );

    console.log("Data compressed successfully!");

    return { huffmanTree, codes };
  } catch (err) {
    console.error("Error during encoding:", err);
  }
}

// decoding

async function decoding(srcPath, destPath) {
  try {
    const data = await fs.readFile(srcPath);

    // Read the header length and header
    const headerLength = data.readUInt32BE(0);
    // console.log(headerLength);
    const header = data.toString("utf8", 4, 4 + headerLength);
    // console.log(header);

    const parsed = JSON.parse(header);
    const freqObj = parsed["freq"];
    const paddingLength = parsed["paddingLength"];

    // console.log("freq:", freqObj);
    // console.log(paddingLength);

    const freq = new Map(Object.entries(freqObj)); //creating Map from freq object

    // Rebuild the Huffman tree
    let Hheap = createHuffmanHeap(freq); // min heap
    const huffmanTree = buildHuffmanTree(Hheap);
    // console.log(huffmanTree);

    // Read the compressed data
    const byteArray = data.subarray(4 + headerLength);

    // Convert the byte array to a binary string
    const binaryString = [...byteArray]
      .map((byte) => byte.toString(2).padStart(8, "0"))
      .join("");

    // Remove the padding from the binary string
    const binaryStringWithoutPadding = binaryString.slice(0, -paddingLength);

    // Decode the binary string using the Huffman tree
    const decodedData = decodeData(
      binaryStringWithoutPadding,
      huffmanTree._root()
    );

    // console.log("Decoded data:", decodedData);
    await fs.writeFile(destPath, decodedData);
    return { huffmanTree };
  } catch (err) {
    console.error("Error during decoding:", err);
  }
}

function decodeData(binaryString, root) {
  let currentNode = root;
  let decodedString = "";

  for (const bit of binaryString) {
    if (bit === "0") {
      currentNode = currentNode._left();
    } else {
      currentNode = currentNode._right();
    }

    if (currentNode._isLeaf()) {
      decodedString += currentNode.value();
      currentNode = root;
    }
  }

  return decodedString;
}

export { encoding, decoding };
