
class Tile {
	constructor(parent, id) {
		let el = $(`.tile[data-id="${id}"]`),
			[a, x, y, r] = /translate\(\s*([^\s,)]+)[ ,]([^\s,)]+)\) rotate\(([^\s,]+)\)/.exec(el.attr("transform")).map(i => +i),
			pEl = el.find("path.polygon-tile"),
			list = pEl.attr("d").slice(1,-1).split("L").map(p => p.split(",").map(i => +i)),
			path = list.map(p => new Point(p[0], p[1]));

		this.props = {
				x,
				y,
				r,
				parent,
				el,
				id,
			};

		this.snapPoints = [];
		this.snapLines = [];
		this.snapAngles = [];

		this.angle = r;
		this.rotation = r;
		this.position = new Point(this.props.x, this.props.y);
		this.path = new Polygon(...path);

		this.path.rotate(toRadians(r), this.position);

		this.transform();
		this.setPath(this.path);
	}

	get center() {
		return this.position;
	}

	moveStart(t=!1) {
		this.isActive = true;
		this.startPosition = this.position;
		// insert element last - solves z-index issue
		let el = this.props.el[0];
		el.parentNode.appendChild(el);
	}

	move(t, e) {
		var i;
		if (t) {
			let n = (i = this.startPosition) == null ? void 0 : i.add(t);
			if (n) {
				let transform = `translate(${n.x} ${n.y}) rotate(${this.rotation})`;
				this.props.el.attr({ transform });
				this.position = n;
			}

			this.transform(!0);
		}
	}

	moveEnd() {
		this.isActive = false;
		this.setTransform();
	}

	transform(t) {
		var i, n;
		let e = toRadians(this.rotation);
		this.transformed = this.path.rotate(e).translate(this.position);
		this.padding && (this.transformedPadded = at(this.path).padding(...this.padding).rotate(e).translate(this.position));
		this.snapPoints = this.getSnapPoints().map(r => r.rotate(e).translate(this.position));
		this.snapLines = this.getSnapLines().map(r => r.rotate(e).translate(this.position));
	}

	setTransform(t=this.position, e=this.rotation) {
		this.position = t;
		this.props.x = t.x;
		this.props.y = t.y;
		this.rotation = this.props.r = ot(e, 360);

		this.transform();
	}



	rotateStart() {
		this.startAngle = this.rotation;
		this.angleSnap = this.props.parent.snapping.angleSnap;

		Br.clear();
		for (let e of this.snapAngles) {
			Br.add(ot(e + this.rotation, 180));
		}

		ln.clear();
		ln.add(0);
		for (let t of this.props.parent.tiles.values()) {
			if (!t.isActive && Point.distance(this.position, t.position) < 140) {
				for (let e of t.snapAngles) {
					ln.add(ot(e + t.rotation, 180));
				}
			}
		}
	}

	rotate(t) {
		if (t = Vt(t, 1), t === this.angle) return;
		
		let e = 1 / 0;
		for (let n of Br) {
			for (let r of ln) {
				let o = id(r, n + t - this.startAngle, 180);
				if (Math.abs(o) < Math.abs(e)) e = o;
			}
		}
		if (Math.abs(e) < this.angleSnap && (t += e), t === this.angle) return;
		let i = t - this.angle;
		this.angle = t;
		
		this.position = this.position.rotate(toRadians(i), this.position);
		this.rotation = ot(this.rotation + i, 360);

		let transform = `translate(${this.position.x} ${this.position.y}) rotate(${this.rotation})`;
		this.props.el.attr({ transform });
		this.transform(!0);
	}

	rotateEnd() {
		let rotation = Vt(this.rotation, 45);
		if (rotation !== this.rotation) {
			let transform = `translate(${this.position.x} ${this.position.y}) rotate(${rotation})`;
			this.props.el.cssSequence("anim-rotate", "transitionend", el => el.removeClass("anim-rotate"));
			this.props.el.attr({ transform });
		}
		
		this.position = this.position.rotate(toRadians(rotation), this.position);
		this.rotation = ot(this.rotation, 360);

		this.startAngle =
		this.angle =
		this.rotation = rotation;
		this.transform(!0);
		this.setTransform();
	}



	setPath(path) {
		this.snapAngles = Rt(path.edges.map(o => ot(Math.round(toDegrees(o.angle)), 180)));
		// console.log( this.props.id, this.props.r, this.snapAngles );
	}

	getSnapPoints() {
		return this.path
			? isPoint(this.path)
			? [this.path] : isPolygon(this.path)
			? this.path.points : isLineSegment(this.path)
			? [this.path.p1, this.path.p2] : isCircle(this.path)
			? [this.path.c, this.path.c.shift(0, this.path.r), this.path.c.shift(0, -this.path.r), this.path.c.shift(this.path.r, 0), this.path.c.shift(-this.path.r, 0)] : isEllipse(this.path)
			? [...this.path.majorVertices, ...this.path.minorVertices] : isSector(this.path)
			? [this.path.c, this.path.start, this.path.end] : isArc(this.path)
			? [this.path.start, this.path.end] : isAngle(this.path)
			? [] : [] : [];
	}

	getSnapLines() {
		return this.path.edges
	}

	redrawCables() {
		var t, e;
		for (let i of ((t = this.inPorts) == null ? void 0 : t.values()) || []) {
			i.redraw();
		}
		for (let i of ((e = this.outPorts) == null ? void 0 : e.values()) || []) {
			i.redraw()
		}
	}

	is(s) {
		// return this.props.el[0].matches ? this.props.el[0].matches(s) : Array.from(document.querySelectorAll(s)).includes(this.props.el[0])
		return this.props.el.is(s);
	}
}
