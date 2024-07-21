
class Svg {
	constructor(el) {
		this.el = el;
		this.board = el.find("svg.board");

		this.type = "svg";
		this.outline = new Outline(this, el.find("svg.outline"));
		this.snapping = new Snapping(this);
		this.tiles = new Map;

		this.polygons = {
			a: "M-100,-50L0,50L100,-50Z",
			b: "M-100,-50L0,50L100,-50Z",
			c: "M-50,0L0,-50L50,0L0,50Z",
			d: "M-75,25L25,25L75,-25L-25,-25Z",
			e: "M0,-25L50,25L-50,25Z",
			f: "M0,-25L50,25L-50,25Z",
			g: "M-50,-50L50,-50L50,50Z",
		};

		Object.keys(this.polygons).map(k => {
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
			pieces.push(tile.polyish);
		}
		let state = Polygon.union(pieces)[0].toSvg();
		this.el.find("svg.validate").html(`<path class="polygon-tile" d="${state[0].toSvg()}"></path>`);

		return state === this.solution[0].toSvg();
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
