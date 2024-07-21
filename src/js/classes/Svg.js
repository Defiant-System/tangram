
class Svg {
	constructor(el) {
		this.el = el;
		this.outline = el.find("svg.outline");
		this.board = el.find("svg.board");

		this.polygons = {
			a: "M-100,-50L0,50L100,-50Z",
			b: "M-100,-50L0,50L100,-50Z",
			c: "M-50,0L0,-50L50,0L0,50Z",
			d: "M-75,25L25,25L75,-25L-25,-25Z",
			e: "M0,-25L50,25L-50,25Z",
			f: "M0,-25L50,25L-50,25Z",
			g: "M-50,-50L50,-50L50,50Z",
		};

		this.type = "svg";
		this.snapping = new Snapping(this);
		this.tiles = new Map;

		let [x, y, w, h] = this.board.attr("viewBox").split(" ").map(i => +i);
		this.view = { x, y, w, h };
	}

	setTiles(tiles) {
		Object.keys(tiles).map((k, i) => {
			this.tiles.set(k, tiles[k]);
		});
	}

	drawOutline(l) {
		let str = [];
		let data = Level[l].tiles;
		Object.keys(data).map(k => {
			let [x, y, r] = data[k];
			str.push(`<g transform="translate(${x} ${y}) rotate(${r})">
						<path class="polygon" d="${this.polygons[k]}"></path>
					</g>`);
		});
		this.outline.html(`<g>${str.join("")}</g>`);
		// save reference to active level
		this.level = l;
	}

	solve() {
		let pieces = [];
		let data = Level[this.level].tiles;
		for (let tile of this.tiles.values()) {
			let [x, y, r] = data[tile.props.id],
				p = new Point(x, y);
			// update internal state
			tile.setTransform(p, r);

			// assemble polygon details
			pieces.push(tile.polyish);

			// update UI
			let transform = `translate(${x} ${y}) rotate(${r})`;
			tile.props.el.attr({ transform });
			tile.props.el.cssSequence("anim-move", "transitionend", el => el.removeClass("anim-move"));
		}
		// save solution for later comparison
		this.solution = Polygon.union(pieces)[0].toSvg();
	}

	shuffle() {
		let data = Shuffle[(Shuffle.length * Math.random()) | 0];
		// shuffle tiles
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

	isSolved() {
		// validate correct solution
		let pieces = [];
		for (let tile of this.tiles.values()) {
			pieces.push(tile.polyish);
		}
		let state = Polygon.union(pieces);
		this.el.find("svg.validate").html(state[0].toSvg());

		return state === this.solution;
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
