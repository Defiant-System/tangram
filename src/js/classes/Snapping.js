
class Snapping {
	constructor(t) {
		this.parent = t;
		this.vertSnap = 5;
		this.lineSnap = 5;
	}

	*getVertices() {
		for (let t of this.parent.tiles.values()) {
			if (!(t.isActive || t.pending || t.props.name === "geo")) {
				for (let e of t.snapPoints) {
					yield {
						position: e,
						tile: t
					};
				}
			}
		}
	}

	*getSnapLines() {
		for (let t of this.parent.tiles.values()) {
			if (!(t.isActive || t.pending)) {
				for (let e of t.snapLines) {
					yield {
						path: e,
						tile: t
					};
				}
			}
		}
	}

	snap(t) {
		return Ns(this.vertSnap, t, this.getVertices()) || Ns(this.lineSnap, t, this.getSnapLines());
	}
};
