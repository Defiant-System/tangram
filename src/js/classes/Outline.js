
class Outline {
	constructor(parent, el) {
		this.props = { parent, el };
		this.rotation = 0;
	}

	get polyish() {
		let p = this.transformed.points.map(p => new Point(Math.ceil(p.x), Math.ceil(p.y)));
		return new Polygon(...p);
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

	setPath(data) {
		let pieces = [];
		for (let tile of this.props.parent.tiles.values()) {
			// assemble polygon details
			pieces.push(tile.polyish);
		}
		// save solution for later comparison
		this.union = Polygon.union(pieces);
		
		// clean out points closer to each other (tolerance: 2px)
		let clean = simplify(this.union[0].points, 2);
		this.path = new Polygon(...clean);
		this.props.el.html(`<path class="polygon" d="${this.path.toSvg()}"></path>`);

		// let str = [];
		// Object.keys(data).map(k => {
		// 	let [x, y, r] = data[k];
		// 	str.push(`<g transform="translate(${x} ${y}) rotate(${r})">
		// 				<path class="polygon" d="${this.polygons[k]}"></path>
		// 			</g>`);
		// });
		// this.oEl.html(`<g>${str.join("")}</g>`);

		// this.snapAngles = Rt(path.edges.map(o => ot(Math.round(toDegrees(o.angle)), 180)));

		// console.log( this.snapAngles );
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
}
