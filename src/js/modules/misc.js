
let go = Object.defineProperty,
	Mh = Object.defineProperties,
	Sh = Object.getOwnPropertyDescriptor,
	Eh = Object.getOwnPropertyDescriptors,
	po = Object.getOwnPropertySymbols,
	Ch = Object.prototype.hasOwnProperty,
	Ah = Object.prototype.propertyIsEnumerable;

let A = new Point(0, 0);
let ln = new Set;
let Br = new Set;
let mt = 2 * Math.PI;
let gi = 1e-6;
let ve = 25,
	Qr = ve * Math.sqrt(3) / 2,
	kd = Math.sqrt(2 * ve ** 2) / 2;
let toDegrees = s => s * 180 / Math.PI;
let toRadians = s => s * Math.PI / 180;

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
	}())
