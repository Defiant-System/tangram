
class Rectangle {
	constructor(t, e=1, i=e) {
		this.p = t,
		this.w = e,
		this.h = i,
		this.type = "rectangle";
	}

	static aroundPoints(t) {
		let e = 1 / 0,
			i = -1 / 0,
			n = 1 / 0,
			r = -1 / 0;
		for (let o of t)
			e = e < o.x ? e : o.x,
			i = i > o.x ? i : o.x,
			n = n < o.y ? n : o.y,
			r = r > o.y ? r : o.y;
		return new Rectangle(new Point(e,n),i - e,r - n);
	}

	get center() {
		return new Point(this.p.x + this.w / 2,this.p.y + this.h / 2);
	}

	get centroid() {
		return this.center;
	}

	get circumference() {
		return 2 * Math.abs(this.w) + 2 * Math.abs(this.h);
	}

	get area() {
		return Math.abs(this.signedArea);
	}

	get signedArea() {
		return this.w * this.h;
	}

	get edges() {
		return this.polygon.edges;
	}

	get points() {
		return this.polygon.points;
	}

	get polygon() {
		let t = new Point(this.p.x + this.w,this.p.y),
			e = new Point(this.p.x + this.w,this.p.y + this.h),
			i = new Point(this.p.x,this.p.y + this.h);
		return new Polygon(this.p,t,e,i);
	}

	get bounds() {
		return new Bounds(this.p.x,this.p.x + this.w,this.p.y,this.p.y + this.h);
	}

	collision(t) {
		return this.p.x < t.p.x + t.w && this.p.x + this.w > t.p.x && this.p.y < t.p.y + t.h && this.p.y + this.h > t.p.y;
	}

	padding(t, e, i, n) {
		return new Rectangle(this.p.shift(-n, -t),this.w + n + e,this.h + t + i);
	}

	get unsigned() {
		if (this.w > 0 && this.h > 0)
			return this;
		let t = this.p.shift(this.w < 0 ? this.w : 0, this.h < 0 ? this.h : 0);
		return new Rectangle(t,Math.abs(this.w),Math.abs(this.h));
	}

	contains(t, e) {
		return K(t.x, this.p.x, this.p.x + this.w, e) && K(t.y, this.p.y, this.p.y + this.h, e);
	}

	project(t) {
		let e;
		for (let i of this.edges) {
			let n = i.project(t);
			(!e || Point.distance(t, n) < Point.distance(t, e)) && (e = n)
		}
		return e;
	}

	at(t) {
		return this.polygon.at(t);
	}

	offset(t) {
		return this.polygon.offset(t);
	}

	cut(t) {
		return this.polygon.cut(t);
	}

	get oriented() {
		return this.polygon.oriented;
	}

	transform(t) {
		return this.polygon.transform(t);
	}

	rotate(t, e=A) {
		return $foo(t, 0) ? this : this.polygon.rotate(t, e);
	}

	reflect(t) {
		return this.polygon.reflect(t);
	}

	scale(t, e=t) {
		return new Rectangle(this.p.scale(t, e),this.w * t,this.h * e);
	}

	shift(t, e=t) {
		return new Rectangle(this.p.shift(t, e),this.w,this.h);
	}

	translate(t) {
		return this.shift(t.x, t.y);
	}

	equals(t) {
		return !1;
	}

	toString() {
		return `rectangle(${this.p},${this.w},${this.h})`;
	}

}
