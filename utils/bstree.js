class BSTNode {
    constructor (key, val, left, right) {
        this.key = key;
        this.priority = Math.random();
        this.left = left || null;
        this.right = right || null;
    }

    static merge (left, right) {
        if (left === null || right === null)
            return right || left;
        
        let root = null;
        if (left.priority < right.priority) {
            root = left;
            root.right = BSTNode.merge(root.right, right);
        } else {
            root = right;
            root.left = BSTNode.merge(left, root.left);
        }

        return root;
    }

    static lowerSplit (root, key) {
        if (root === null)
            return [null, null];

        let left, right;
        if (root.key >= key) {
            // root.key belongs to the right
            const [x, y] = BSTNode.lowerSplit(root.left, key);
            left = x;
            right = root;
            root.left = y;
        } else {
            // root.key belongs to the left
            const [x, y] = BSTNode.lowerSplit(root.right, key);
            left = root;
            right = y;
            root.right = x;
        }

        return [left, right];
    }

    static upperSplit (root, key) {
        if (root === null)
            return [null, null];

        let left, right;
        if (root.key > key) {
            // root.key belongs to the right
            const [x, y] = BSTNode.lowerSplit(root.left, key);
            left = x;
            right = root;
            root.left = y;
        } else {
            // root.key belongs to the left
            const [x, y] = BSTNode.lowerSplit(root.right, key);
            left = root;
            right = y;
            root.right = x;
        }

        return [left, right];
    }

    static toList (root) {
        if (root === null)
            return [];
        return [...BSTNode.toList(root.left), [root.key, root.val], ...BSTNode.toList(root.right)];
    }
};

class BST {
    constructor (initArr = []) {
        this.root = null;

        for (let x of initArr) {
            this.insert(x);
        }
    }

    insert (key, val) {
        const [left, right] = BSTNode.lowerSplit(this.root, key);
        const middle = new BSTNode(key, val);
        this.root = BSTNode.merge(left, BSTNode.merge(middle, right));
    }

    delete (key) {
        const [left, temp] = BSTNode.lowerSplit(this.root, key);
        const [_, right] = BSTNode.upperSplit(temp);
        this.root = BSTNode.merge(left, right);
    }

    toList() {
        return BSTNode.toList(this.root);
    }

    lowerBound (key) {
        let curr = this.root;
        let best = null;

        while (curr !== null) {
            if (curr.key >= key) {
                best = curr;
                curr = curr.left;
            } else {
                curr = curr.right;
            }
        }

        return best;
    }

    upperBound (key) {
        let curr = this.root;
        let best = null;

        while (curr !== null) {
            if (curr.key > key) {
                best = curr;
                curr = curr.left;
            } else {
                curr = curr.right;
            }
        }

        return best;
    }
};