
class Outline {
	constructor(parent, el) {
		this.props = { parent, el };
		this.rotation = 0;
	}

	setPath(data) {
		let pieces = [];
		for (let tile of this.props.parent.tiles.values()) {
			// assemble polygon details
			pieces.push(tile.transformed);
		}
		// save solution for later comparison
		let union = Polygon.union(pieces, this.props.parent.tolerance.union),
			// clean out points closer to each other
			clean = simplify(union[0].points, this.props.parent.tolerance.simplify);
		this.path = new Polygon(...clean);
		this.props.el.html(`<path class="polygon" d="${this.path.toSvg()}"></path>`);

		this.snapPoints = this.getSnapPoints();
		this.snapLines = this.getSnapLines();
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
