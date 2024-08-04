
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
			case "save-state":
				// save state if "last" level
				if (Self.svg.level === k(APP.state.cleared)) {
					data = Self.dispatch({ type: "output-pgn" });
					APP.state.state = JSON.parse(data);
					// console.log( APP.state );
				}
				break;
			case "close-game":
				Self.dispatch({ type: "save-state" });
				APP.dispatch({ type: "show-start-view" });
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

							let arg = Self.dispatch({ type: "get-next-level" });
							Self.dispatch({ type: "set-level", arg, doAnim: true });

							// add level id to "cleared"
							if (!APP.state.cleared.includes(arg)) APP.state.cleared.push(arg);

							// enable level slot in start view
							APP.start.dispatch({ type: "enable-levels", levels: [arg] });
						});
				});
				break;
			case "get-next-level":
				let levels = window.bluePrint.selectNodes(`//*[@check-group="game-level"]`).map(x => x.getAttribute("arg")),
					index = levels.indexOf(Self.svg.level),
					next = levels[index + 1] || "1.1";
				return next;
			case "toggle-background":
				value = Self.els.el.hasClass("blank-bg");
				Self.els.el.toggleClass("blank-bg", value);
				break;
			case "set-theme":
				Self.els.el.data({ theme: event.arg });
				// save value to persistent state
				APP.state.theme = event.arg;
				break;
			case "set-state":
				// Self.svg.restoreState(event.arg);
				break;
			case "set-level":
				value = event.arg;
				if (!value && event.xMenu) value = event.xMenu.getAttribute("arg");
				Self.svg.drawOutline(value);
				// restore state if "last" level
				if (value === k(APP.state.cleared)) {
					// save tiles state to persistent state
					Self.svg.restoreState(APP.state.state);
				} else Self.svg.shuffle();
				// smooth tiles?
				if (!event.doAnim) Self.svg.el.find(".tile.anim-move").removeClass("anim-move");

				// save level to persistent state
				APP.state.level = value;
				
				// update menu
				window.bluePrint.selectNodes(`//*[@check-group="game-level"]`).map(xMenu => {
					if (xMenu.getAttribute("arg") === value) xMenu.setAttribute("is-checked", 1);
					else xMenu.removeAttribute("is-checked");
				});
				break;
			case "output-pgn":
				value = [];
				data = Self.svg.puzzlePGN();
				Object.keys(data)
					.sort((a, b) => a.localeCompare(b))
					.map(k => {
						value.push(`\t"${k}": [${data[k].join(", ")}]`);
					});
				value = `{\n${value.join(",\n")}\n}`;
				
				if (event.xMenu) console.log( value );
				return value;
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
