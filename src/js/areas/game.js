
// tangram.game

{
	init() {
		// fast references
		this.els = {
			el: window.find(".game-view"),
			content: window.find("content"),
		};

		// init tiles - 7 tiles
		this.svg = new Svg(this.els.el);

		// bind event handlers
		this.els.el.on("mousedown", ".tile", this.move);
	},
	dispatch(event) {
		let APP = tangram,
			Self = APP.game,
			data,
			value;
		switch (event.type) {
			// custom events
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
			case "puzzle-solved":
				// deselect active tile
				Self.dispatch({ type: "deselect-active" });
				// animate
				value = Self.svg.outline.props.el.html();
				Self.svg.winner.css({ "--size": Self.svg.outline.size }).html(value);
				// start animation "timer"
				Self.svg.winner.cssSequence("outline-draw", "transitionend", el => {
					// go to next puzzle
					el.removeClass("outline-draw")
						.cssSequence("outline-expand", "transitionend", el => {
							// reset element
							el.removeClass("outline-expand").html("");

							Self.dispatch({ type: "set-level", arg: "1.3" });
						});
				});
				break;
			case "toggle-background":
				value = Self.els.el.hasClass("blank-bg");
				Self.els.el.toggleClass("blank-bg", value);
				break;
			case "set-theme":
				Self.els.el.data({ theme: event.arg });
				break;
			case "set-state":
				Self.svg.restoreState(event.arg);
				break;
			case "set-level":
				value = event.arg;
				if (!value && event.xMenu) value = event.xMenu.getAttribute("arg");
				Self.svg.drawOutline(value);
				Self.svg.shuffle();
				Self.svg.el.find(".tile.anim-move").removeClass("anim-move");
				break;
			case "output-pgn":
				value = [];
				data = Self.svg.puzzlePGN();
				Object.keys(data)
					.sort((a, b) => a.localeCompare(b))
					.map(k => {
						value.push(`\t"${k}": [${data[k].join(", ")}],`);
					});
				console.log( `{\n${value.join("\n")}\n}` );
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
					tile = Self.svg.tiles.get(el.data("id")),
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
				// if solved, reset board
				if (Self.svg.isSolved()) Self.dispatch({ type: "puzzle-solved" });
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
					tile = Self.svg.tiles.get(el.data("id")),
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
				// if solved, reset board
				if (Self.svg.isSolved()) Self.dispatch({ type: "puzzle-solved" });
				// uncover content
				Self.els.content.removeClass("cover");
				// unbind event handlers
				Drag.doc.off("mousemove mouseup", Self.move);
				break;
		}
	}
}
