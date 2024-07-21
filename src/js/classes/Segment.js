
class Segment extends Line {
	constructor() {
		super(...arguments);
		this.type = "segment";
	}

	contains(t, e) {
		return super.contains(t, e) ? this.p1.equals(t, e) || this.p2.equals(t, e) ? !0 : $foo(this.p1.x, this.p2.x, e) ? K(t.y, this.p1.y, this.p2.y) : K(t.x, this.p1.x, this.p2.x) : !1
	}

	project(t) {
		let e = Point.difference(this.p2, this.p1),
			i = Point.difference(t, this.p1),
			n = R(Point.dot(e, i) / this.lengthSquared, 0, 1);
		return this.p1.add(e.scale(n));
	}

	contract(t) {
		return new Segment(this.at(t),this.at(1 - t));
	}

	equals(t, e, i=!1) {
		return t.type !== "segment" ? !1 : this.p1.equals(t.p1, e) && this.p2.equals(t.p2, e) || !i && this.p1.equals(t.p2, e) && this.p2.equals(t.p1, e);
	}

	toString() {
		return `segment(${this.p1},${this.p2})`;
	}
}
