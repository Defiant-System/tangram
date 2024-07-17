
class Ray extends Line {
	constructor() {
		super(...arguments);
		this.type = "ray";
	}
	
	equals(s, t) {
		return s.type !== "ray" || !this.p1.equals(s.p1, t) ? !1 : this.p2.equals(s.p2, t) ? !0 : s.contains(this.p2, t) || this.contains(s.p2, t);
	}
	
	contains(s, t) {
		if (!super.contains(s, t)) return !1;
		let e = this.offset(s);
		return $foo(e, 0, t) || e > 0;
	}

	toString() {
		return `ray(${this.p1},${this.p2})`;
	}
}
