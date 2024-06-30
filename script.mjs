import MinHeap from "./heap.mjs";
import { HuffTree, buildHuffmanTree, generateCodes } from "./huffman.mjs";

const file = document.getElementById("inputFile");
file.addEventListener("change", function () {
  let fr = new FileReader();
  fr.onload = function () {
    // computing
    // console.log(fr.result);
    let string = fr.result;
    // let freq = calculateFrequency(string); // hash map of frequencies
    // console.log(freq.get("X"));
    let freq = new Map();
    freq.set("C", 32);
    freq.set("D", 42);
    freq.set("E", 120);
    freq.set("K", 7);
    freq.set("L", 42);
    freq.set("M", 24);
    freq.set("U", 37);
    freq.set("Z", 2);
    let Hheap = createHuffmanHeap(freq); // min heap
    const huffmanTree = buildHuffmanTree(Hheap);
    console.log(huffmanTree);
    const codes = generateCodes(huffmanTree._root());
    console.table(codes);
  };

  fr.onerror = function () {
    alert("Error opening file");
  };

  fr.readAsText(this.files[0]);
});

function calculateFrequency(input) {
  let hash = new Map();
  for (let element of input) {
    if (!hash.has(element)) {
      hash.set(element, 1);
    } else {
      let value = hash.get(element);
      hash.set(element, value + 1);
    }
  }
  return hash;
}

function createHuffmanHeap(freq) {
  const Hheap = new MinHeap();
  for (const [element, weight] of freq.entries()) {
    Hheap.add(new HuffTree(element, weight));
  }
  return Hheap;
}
