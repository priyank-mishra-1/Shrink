import fs from "fs/promises";
import {
  calculateFrequency,
  createHuffmanHeap,
  buildHuffmanTree,
  generateCodes,
} from "./huffmanTree.js";

async function encoding() {
  try {
    const data = await fs.readFile("sample-data.txt", { encoding: "utf8" });
    const freq = calculateFrequency(data);
    // console.log(freq.get("X"));
    // let freq = new Map();
    // freq.set("C", 32);
    // freq.set("D", 42);
    // freq.set("E", 120);
    // freq.set("K", 7);
    // freq.set("L", 42);
    // freq.set("M", 24);
    // freq.set("U", 37);
    // freq.set("Z", 2);
    // const data = ""
    let Hheap = createHuffmanHeap(freq); // min heap
    const huffmanTree = buildHuffmanTree(Hheap);
    // console.log(huffmanTree);
    const codes = generateCodes(huffmanTree._root());
    console.table(codes);

    let content = [];
    let count = 0;
    let temp = "";
    for (let char of data) {
      if (char) {
        count++;
        temp += char;
        if (count == 8) {
          count = 0;
          content.push(parseInt(temp, 2));
          temp = "";
        }
      }
    }

    const buffer = Buffer.from(content);
    await fs.writeFile("output.bin", buffer);
  } catch (err) {
    console.log(err);
  }
}
encoding();
