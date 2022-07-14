
type Comparison<Type> = (a: Type, b: Type) => number;

class OrderedList<Type> {

    comp: Comparison<Type>;
    arr: Array<Type>;

    constructor(comp: Comparison<Type>) {
        this.comp = comp;
        this.arr = [];
    }

    static fromArray<Type>(arr: Array<Type>, comp: Comparison<Type>) {
        let output = new OrderedList(comp);
        for (let x of arr) {
            output.push(x);
        }
        return output;
    }

    toArray() {
        return [...(this.arr)];
    }

    size() {
        return this.arr.length;
    }

    get(k = undefined) {
        if (k === undefined) k = this.size() - 1;

        if (!(0 <= k && k < this.arr.length)) {
            return undefined;
        }

        return this.arr[k];
    }

    pop(k = undefined) {
        if (k === undefined) k = this.size() - 1;

        if (!(0 <= k && k < this.size())) {
            throw new RangeError();
        }

        this.arr.splice(k, 1);
    }

    push(item: Type) {
        // find the last index that we should be inserted
        let ind = this.size();

        for (let i=0; i<this.size(); ++i) {
            if (this.comp(item, this.arr[i]) < 0) {
                ind = i;
                break;
            }
        }

        this.arr.splice(ind, 0, item);
    }

    find(comp: (x: Type) => boolean) {
        return this.arr.find(comp);
    }
}

export { OrderedList };