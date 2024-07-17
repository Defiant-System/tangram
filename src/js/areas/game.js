
// tangram.game

{
	init() {
		// fast references
		this.els = {
			el: window.find(".game-view"),
		};

		// init tiles
		this.svg = new Svg(this.els.el);
		this.tiles = {};
		// 7 tiles
		"abcdefg".split("").map(k => this.tiles[k] = new Tile(this.svg, k));
		this.svg.setTiles(this.tiles);

		// bind event handlers
		this.els.el.on("mousedown", ".tile", this.move)
	},
	dispatch(event) {
		let APP = tangram,
			Self = APP.game,
			value;
		switch (event.type) {
			// custom events
			case "some-event":
				break;
		}
	},
	move(event) {
		let Self = tangram.game,
			Drag = Self.drag;
		switch (event.type) {
			// native events
			case "mousedown":
				let doc = $(document),
					el = $(event.target).parents("?.tile"),
					trans = el.attr("transform"),
					parts = /translate\(\s*([^\s,)]+)[ ,]([^\s,)]+)/.exec(trans),
					click = {
						x: event.clientX,
						y: event.clientY,
					},
					tile = Self.tiles[el.data("id")],
					startSnapPoints = [...tile.snapPoints];

				// drag info
				Self.drag = { doc, el, click, tile, startSnapPoints };
				// tile starts to move
				tile.moveStart();
				// bind event handlers
				Self.drag.doc.on("mousemove mouseup", Self.move);
				break;
			case "mousemove":
				let x = (event.clientX - Drag.click.x),
					y = (event.clientY - Drag.click.y),
					t = new Point(x, y),
					r = Drag.startSnapPoints.map(l => l.add(t)),
					o = Drag.tile.props.parent.snapping.snap(r);
				o && (t = t.add(o.shift));
				// tile moving
				Drag.tile.move(t);
				break;
			case "mouseup":
				// reset tile
				Drag.tile.moveEnd();
				// unbind event handlers
				Drag.doc.off("mousemove mouseup", Self.move);
				break;
		}
	}
}
