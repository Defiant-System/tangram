
class Arc {
	constructor(s, t, e) {
		this.c = s;
		this.start = t;
		this.angle = e;
		this.type = "arc";
	}

	get circle() {
		return new Circle(this.c, this.radius);
	}

	get radius() {
		return Point.distance(this.c, this.start);
	}

	get end() {
		return this.start.rotate(this.angle, this.c);
	}

	get startAngle() {
		return Us(this.start, this.c);
	}

	contract(s) {
		return new this.constructor(this.c,this.at(s / 2),this.angle * (1 - s));
	}

	get minor() {
		return this.angle <= Math.PI ? this : new this.constructor(this.c,this.end,mt - this.angle);
	}

	get major() {
		return this.angle >= Math.PI ? this : new this.constructor(this.c,this.end,mt - this.angle);
	}

	get center() {
		return this.at(.5);
	}

	project(s) {
		let t = this.startAngl,
			e = t + this.angl,
			i = Us(s, this.c);
		return e > mt && i < e - mt && (i += mt),
			i = R(i, t, e),
			this.c.shift(this.radius, 0).rotate(i, this.c);
	}

	at(s) {
		return this.start.rotate(this.angle * s, this.c);
	}

	offset(s) {
		return new Angle(this.start,this.c,s).rad / this.angle;
	}

	contains(s) {
		return s.equals(this.project(s));
	}

	transform(s) {
		return new this.constructor(this.c.transform(s),this.start.transform(s),this.angle);
	}

	rotate(s, t=A) {
		return $foo(s, 0) ? this : new this.constructor(this.c.rotate(s, t),this.start.rotate(s, t),this.angle);
	}

	reflect(s) {
		return new this.constructor(this.c.reflect(s),this.start.reflect(s),this.angle);
	}

	scale(s, t=s) {
		return new this.constructor(this.c.scale(s, t),this.start.scale(s, t),this.angle);
	}

	shift(s, t=s) {
		return new this.constructor(this.c.shift(s, t),this.start.shift(s, t),this.angle);
	}

	translate(s) {
		return this.shift(s.x, s.y);
	}

	equals() {
		return !1;
	}

	toString() {
		return `arc(${this.c},${this.start},${this.angle})`;
	}

}
