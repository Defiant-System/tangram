
class Svg {
	constructor(el) {
		this.el = el;
		this.type = "svg";
		this.snapping = new Snapping(this);
		this.tiles = new Map;

		let [x, y, w, h] = el.find("> svg").attr("viewBox").split(" ").map(i => +i);
		this.view = { x, y, w, h };
	}

	setTiles(tiles) {
		Object.keys(tiles).map((k, i) => {
			this.tiles.set(k, tiles[k]);
		});
	}

	*getTilesOfType(e) {
		for (let i of this.tiles.values()) {
			i.is(e) && (yield i);
		}
	}
}
