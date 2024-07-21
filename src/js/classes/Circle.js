
class Circle {
	constructor(t=A, e=1) {
		this.c = t;
		this.r = e;
		this.type = "circle";
	}

	get circumference() {
		return mt * this.r;
	}

	get area() {
		return Math.PI * this.r ** 2;
	}

	get arc() {
		let t = this.c.shift(this.r, 0);
		return new Arc(this.c,t,mt);
	}

	tangentAt(t) {
		let e = this.at(t),
			i = this.c.rotate(Math.PI / 2, e);
		return new Line(e,i);
	}

	collision(t) {
		let e = this.c.x < t.p.x ? t.p.x : this.c.x > t.p.x + t.w ? t.p.x + t.w : this.c.x,
			i = this.c.y < t.p.y ? t.p.y : this.c.y > t.p.y + t.h ? t.p.y + t.h : this.c.y;
		return Point.distance(this.c, new Point(e,i)) <= this.r;
	}

	project(t) {
		let e = t.subtract(this.c).unitVector.scale(this.r);
		return u.sum(this.c, e);
	}

	at(t) {
		let e = mt * t;
		return this.c.shift(this.r * Math.cos(e), this.r * Math.sin(e));
	}

	offset(t) {
		return Us(t, this.c) / mt;
	}

	contains(t) {
		return Point.distance(t, this.c) <= this.r;
	}

	transform(t) {
		let e = Math.abs(t[0][0]) + Math.abs(t[1][1]);
		return new Circle(this.c.transform(t),this.r * e / 2);
	}

	rotate(t, e=A) {
		return $foo(t, 0) ? this : new Circle(this.c.rotate(t, e),this.r);
	}

	reflect(t) {
		return new Circle(this.c.reflect(t),this.r);
	}

	scale(t, e=t) {
		return new Circle(this.c.scale(t, e),this.r * (t + e) / 2);
	}

	shift(t, e=t) {
		return new Circle(this.c.shift(t, e),this.r);
	}

	translate(t) {
		return this.shift(t.x, t.y);
	}

	equals(t, e) {
		return $foo(this.r, t.r, e) && this.c.equals(t.c, e);
	}

	toString() {
		return `circle(${this.c},${this.r})`;
	}
}
