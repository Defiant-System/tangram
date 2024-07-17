
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
		this.els.el.on("mousedown", ".tile", this.move);

		// temp
		this.els.el.find(".tile").get(1).trigger("mousedown").trigger("mouseup");
	},
	dispatch(event) {
		let APP = tangram,
			Self = APP.game,
			value;
		switch (event.type) {
			// custom events
			case "deselect-active":
				if (Self.active) {
					// reset element
					Self.active.removeClass("active");
					// delete refernce
					delete Self.active;
				}
				break;
		}
	},
	rotate(event) {
		let Self = tangram.game,
			Drag = Self.drag;
		switch (event.type) {
			// native events
			case "mousedown":
				// collect event info
				let doc = $(document),
					el = $(event.target).parents("?.tile"),
					tile = Self.tiles[el.data("id")],
					offset = {
						x: tile.position.x,
						y: tile.position.y,
						rotation: tile.rotation,
					},
					click = {
						x: event.clientX,
						y: event.clientY,
					};

				// drag info
				Self.drag = { doc, el, tile, click, offset };
				// bind event handlers
				Self.drag.doc.on("mousemove mouseup", Self.rotate);
				break;
			case "mousemove":
				let top = Drag.click.y - event.clientY,
					deg = Drag.offset.rotation - (top * 2) + 720,
					transform = `translate(${Drag.offset.x}px, ${Drag.offset.y}px) rotate(${deg}deg)`;

				Drag.tile.props.el.css({ transform });
				break;
			case "mouseup":
				// unbind event handlers
				Drag.doc.off("mousemove mouseup", Self.rotate);
				break;
		}
	},
	move(event) {
		let Self = tangram.game,
			Drag = Self.drag;
		switch (event.type) {
			// native events
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();

				// if "handle" rotate tile
				if (event.target.nodeName === "circle") return Self.rotate(event);

				let doc = $(document),
					el = $(event.target).parents("?.tile"),
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
				// turn "off" old active
				if (Self.active) Self.active.removeClass("active");
				// save reference to "active"
				Self.active = el.addClass("active");
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
