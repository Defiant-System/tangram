
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

		this.rotation = r;
		this.position = new Point(this.props.x, this.props.y);
		this.path = new Polygon(...path);

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
		this.rotation = ot(e, 360);

		this.transform();
	}



	rotateStart() {
		this.startAngle = this.rotation;
	}

	rotate(t, e=A) {
		this.position = this.position.rotate(toRadians(t), e);
		this.rotation = ot(this.rotation + t, 360);

		let transform = `translate(${this.position.x} ${this.position.y}) rotate(${this.rotation})`;
		this.props.el.attr({ transform });
		// this.transform(!0);
	}

	rotateEnd() {
		this.setTransform();
	}



	setPath(path) {
		this.snapAngles = Rt(path.edges.map(o => ot(Math.round(toDegrees(o.angle)), 180)));
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
