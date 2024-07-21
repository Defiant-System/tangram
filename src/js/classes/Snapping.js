
class Snapping {
	constructor(t) {
		this.parent = t;
		this.angleSnap = 6;
		this.vertSnap = 5;
		this.lineSnap = 5;
	}

	*getVertices() {
		for (let t of this.parent.tiles.values()) {
			if (!(t.isActive || t.pending)) {
				for (let e of t.snapPoints) {
					yield {
						position: e,
						tile: t
					};
				}
			}
		}
		for (let e of this.parent.outline.snapPoints) {
			yield {
				position: e,
				tile: this.parent.outline
			};
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
		for (let e of this.parent.outline.snapLines) {
			yield {
				path: e,
				tile: this.parent.outline
			};
		}
	}

	snap(t) {
		return Ns(this.vertSnap, t, this.getVertices()) || Ns(this.lineSnap, t, this.getSnapLines());
	}
};
