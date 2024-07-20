
let go = Object.defineProperty,
	Mh = Object.defineProperties,
	Sh = Object.getOwnPropertyDescriptor,
	Eh = Object.getOwnPropertyDescriptors,
	po = Object.getOwnPropertySymbols,
	Ch = Object.prototype.hasOwnProperty,
	Ah = Object.prototype.propertyIsEnumerable;

let A = new Point(0, 0);
// let Op = new Line(A, new Point(0, 1));
let ln = new Set;
let Br = new Set;
let mt = 2 * Math.PI;
let gi = 1e-6;
let Z = gi;
let ve = 25,
	Qr = ve * Math.sqrt(3) / 2,
	kd = Math.sqrt(2 * ve ** 2) / 2;
let toDegrees = s => s * 180 / Math.PI;
let toRadians = s => s * Math.PI / 180;
let rand = (min, max) => Math.floor( min + Math.random() * ( max - min + 1 ) );

let Kn = (s, t, e) => {
		let i = {
			above: e.myFill.above,
			below: e.myFill.below
		};
		return {
			start: s,
			end: t,
			myFill: i
		}
	};

let Tc = (s, t, e) => {
		let i = ms.node({
			isStart: !0,
			pt: t.start,
			seg: t,
			primary: e
		});
		return Yn(s, i, t.end),
		i
	};
let Pc = (s, t, e, i) => {
		let n = ms.node({
			pt: e.end,
			seg: e,
			primary: i,
			other: t
		});
		t.other = n,
		Yn(s, n, t.pt)
	};
let wi = (s, t, e) => {
		let i = Tc(s, t, e);
		return Pc(s, i, t, e), i;
	};
let Qn = (s, t, e, i) => {
		i !== void 0 && (Z = i);
		let n = new ms;
		for (let o of Wo(s)) {
			wi(n, Kn(o.start, o.end, o), !0);
		}
		for (let o of Wo(t)) {
			wi(n, Kn(o.start, o.end, o), !1);
		}
		let r = Ec(Cc(ia(n, !1), e));
		return Z = gi,
			r.filter(o => o.length > 2);
	};
let Cc = (s, t) => {
		let e = [];
		for (let i of s) {
			let n = (i.myFill.above ? 8 : 0) + (i.myFill.below ? 4 : 0) + (i.otherFill && i.otherFill.above ? 2 : 0) + (i.otherFill && i.otherFill.below ? 1 : 0);
			t[n] !== 0 && e.push({
				start: i.start,
				end: i.end,
				myFill: {
					above: t[n] === 1,
					below: t[n] === 2
				}
			})
		}
		return e
	};
let Wo = s => {
		let t = new ms;
		for (let e of s)
			for (let i = 0; i < e.length; i++) {
				let n = i ? e[i - 1] : k(e),
					r = e[i],
					o = sa(n, r);
				if (o === 0) continue;
				let a = o < 0 ? n : r,
					l = o < 0 ? r : n;
				wi(t, {
					start: a,
					end: l,
					myFill: {}
				}, !0)
			}
		return ia(t, !0)
	};
let jo = (s, t, e) => {
		let i = s.y - t.y,
			n = e.x - t.x,
			r = s.x - t.x,
			o = e.y - t.y,
			a = r * n + i * o;
		if (a < Z) return !1;
		let l = n * n + o * o;
		return a - l <= -Z
	};
let Mc = (s, t, e) => {
		t.other.remove(),
		t.seg.end = e,
		t.other.pt = e,
		Yn(s, t.other, t.pt)
	};
let ie = (s, t, e) => {
		let i = Kn(e, t.seg.end, t.seg);
		return Mc(s, t, e),
		wi(s, i, !!t.primary)
	};

let sa = (s, t) => $foo(s.x, t.x, Z) ? (s.y, t.y, Z) ? 0 : s.y < t.y ? -1 : 1 : s.x < t.x ? -1 : 1;
let Yn = (s, t, e) => s.insertBefore(t, i=>$c(!!t.isStart, t.pt, e, !!i.isStart, i.pt, i.other.pt) < 0);
let Wn = (s, t, e) => {
		let i = (e.x - t.x) * (s.y - t.y),
			n = (e.y - t.y) * (s.x - t.x);
		return i - n >= -Z
	};
