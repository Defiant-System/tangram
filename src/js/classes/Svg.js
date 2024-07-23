
class Svg {
	constructor(el) {
		this.el = el;
		this.board = el.find("svg.board");
		this.winner = el.find("svg.winner");

		this.type = "svg";
		this.outline = new Outline(this, el.find("svg.outline"));
		this.snapping = new Snapping(this);
		this.tiles = new Map;

		Object.keys(POLYGONS).map(k => {
			let tile = new Tile(this, k);
			this.tiles.set(k, tile);
		});

		let [x, y, w, h] = this.board.attr("viewBox").split(" ").map(i => +i);
		this.view = { x, y, w, h };
	}

	drawOutline(l) {
		let data = Level[l].tiles;
		// save reference to active level
		this.level = l;
		// move tiles
		this.moveTiles(data);
		// set outline path
		this.outline.setPath(data);
	}

	moveTiles(data) {
		for (let tile of this.tiles.values()) {
			let [x, y, r] = data[tile.props.id],
				p = new Point(x, y);
			// update internal state
			tile.setTransform(p, r);
			// update UI
			let transform = `translate(${x} ${y}) rotate(${r})`;
			tile.props.el.attr({ transform });
			tile.props.el.cssSequence("anim-move", "transitionend", el => el.removeClass("anim-move"));
		}
	}

	solve() {
		let data = Level[this.level].tiles;
		this.moveTiles(data);
	}

	shuffle() {
		// shuffle tiles
		let data = Shuffle[(Shuffle.length * Math.random()) | 0];
		this.moveTiles(data);
	}

	isSolved() {
		// validate correct solution
		let pieces = [];
		for (let tile of this.tiles.values()) {
			pieces.push(tile.transformed);
		}
		let union = Polygon.union(pieces, TOLERANCE.union);
		if (!union.length) return;

		let clean = simplify(union[0].points, TOLERANCE.simplify),
			state = new Polygon(...clean);

		let stateSegments = state.edges.map(s => Math.round(s.length)).sort((a,b) => a - b),
			outlineSegments = this.outline.path.edges.map(s => Math.round(s.length)).sort((a,b) => a - b),
			solved = union.length === 1;
		
		stateSegments.map((v, i) => {
			solved = solved && (Math.abs(v - outlineSegments[i]) <= 1);
		});
		// console.log( stateSegments, outlineSegments );

		return solved;
	}

	restoreState(data) {
		// shuffle tiles
		for (let tile of this.tiles.values()) {
			let [x, y, r] = data[tile.props.id],
				p = new Point(x, y);
			// update internal state
			tile.setTransform(p, r);
			// update UI
			let transform = `translate(${x} ${y}) rotate(${r})`;
			tile.props.el.attr({ transform });
		}
	}

	puzzlePGN() {
		let data = {};
		this.board.find(".tile").map(el => {
			let id = el.getAttribute("data-id"),
				transform = el.getAttribute("transform"),
				[a, x, y, r] = /translate\(\s*([^\s,)]+)[ ,]([^\s,)]+)\) rotate\(([^\s,]+)\)/.exec(transform).map(i => +i);
			data[id] = [x, y, r];
		});
		return data;
	}

	*getTilesOfType(e) {
		for (let i of this.tiles.values()) {
			i.is(e) && (yield i);
		}
	}
}
