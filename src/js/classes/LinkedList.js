

class LinkedList {
	constructor() {
		this.root = {
			root: !0,
			next: void 0
		}
	}

	exists(node) {
		return node !== undefined && node !== this.root;
	}

	get head() {
		return this.root.next;
	}

	insertBefore(node, check) {
		let last = this.root;
		let here = this.root.next;
		while (here) {
			if (check(here)) {
				node.prev = here.prev;
				node.next = here;
				here.prev.next = node;
				here.prev = node;
				return;
			}
			last = here;
			here = here.next;
		}
		last.next = node;
		node.prev = last;
		node.next = undefined;
	}

	findTransition(check) {
		let prev = this.root;
		let here = this.root.next;
		while (here) {
			if (check(here)) break;
			prev = here;
			here = here.next;
		}
		return {
			before: prev === this.root ? undefined : prev,
			after: here,
			insert: (node) => {
				node.prev = prev;
				node.next = here;
				prev.next = node;
				if (here) here.prev = node;
				return node;
			}
		};
	}

	static node(data) {
		let d = data;
		d.remove = () => {
			if (d.prev) d.prev.next = d.next;
			if (d.next) d.next.prev = d.prev;
			d.prev = d.next = undefined;
		};
		return d;
	}
}

