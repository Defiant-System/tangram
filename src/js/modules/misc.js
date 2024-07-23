
let Misc = {
	createCanvas(width, height) {
		let cvs = $(document.createElement("canvas")),
			ctx = cvs[0].getContext("2d", { willReadFrequently: true });
		cvs.prop({ width, height });
		return { cvs, ctx }
	}
};

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


