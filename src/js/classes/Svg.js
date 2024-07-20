
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
		let data = Level[this.level].tiles;
		for (let t of this.tiles.values()) {
			let [x, y, r] = data[t.props.id],
				p = new Point(x, y);
			// update internal state
			t.setTransform(p, r);
			// update UI
			let el = this.board.find(`.tile[data-id="${t.props.id}"]`),
				transform = `translate(${x} ${y}) rotate(${r})`;
			el.attr({ transform });
		}
	}

	validate() {
		// TODO: validate correct solution
		
	}

	shuffle() {
		// TODO: shuffle tiles
		
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
