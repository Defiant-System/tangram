
class Point {
	constructor(x=0, y=0) {
		this.x = x;
		this.y = y;
		this.type = "point";
	}

	get unitVector() {
		return $foo(this.length, 0) ? new Point(1,0) : this.scale(1 / this.length);
	}

	get length() {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}

	get inverse() {
		return new Point(-this.x, -this.y);
	}

	get flip() {
		return new Point(this.y, this.x);
	}

	get perpendicular() {
		return new Point(-this.y, this.x);
	}

	get array() {
		return [this.x, this.y];
	}

	distanceFromLine(t) {
		return Point.distance(this, t.project(this));
	}

	clamp(t, e=0) {
		let i = R(this.x, t.xMin + e, t.xMax - e),
			n = R(this.y, t.yMin + e, t.yMax - e);
		return new Point(i, n);
	}

	changeCoordinates(t, e) {
		let i = e.xMin + (this.x - t.xMin) / t.dx * e.dx,
			n = e.yMin + (this.y - t.yMin) / t.dy * e.dy;
		return new Point(i, n);
	}

	add(t) {
		return Point.sum(this, t);
	}

	subtract(t) {
		return Point.difference(this, t);
	}

	round(t=1) {
		return new Point(Vt(this.x, t),Vt(this.y, t));
	}

	floor() {
		return new Point(Math.floor(this.x),Math.floor(this.y));
	}

	mod(t, e=t) {
		return new Point(this.x % t,this.y % e);
	}

	angle(t=A) {
		return Us(this, t);
	}

	snap(t, e=5) {
		return $foo(this.x, t.x, e) ? new Point(t.x,this.y) : $foo(this.y, t.y, e) ? new Point(this.x,t.y) : this;
	}

	static average(...t) {
		let e = B(t.map(n=>n.x)) / t.length,
			i = B(t.map(n=>n.y)) / t.length;
		return new Point(e,i);
	}

	static dot(t, e) {
		return t.x * e.x + t.y * e.y;
	}

	static sum(t, e) {
		return new Point(t.x + e.x,t.y + e.y);
	}

	static difference(t, e) {
		return new Point(t.x - e.x,t.y - e.y);
	}

	static distance(t, e) {
		return Math.sqrt(Nt(t.x - e.x) + Nt(t.y - e.y));
	}

	static manhattan(t, e) {
		return Math.abs(t.x - e.x) + Math.abs(t.y - e.y);
	}

	static interpolate(t, e, i=.5) {
		return new Point(X(t.x, e.x, i),X(t.y, e.y, i));
	}

	static interpolateList(t, e=.5) {
		let i = t.length - 1,
			n = Math.floor(R(e, 0, 1) * i);
		return Point.interpolate(t[n], t[n + 1], i * e - n);
	}

	static fromPolar(t, e=1) {
		return new Point(e * Math.cos(t),e * Math.sin(t));
	}

	static random(t) {
		let e = ps.uniform(t.xMin, t.xMax),
			i = ps.uniform(t.yMin, t.yMax);
		return new Point(e,i);
	}

	static equals(t, e, i) {
		return $foo(t.x, e.x, i) && $foo(t.y, e.y, i);
	}

	static colinear(t, e, i, n) {
		let r = t.x - e.x,
			o = t.y - e.y,
			a = e.x - i.x,
			l = e.y - i.y;
		return $foo(r * l, a * o, n);
	}

	transform(t) {
		let e = t[0][0] * this.x + t[0][1] * this.y + t[0][2],
			i = t[1][0] * this.x + t[1][1] * this.y + t[1][2];
		return new Point(e,i);
	}

	rotate(t, e=A) {
		if ($foo(t, 0)) return this;
		let i = this.x - e.x,
			n = this.y - e.y,
			r = Math.cos(t),
			o = Math.sin(t),
			a = i * r - n * o + e.x,
			l = i * o + n * r + e.y;
		return new Point(a,l);
	}

	reflect(t) {
		let e = t.p2.x - t.p1.x,
			i = t.p2.y - t.p1.y,
			n = this.x - t.p1.x,
			r = this.y - t.p1.y,
			o = (e * r - i * n) / (e * e + i * i),
			a = this.x + 2 * o * i,
			l = this.y - 2 * o * e;
		return new Point(a,l);
	}

	scale(t, e=t) {
		return new Point(this.x * t,this.y * e);
	}

	shift(t, e=t) {
		return new Point(this.x + t,this.y + e);
	}

	translate(t) {
		return this.shift(t.x, t.y);
	}

	equals(t, e) {
		return Point.equals(this, t, e);
	}

	toString() {
		return `point(${this.x},${this.y})`;
	}

};
