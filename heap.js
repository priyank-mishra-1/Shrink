class MinHeap {
  constructor() {
    this.heap = [];
  }

  add(node) {
    this.heap.push(node);
    this._heapifyUp(this.heap.length - 1);
  }

  remove() {
    if (this.heap.length === 1) return this.heap.pop();
    const root = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._heapifyDown(0);
    return root;
  }
  _heapifyUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[index]._weight() < this.heap[parentIndex]._weight()) {
        [this.heap[index], this.heap[parentIndex]] = [
          this.heap[parentIndex],
          this.heap[index],
        ];
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  _heapifyDown(index) {
    const length = this.heap.length;
    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let smallest = index;

      if (
        leftChildIndex < length &&
        this.heap[leftChildIndex]._weight() < this.heap[smallest]._weight()
      ) {
        smallest = leftChildIndex;
      }
      if (
        rightChildIndex < length &&
        this.heap[rightChildIndex]._weight() < this.heap[smallest]._weight()
      ) {
        smallest = rightChildIndex;
      }
      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] = [
        this.heap[smallest],
        this.heap[index],
      ];
      index = smallest;
    }
  }

  get length() {
    return this.heap.length;
  }
}

export default MinHeap;
