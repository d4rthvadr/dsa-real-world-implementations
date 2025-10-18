class NodeValue<T> {
  value: T;
  next: NodeValue<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
  }
}

class SingleLinkedList<T> {
  head: NodeValue<T> | null;

  constructor() {
    this.head = null;
  }

  addToHead(value: T) {
    const node = new NodeValue(value);
    if (!this.head) {
      this.head = node;
      return;
    }
    node.next = this.head;
    this.head = node;
  }

  insertAfter(key: T, value: T): this {
    if (!this.head) {
      this.addToHead(value);
      return this;
    }

    const newNode = new NodeValue(value);

    let currentNode: typeof this.head | null = this.head;
    while (currentNode) {
      if (currentNode.value === key) {
        const nextNode = currentNode.next;
        currentNode.next = newNode;
        newNode.next = nextNode;
        break;
      }
      // Move to the next node
      currentNode = currentNode.next;
    }

    return this;
  }

  insertAtEnd(value: T): this {
    let currentNode: typeof this.head | null = this.head;
    // check if next node is defined
    while (currentNode!.next) {
      currentNode = currentNode!.next;
    }

    currentNode!.next = new NodeValue(value);

    return this;
  }

  deleteNode(key: T) {
    if (!this.head) {
      return this;
    }

    let currentNode: typeof this.head | null = this.head.next;
    let prev: typeof this.head = this.head;
    while (currentNode) {
      if (currentNode.value === key) {
        prev.next = currentNode.next;
        break;
      }
      prev = currentNode;
      currentNode = currentNode.next;
    }

    return this;
  }

  deleteNodeAtPosition(index: number) {
    if (!this.head) {
      return this;
    }

    let position: number = 0;

    let currentNode: typeof this.head | null = this.head.next;
    let prev: typeof this.head = this.head;
    while (currentNode) {
      if (index === position) {
        // delete node
        prev.next = currentNode.next;
        break;
      }
      prev = currentNode;
      position += 1;
    }

    return this;
  }

  reverseLinkedList() {
    if (!this.head) {
      return this;
    }

    return this;
  }

  getLength(): number {
    let count = 0;

    if (!this.head) {
      return count;
    }

    let currentNode: typeof this.head | null = this.head;
    while (currentNode) {
      currentNode = currentNode.next;
      count += 1;
    }
    return count;
  }

  printList(): void {
    let output: string = "";

    let currentNode: typeof this.head | null;
    currentNode = this.head;
    while (currentNode) {
      output += `-->[${currentNode.value}]`;
      // Move to next node
      currentNode = currentNode.next;
    }

    console.log(output);
  }

  populate(list: T[]) {
    list.forEach((element: T) => {
      this.addToHead(element);
    });
    return this;
  }
}

function main(list: number[]) {
  const sl = new SingleLinkedList();
  sl.populate(list);
  return sl;
}

const sl = main([34, 4, 24, 56, 100]);

sl.printList();

// Add item after
console.log("-----Add item after value----");
sl.insertAfter(4, 78).printList();
console.log("Length: ", sl.getLength());
console.log("-------------END-------------");

// Add item at end
console.log("-----Add item at end---");
sl.insertAtEnd(62).printList();
console.log("Length: ", sl.getLength());
console.log("-------------END-------------");

// Delete item of value
console.log("-----Delete item of key---");
sl.insertAtEnd(3).printList();
sl.deleteNode(3)?.printList();
console.log("Length: ", sl.getLength());
console.log("-------------END-------------");

// Delete item of value at position
console.log("-----Delete item at position---");
sl.insertAtEnd(13).printList();
sl.deleteNode(4)?.printList();
console.log("Length: ", sl.getLength());
console.log("-------------END-------------");
