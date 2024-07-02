import MinHeap from "./heap.js";
export function calculateFrequency(input) {
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

class HuffmanBaseNode {
  _isLeaf() {}
  _weight() {}
}

class HuffLeafNode extends HuffmanBaseNode {
  constructor(el, wt) {
    super(); // Assuming HuffmanBaseNode is a class with a constructor
    this.element = el;
    this.weight = wt;
  }
  value() {
    return this.element;
  }
  _weight() {
    return this.weight; // returns weight not weight() unless weight is not defined
  }
  _isLeaf() {
    return true;
  }
}

class HuffInternalNode extends HuffmanBaseNode {
  constructor(l, r, wt) {
    super(); // Assuming HuffmanBaseNode is a class with a constructor
    this.left = l;
    this.right = r;
    this.weight = wt;
  }
  _left() {
    return this.left;
  }
  _right() {
    return this.right;
  }
  _weight() {
    return this.weight;
  }
  _isLeaf() {
    return false;
  }
}

export class HuffTree {
  constructor(elOrL, wtOrR, wt) {
    if (typeof elOrL === "undefined") {
      throw new Error("Invalid arguments");
    }

    if (typeof wt === "undefined") {
      // Only two arguments, assume it's a leaf node
      this.root = new HuffLeafNode(elOrL, wtOrR);
    } else {
      // Three arguments, assume it's an internal node
      this.root = new HuffInternalNode(elOrL, wtOrR, wt);
    }
  }

  _root() {
    return this.root;
  }

  _weight() {
    return this.root._weight();
  }

  compareTo(that) {
    if (this._weight() < that._weight()) {
      return -1;
    } else if (this._weight() === that._weight()) {
      return 0;
    } else {
      return 1;
    }
  }
}

export function buildHuffmanTree(Hheap) {
  let temp1,
    temp2,
    temp3 = null;
  while (Hheap.length > 1) {
    temp1 = Hheap.remove();
    temp2 = Hheap.remove();
    temp3 = new HuffTree(
      temp1._root(),
      temp2._root(),
      temp1._weight() + temp2._weight()
    );
    Hheap.add(temp3);
  }
  return temp3;
}

// DFS
export function generateCodes(node, prefix = "", codes = {}) {
  if (node._isLeaf()) {
    codes[node.value()] = prefix;
  } else {
    if (node._left()) {
      generateCodes(node._left(), prefix + "0", codes);
    }
    if (node._right()) {
      generateCodes(node._right(), prefix + "1", codes);
    }
  }
  return codes;
}

export function createHuffmanHeap(freq) {
  const Hheap = new MinHeap();
  for (const [element, weight] of freq.entries()) {
    Hheap.add(new HuffTree(element, weight));
  }
  return Hheap;
}
