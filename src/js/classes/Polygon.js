
class Polygon {
	constructor(...t) {
		this.type = "polygon";
		this.points = t;
	}

	get circumference() {
		if (this.points.length <= 1) return 0;
		let t = Point.distance(this.points[0], k(this.points));
		for (let e = 1; e < this.points.length; ++e) {
			t += Point.distance(this.points[e - 1], this.points[e]);
		}
		return t;
	}

	get signedArea() {
		let t = this.points,
		  e = t.length,
		  i = t[e - 1].x * t[0].y - t[0].x * t[e - 1].y;
		for (let n = 1; n < e; ++n) {
			i += t[n - 1].x * t[n].y - t[n].x * t[n - 1].y;
		}
		return i / 2;
	}

	get area() {
		return Math.abs(this.signedArea);
	}

	get centroid() {
		let t = this.points,
			e = t.length,
			i = 0;
		for (let r = 0; r < e; ++r) {
			i += t[r].x;
		}
		let n = 0;
		for (let r = 0; r < e; ++r) {
			n += t[r].y;
		}
		return new Point(i / e,n / e);
	}

	get edges() {
		let t = this.points.length,
			e = [];
		for (let i = 0; i < t; ++i) {
			e.push(new Segment(this.points[i],this.points[(i + 1) % t]));
		}
		return e;
	}

	get radius() {
		let t = this.centroid,
			e = this.points.map(i => Point.distance(i, t));
		return Math.max(...e);
	}

	get oriented() {
		if (this.signedArea >= 0) return this;
		let t = [...this.points].reverse();
		return new this.constructor(...t);
	}

	cut(t, e) {
		let i = this.radius / t.length * 10,
			n = t.at(-i),
			r = t.at(i),
			o = t.perpendicularVector.scale(t.length * i),
			a = [n, r, r.add(o), n.add(o)],
			l = bi([this.points], [a], e),
			h = jn([this.points], [a], e);
		return [...l, ...h].map(c => new Polygon(...c));
	}

	static collision(t, e) {
		if (t.points.some(i => e.contains(i)) || e.points.some(i => t.contains(i))) return !0;
		for (let i of t.edges) {
			for (let n of e.edges) {
				if (pt(i, n)[0]) return !0;
			}
		}
		return !1;
	}

	static union(t, e) {
		let[i,...n] = t;
		if (!n.length) return [i];
		let r = [i.points],
			o = n.length > 1 ? pe.union(n, e).map(a => a.points) : [t[1].points];
		return Lc(r, o, e).map(a => new Polygon(...a))
	}

	static intersection(t, e) {
		let [i,...n] = t;
		if (!n.length) return [i];
		let r = [i.points];
		for (let o of n) {
			let a = r,
				l = [o.points];
			if (r = bi(a, l, e), !r.length) return []
		}
		return r.map(o => new Polygon(...o));
	}

	static difference(t, e, i) {
		let n = jn([t.points], [e.points], i),
			r = jn([e.points], [t.points], i);
		return n.concat(r).map(o => new Polygon(...o));
	}

	static regular(t, e=1) {
		let i = mt / t,
			n = Math.PI / 2 - i / 2,
			r = N(o => Point.fromPolar(n + i * o, e), t);
		return new Polygon(...r);
	}

	static interpolate(t, e, i=.5) {
		let n = t.points.map((r,o) => Point.interpolate(r, e.points[o], i));
		return new Polygon(...n);
	}

	static convexHull(...t) {
		if (t.length <= 3) return new Polygon(...t);
		let e = t.sort((o,a) => o.x !== a.x ? o.x - a.x : o.y - a.y),
			i = e.slice(0).reverse(),
			n = [],
			r = [];
		for (let[o,a] of [[e, n], [i, r]]) {
			for (let l of o) {
				for (; a.length >= 2; ) {
					let h = a[a.length - 1],
						c = a[a.length - 2];
					if ((h.x - c.x) * (l.y - c.y) >= (l.x - c.x) * (h.y - c.y)) a.pop();
					else break;
				}
				a.push(l);
			}
			a.pop();
		}
		return new Polygon(...n.concat(r));
	}

	contains(t) {
		let e = !1;
		for (let i of this.edges) {
			if (i.p1.equals(t) || i.contains(t)) return !1;
			if (i.p1.y > t.y == i.p2.y > t.y) continue;
			let n = (i.p2.x - i.p1.x) / (i.p2.y - i.p1.y);
			t.x < n * (t.y - i.p1.y) + i.p1.x && (e = !e)
		}
		return e;
	}

	at(t) {
		t < 0 && (t += Math.floor(t));
		let e = t * this.circumference,
			i = 0;
		for (let n of this.edges) {
			let r = n.length;
			if (i + r > e) return n.at((e - i) / r);
			i += r;
		}
		return this.points[0]
	}

	offset(t) {
		let e = this.edges,
			i = Uo(t, this.edges) || [this.points[0], 0],
			n = 0;
		for (let r = 0; r < i[1]; ++r) {
			n += e[r].length;
		}
		return n += e[i[1]].offset(t) * e[i[1]].length,
			n / this.circumference;
	}

	project(t) {
		let e = Uo(t, this.edges);
		return e ? e[0] : this.points[0];
	}

	centerAt(t=A) {
		return this.translate(t.subtract(this.centroid));
	}

	transform(t) {
		return new this.constructor(...this.points.map(e => e.transform(t)));
	}

	rotate(t, e=A) {
		if ($foo(t, 0)) return this;
		let i = this.points.map(n => n.rotate(t, e));
		return new this.constructor(...i);
	}

	reflect(t) {
		let e = this.points.map(i => i.reflect(t));
		return new this.constructor(...e);
	}

	scale(t, e=t) {
		let i = this.points.map(n => n.scale(t, e));
		return new this.constructor(...i);
	}

	shift(t, e=t) {
		let i = this.points.map(n => n.shift(t, e));
		return new this.constructor(...i);
	}

	translate(t) {
		return this.shift(t.x, t.y);
	}

	equals(t, e, i) {
		let n = this.points.length;
		if (n !== t.points.length) return !1;
		let r = i ? this : this.oriented,
			o = i ? t : t.oriented;
		for (let a = 0; a < n; ++a) {
			if (r.points.every((l,h) => l.equals(o.points[(h + a) % n], e))) return !0;
		}
		return !1;
	}

	toString() {
		return `polygon(${this.points.join(",")})`;
	}
};