let $c = (s, t, e, i, n, r) => {
		let o = sa(t, n);
		return o !== 0 ? o : Point.equals(e, r, Z) ? 0 : s !== i ? s ? 1 : -1 : Wn(e, i ? n : r, i ? r : n) ? 1 : -1
	};

var Ac = [0, 2, 1, 0, 2, 2, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
	kc = [0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 1, 1, 0, 2, 1, 0],
	Ic = [0, 0, 0, 0, 2, 0, 2, 0, 1, 1, 0, 0, 0, 1, 2, 0];
let Lc = (s,t,e) => Qn(s, t, Ac, e),
	bi = (s,t,e) => Qn(s, t, kc, e),
	jn = (s,t,e) => Qn(s, t, Ic, e);


let isPolygon = s => ["polygon", "polyline", "rectangle", "triangle"].includes(s.type),
	isTriangle = s => ["polygon", "triangle"].includes(s.type),
	isPolyLine = s => s.type === "polyline",
	isRectangle = s => s.type === "rectangle",
	isLineSegment = s => ["line", "ray", "segment"].includes(s.type),
	isLine = s => s.type === "line",
	isRay = s => s.type === "ray",
	isSegment = s => s.type === "segment",
	isCircle = s => s.type === "circle",
	isEllipse = s => s.type === "ellipse",
	isArc = s => s.type === "arc",
	isSector = s => s.type === "sector",
	isAngle = s => s.type === "angle",
	isPoint = s => s.type === "point";

let ot = (s, t) => (s % t + t) % t;
let K = (s, t, e, i=gi) => (t > e && ([t,e] = [e, t]), s > t + i && s < e - i);
let Vt = (s, t=1) => Math.round(s / t) * t;
let B = s => s.reduce((t, e)=>t + e, 0);
let k = (s, t=0) => s[s.length - 1 - t];
let Nt = s => s * s;
let X = (s, t, e=.5) => s + (t - s) * e;
let Rt = s => s.filter((t,e) => s.indexOf(t) === e);
let R = (s, t=-1 / 0, e=1 / 0) => Math.min(e, Math.max(t, s));


let Us = (s, t) => {
		let e = Math.atan2(s.y - (t ? t.y : 0), s.x - (t ? t.x : 0));
		return ot(e, mt)
	};

let $foo = (s, t, e=gi) => isNaN(s) || isNaN(t) ? !1 : Math.abs(s - t) < e;

let fo = (s,t,e)=>t in s ? go(s, t, {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: e
	}) : s[t] = e;

let id = (s, t, e) => {
		let i = ot(s - t, e);
		return i > e / 2 ? i - e : i
	};

let it = (s,t) => Mh(s, Eh(t));
let st = (s,t) => {
		for (var e in t || (t = {})) {
			Ch.call(t, e) && fo(s, e, t[e]);
		}
		if (po) {
			for (var e of po(t)) {
				Ah.call(t, e) && fo(s, e, t[e]);
			}
		}
		return s;
	};

function Ns(s, t, e) {
	let i, n, r;
	t: for (let o of e) {
		for (let a of t) {
			// if (!o.position) console.log(o);
			let l = o.position || o.path.project(a),
				h = l.subtract(a),
				c = h.length;
			if (c < s && (s = c, i=l, n=h, r=o, c < 1)) {
				break t;
			}
		}
	}
	return n ? it(st({}, r), {
		position: i,
		shift: n
	}) : void 0
}

function Oi(s) {
	if (isPoint(s)) return [s];
	if (isPolygon(s)) return s.points;
	if (isLineSegment(s)) return [s.p1, s.p2];
	if (isAngle(s)) return Oi(s.shape(!0));
	if (isCircle(s)) return [s.c.shift(s.r, 0), s.c.shift(-s.r, 0), s.c.shift(0, s.r), s.c.shift(0, -s.r)];
	if (isEllipse(s)) return s.extremes;
	if (isSector(s) || isArc(s)) {
		let t = [s.start, s.end];
		isSector(s) && t.push(s.c);
		let e = s.radius;
		for (let[i,n] of [[e, 0], [0, e], [-e, 0], [0, -e]]) {
			let r = s.c.shift(i, n);
			Bt.prototype.contains.call(s, r) && t.push(r);
		}
		return t;
	}
	return [];
}

let at = (...s) => Rectangle.aroundPoints(function*() {
		for (let t of s) {
			for (let e of Oi(t)) {
				yield e
			}
		}
	}());

function Sc(s, t) {
	let e = s.seg.start,
		i = s.seg.end,
		n = t.seg.start,
		r = t.seg.end;
	return Point.colinear(e, n, r, Z) ? Point.colinear(i, n, r, Z) || Wn(i, n, r) ? 1 : -1 : Wn(e, n, r) ? 1 : -1
}

function xc(s, t, e, i) {
	let n = t.x - s.x,
		r = t.y - s.y,
		o = i.x - e.x,
		a = i.y - e.y,
		l = n * a - r * o;
	if ($foo(l, 0, Z)) return !1;
	let h = s.x - e.x,
		c = s.y - e.y,
		d = (o * c - a * h) / l,
		g = (n * c - r * h) / l,
		f = Math.hypot(n, r),
		y = Math.hypot(o, a),
		p = new Point(s.x + d * n,s.y + d * r);
	return {
		alongA: Zo(d, f),
		alongB: Zo(g, y),
		pt: p
	}
}

function Un(s, t, e) {
	let i = t.seg,
		n = e.seg,
		r = i.start,
		o = i.end,
		a = n.start,
		l = n.end,
		h = xc(r, o, a, l);
	if (h === !1) {
		if (!Point.colinear(r, o, a, Z) || Point.equals(r, l, Z) || Point.equals(o, a, Z))
			return !1;
		let c = Point.equals(r, a, Z),
			d = Point.equals(o, l, Z);
		if (c && d)
			return e;
		let g = !c && jo(r, a, l),
			f = !d && jo(o, a, l);
		if (c)
			return f ? ie(s, e, o) : ie(s, t, l),
			e;
		g && (d || (f ? ie(s, e, o) : ie(s, t, l)),
		ie(s, e, r))
	} else
		h.alongA === 0 && (h.alongB === -1 ? ie(s, t, a) : h.alongB === 0 ? ie(s, t, h.pt) : h.alongB === 1 && ie(s, t, l)),
		h.alongB === 0 && (h.alongA === -1 ? ie(s, e, r) : h.alongA === 0 ? ie(s, e, h.pt) : h.alongA === 1 && ie(s, e, o));
	return !1
}

function ia(s, t) {
	var e, i;
	let n = new ms,
		r = [];
	for (; s.head; ) {
		let a = s.head;
		if (a.isStart) {
			let l = function() {
				if (c) {
					let f = Un(s, a, c);
					if (f)
						return f
				}
				return d ? Un(s, a, d) : !1
			};
			var o = l;
			let h = n.findTransition(f=>Sc(a, f.ev) > 0),
				c = (e = h.before) == null ? void 0 : e.ev,
				d = (i = h.after) == null ? void 0 : i.ev,
				g = l();
			if (g && (t ? (!a.seg.myFill.below || a.seg.myFill.above !== a.seg.myFill.below) && (g.seg.myFill.above = !g.seg.myFill.above) : g.seg.otherFill = a.seg.myFill,
			a.other.remove(),
			a.remove()),
			s.head !== a)
				continue;
			if (t) {
				let f = a.seg.myFill.below ? a.seg.myFill.above !== a.seg.myFill.below : !0;
				a.seg.myFill.below = d ? d.seg.myFill.above : !1,
				a.seg.myFill.above = f ? !a.seg.myFill.below : a.seg.myFill.below
			} else if (a.seg.otherFill === void 0) {
				let f = d ? a.primary === d.primary ? d.seg.otherFill.above : d.seg.myFill.above : !1;
				a.seg.otherFill = {
					above: f,
					below: f
				}
			}
			a.other.status = h.insert(ms.node({
				ev: a
			}))
		} else {
			let l = a.status;
			if (l === void 0)
				throw new Error("[Euclid.js] Zero-length segment detected!");
			if (n.exists(l.prev) && n.exists(l.next) && Un(s, l.prev.ev, l.next.ev),
			l.remove(),
			!a.primary) {
				let h = a.seg.myFill;
				a.seg.myFill = a.seg.otherFill,
				a.seg.otherFill = h
			}
			r.push(a.seg)
		}
		s.head.remove();
	}
	return r;
}

function Ec(s) {
	let t = [],
		e = [];
	return s.forEach(i=>{
		let n = i.start,
			r = i.end;
		if (Point.equals(n, r, Z))
			return;
		let o = {
			index: 0,
			matchesHead: !1,
			matchesPt1: !1
		},
			a = {
			index: 0,
			matchesHead: !1,
			matchesPt1: !1
		},
			l = o;
		function h(p, m, v) {
			l.index = p,
			l.matchesHead = m,
			l.matchesPt1 = v;
			let b = l === o;
			return l = b ? a : void 0,
			!b
		}
		for (let p = 0; p < t.length; p++) {
			let m = t[p],
				v = m[0],
				b = k(m);
			if (Point.equals(v, n, Z)) {
				if (h(p, !0, !0))
					break
			} else if (Point.equals(v, r, Z)) {
				if (h(p, !0, !1))
					break
			} else if (Point.equals(b, n, Z)) {
				if (h(p, !1, !0))
					break
			} else if (Point.equals(b, r, Z) && h(p, !1, !1))
				break
		}
		if (l === o) {
			t.push([n, r]);
			return
		}
		if (l === a) {
			let p = o.index,
				m = o.matchesPt1 ? r : n,
				v = o.matchesHead,
				b = t[p],
				C = v ? b[0] : b[b.length - 1],
				T = v ? b[1] : b[b.length - 2],
				P = v ? b[b.length - 1] : b[0],
				x = v ? b[b.length - 2] : b[1];
			if (Point.colinear(T, C, m, Z) && (v ? b.shift() : b.pop(), C = T),
			Point.equals(P, m, Z)) {
				t.splice(p, 1),
				Point.colinear(x, P, C, Z) && (v ? b.pop() : b.shift()),
				e.push(b);
				return
			}
			v ? b.unshift(m) : b.push(m);
			return
		}
		function c(p) {
			t[p].reverse()
		}
		function d(p, m) {
			let v = t[p],
				b = t[m],
				C = v[v.length - 1],
				T = v[v.length - 2],
				P = b[0],
				x = b[1];
			Point.colinear(T, C, P, Z) && (v.pop(),
			C = T),
			Point.colinear(C, P, x, Z) && b.shift(),
			t[p] = v.concat(b),
			t.splice(m, 1)
		}
		let g = o.index,
			f = a.index,
			y = t[g].length < t[f].length;
		o.matchesHead ? a.matchesHead ? y ? (c(g),
		d(g, f)) : (c(f),
		d(f, g)) : d(f, g) : a.matchesHead ? d(g, f) : y ? (c(g),
		d(f, g)) : (c(f),
		d(g, f))
	}), e;
}

class ms {
	constructor() {
		this.root = {
			root: !0,
			next: void 0
		}
	}

	exists(s) {
		return s !== void 0 && s !== this.root
	}

	get head() {
		return this.root.next
	}

	insertBefore(s, t) {
		let e = this.root,
			i = this.root.next;
		for (; i; ) {
			if (t(i)) {
				s.prev = i.prev,
				s.next = i,
				i.prev.next = s,
				i.prev = s;
				return
			}
			e = i,
			i = i.next
		}
		e.next = s,
		s.prev = e,
		s.next = void 0
	}

	findTransition(s) {
		let t = this.root,
			e = this.root.next;
		for (; e && !s(e); )
			t = e,
			e = e.next;
		return {
			before: t === this.root ? void 0 : t,
			after: e,
			insert: i=>(i.prev = t,
			i.next = e,
			t.next = i,
			e && (e.prev = i),
			i)
		}
	}

	static node(s) {
		let t = s;
		return t.remove = ()=>{
			t.prev && (t.prev.next = t.next),
			t.next && (t.next.prev = t.prev),
			t.prev = t.next = void 0
		}, t;
	}
}

