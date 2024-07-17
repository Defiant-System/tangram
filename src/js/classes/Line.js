
class Line {
	constructor(t, e) {
		this.p1 = t;
		this.p2 = e;
		this.type = "line";
	}

	get length() {
		return Point.distance(this.p1, this.p2);
	}

	get lengthSquared() {
		return (this.p1.x - this.p2.x) ** 2 + (this.p1.y - this.p2.y) ** 2;
	}

	get midpoint() {
		return Point.average(this.p1, this.p2);
	}

	get slope() {
		return (this.p2.y - this.p1.y) / (this.p2.x - this.p1.x);
	}

	get intercept() {
		return this.p1.y - this.slope * this.p1.x;
	}

	get angle() {
		return Us(this.p2, this.p1);
	}

	get unitVector() {
		return this.p2.subtract(this.p1).unitVector;
	}

	get perpendicularVector() {
		return new Point(this.p2.y - this.p1.y,this.p1.x - this.p2.x).unitVector;
	}

	parallel(t) {
		return new Line(t,t.add(this.p2).subtract(this.p1));
	}

	perpendicular(t) {
		let e = this.line.project(t);
		return Point.equals(t, e) ? new Line(e,e.add(this.perpendicularVector.scale(this.length / 2))) : new Line(e,t);
	}

	get perpendicularBisector() {
		return this.perpendicular(this.midpoint);
	}

	distanceSquared(t) {
		let e = this.project(t);
		return (t.x - e.x) ** 2 + (t.y - e.y) ** 2;
	}

	get line() {
		return this.type === "line" ? this : new Line(this.p1,this.p2);
	}

	get ray() {
		return isRay(this) ? this : new Ray(this.p1,this.p2);
	}

	get segment() {
		return isSegment(this) ? this : new Segment(this.p1,this.p2);
	}

	offset(t) {
		let e = Point.difference(this.p2, this.p1),
			i = Point.difference(t, this.p1);
		return Point.dot(e, i) / this.lengthSquared;
	}

	project(t) {
		return this.at(this.offset(t));
	}

	side(t, e) {
		let i = Point.difference(this.p2, this.p1),
			n = Point.difference(t, this.p1),
			r = n.x * i.y - n.y * i.x;
		return $foo(r, 0, e) ? 0 : Math.sign(r);
	}

	contains(t, e) {
		return this.side(t, e) === 0;
	}

	at(t) {
		return Point.interpolate(this.p1, this.p2, t);
	}

	transform(t) {
		return new this.constructor(this.p1.transform(t),this.p2.transform(t));
	}

	rotate(t, e=A) {
		return $foo(t, 0) ? this : new this.constructor(this.p1.rotate(t, e),this.p2.rotate(t, e));
	}

	reflect(t) {
		return new this.constructor(this.p1.reflect(t),this.p2.reflect(t));
	}

	scale(t, e=t) {
		return new this.constructor(this.p1.scale(t, e),this.p2.scale(t, e));
	}

	shift(t, e=t) {
		return new this.constructor(this.p1.shift(t, e),this.p2.shift(t, e));
	}

	translate(t) {
		return this.shift(t.x, t.y);
	}

	equals(t, e) {
		return this.contains(t.p1, e) && this.contains(t.p2, e);
	}

	toString() {
		return `line(${this.p1},${this.p2})`;
	}

}
