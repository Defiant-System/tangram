
// tangram.game

{
	init() {
		// fast references
		this.els = {
			el: window.find(".game-view"),
			content: window.find("content"),
		};

		// let mouse = new Point(1, 0),
		// 	center = new Point(0, 0),
		// 	start = new Point(0, 1),
		// 	angle = new Angle(mouse, center, start).deg;
		// console.log( angle );

		// init tiles
		this.svg = new Svg(this.els.el);
		this.tiles = {};
		// 7 tiles
		"abcdefg".split("").map(k => this.tiles[k] = new Tile(this.svg, k));
		this.svg.setTiles(this.tiles);

		// outline
		// this.svg.drawOutline("1.0");

		// bind event handlers
		this.els.el.on("mousedown", ".tile", this.move);
	},
	dispatch(event) {
		let APP = tangram,
			Self = APP.game,
			value;
		switch (event.type) {
			// custom events
			case "set-theme":
				Self.els.el.data({ theme: event.arg });
				break;
			case "shuffle-pieces":
				Self.svg.shuffle();
				break;
			case "solve-puzzle":
				Self.svg.solve();
				break;
			case "deselect-active":
				if (Self.active) {
					// reset element
					Self.active.removeClass("active");
					// delete refernce
					delete Self.active;
				}
				break;
			case "set-level":
			case "draw-outline":
				Self.svg.drawOutline(event.arg);
				// Self.svg.solve();
				break;
			case "output-pgn":
				value = Self.svg.puzzlePGN();
				value = JSON.stringify(value, null, "\t")
							.replace(/\n\t\t/g, "")
							.replace(/\n\t]/g, "]")
							.replace(/,(\d)/g, ", $1");
				console.log( value );
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
					rect = tile.props.parent.el[0].getBoundingClientRect(),
					offset = {
						x: tile.props.parent.view.x - tile.position.x,
						y: tile.props.parent.view.y - tile.position.y,
					},
					click = {
						oX: event.offsetX + rect.left,
						oY: event.offsetY + rect.top,
					},
					start = {
						rotation: tile.rotation,
						position: new Point(click.oX, click.oY),
						center: new Point(rect.left - offset.x, rect.top - offset.y),
					};

				// drag info
				Self.drag = { doc, el, tile, start };
				// tile starts to move
				tile.rotateStart();
				// cover content
				Self.els.content.addClass("cover");
				// bind event handlers
				Self.drag.doc.on("mousemove mouseup", Self.rotate);
				break;
			case "mousemove":
				let mouse = new Point(event.clientX, event.clientY),
					angle = Drag.start.rotation - new Angle(mouse, Drag.start.center, Drag.start.position).deg;
				Drag.tile.rotate(angle);
				break;
			case "mouseup":
				// reset tile
				Drag.tile.rotateEnd();
				// uncover content
				Self.els.content.removeClass("cover");
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
				// cover content
				Self.els.content.addClass("cover");
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
				// uncover content
				Self.els.content.removeClass("cover");
				// unbind event handlers
				Drag.doc.off("mousemove mouseup", Self.move);
				break;
		}
	}
}
