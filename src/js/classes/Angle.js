
class Angle {
	constructor(t, e, i) {
		this.a = t;
		this.b = e;
		this.c = i;
		this.type = "angle";
	}

	static fromDegrees(t) {
		return Angle.fromRadians(t * (Math.PI / 180));
	}

	static fromRadians(t) {
		let e = new Point(1,0),
			i = e.rotate(t);
		return new Angle(e,A,i);
	}

	static equals(t, e, i=Math.PI / 360) {
		return $foo(t.rad, e.rad, i);
	}

	get rad() {
		let t = Math.atan2(this.a.y - this.b.y, this.a.x - this.b.x),
			i = Math.atan2(this.c.y - this.b.y, this.c.x - this.b.x) - t;
		return i < 0 && (i += mt), i;
	}

	get deg() {
		return this.rad * 180 / Math.PI;
	}

	get isRight() {
		return $foo(this.rad, Math.PI / 2, Math.PI / 360);
	}

	get bisector() {
		if (this.b.equals(this.a) || this.b.equals(this.c))
			return;
		let t = Math.atan2(this.a.y - this.b.y, this.a.x - this.b.x),
			e = Math.atan2(this.c.y - this.b.y, this.c.x - this.b.x),
			i = (t + e) / 2;
		t > e && (i += Math.PI);
		let n = Math.cos(i) + this.b.x,
			r = Math.sin(i) + this.b.y;
		return new Line(this.b, new Point(n,r));
	}

	get sup() {
		return this.rad < Math.PI ? this : new Angle(this.c,this.b,this.a);
	}

	get arc() {
		return new Arc(this.b,this.a,this.rad);
	}

	get radius() {
		return 24 + 20 * (1 - R(this.rad, 0, Math.PI) / Math.PI);
	}

	shape(t=!0, e, i) {
		if (this.a.equals(this.b) || this.c.equals(this.b))
			return new Polygon(A);
		let n = this.isRight && !i;
		e || (e = n ? 20 : this.radius);
		let r = new Segment(this.b,this.a),
			o = r.at(e / r.length);
		if (n) {
			let a = Point.difference(this.c, this.b).unitVector.scale(e);
			return t ? new Polygon(this.b,o,o.add(a),this.b.add(a)) : new Polyline(o,o.add(a),this.b.add(a))
		}
		return t ? new Sector(this.b,o,this.rad) : new Arc(this.b,o,this.rad);
	}

	project(t) {
		return this.contains(t) ? t : this.shape(!0).project(t);
	}

	at() {
		return this.c;
	}

	offset() {
		return 0;
	}

	contains(t) {
		return this.shape(!0).contains(t);
	}

	transform(t) {
		return new Angle(this.a.transform(t),this.b.transform(t),this.c.transform(t));
	}

	rotate(t, e) {
		return $foo(t, 0) ? this : new Angle(this.a.rotate(t, e),this.b.rotate(t, e),this.c.rotate(t, e));
	}

	reflect(t) {
		return new Angle(this.a.reflect(t),this.b.reflect(t),this.c.reflect(t));
	}

	scale(t, e=t) {
		return new Angle(this.a.scale(t, e),this.b.scale(t, e),this.c.scale(t, e));
	}

	shift(t, e=t) {
		return new Angle(this.a.shift(t, e),this.b.shift(t, e),this.c.shift(t, e));
	}

	translate(t) {
		return new Angle(this.a.translate(t),this.b.translate(t),this.c.translate(t));
	}

	equals(t, e) {
		return Angle.equals(t, this, e);
	}

	toString() {
		return `angle(${this.a},${this.b},${this.c})`;
	}

}
