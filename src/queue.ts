class qNode<Type> {
    obj: Type = null;
    next: qNode<Type> = null;

    constructor(obj: any) {
        this.obj = obj;
    }

    setNext = (nxt: qNode<Type>): void => {
        this.next = nxt;
    }

    getNext = (): qNode<Type> => {
        return this.next;
    }

    getObj = (): any => {
        return this.obj;
    }
}

export default class Queue<Type> {
    head: qNode<Type> = null;
    tail: qNode<Type> = null;

    isEmpty = (): boolean => {
        return this.head === null;
    }

    add = (obj: Type): void => {
        let node = new qNode<Type>(obj);

        if (this.tail === null) {
            this.head = node;
            this.tail = node;
        }
        else {
            this.tail.setNext(node);
            this.tail = this.tail.getNext();
        }
    }

    toList = (): Array<Type> => {
        let arr = [];

        let node = this.head;
        while (node !== null) {
            arr.push(node.getObj());
            node = node.getNext();
        }

        return arr;
    }

    peek = (): Type => {
        if (this.head !== null) {
            return this.head.getObj();
        }
        return null;
    }

    dequeue = (): Type => {
        if (this.head === null) {
            throw new Error("Attempted dequeue of empty queue element.");
        }
        let node = this.head;
        this.head = node.getNext();
        return node.getObj();
    }


}