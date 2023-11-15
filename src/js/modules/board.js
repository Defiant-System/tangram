
// tangram.board

{
	init() {
		// fast references
		this.els = {
			doc: $(document),
			el: window.find(".board"),
			outline: window.find(".board svg.outline"),
			pieces: window.find(".board svg.pieces"),
		};

		// bind event handlers
		this.els.pieces.on("mousedown", this.doDrag);
	},
	dispatch(event) {
		let APP = tangram,
			Self = APP.board,
			data,
			value,
			el;
		// console.log( event );
		switch (event.type) {
			case "deselect-active":
				if (Self.els.active) Self.els.active.removeClass("active");
				// clear debug, if any
				window.find(".board svg.debug").remove();
				break;
			case "output-pgn":
				console.log(event);
				break;
			case "scramble-pieces":
				break;
			case "toggle-outline-visibility":
				Self.els.outline.toggleClass("hidden", event.value);
				break;
			case "toggle-pieces-visibility":
				Self.els.pieces.toggleClass("hidden", event.value);
				break;
			case "draw-puzzle":
				data = Puzzles[event.arg];
				// outlines / background
				Object.keys(data).map(k => {
					let [x, y, r] = data[k];
					Self.els.outline.find(`g.${k}`)
						.css({ "transform": `translate(${x}px, ${y}px) rotate(${r}deg)` });
				});
				// pieces
				Object.keys(data).map(k => {
					let [x, y, r] = data[k];
					Self.els.pieces.find(`g.${k}`)
						.css({ "transform": `translate(${x}px, ${y}px) rotate(${r}deg)` });
				});
				break;
		}
	},
	doRotate(event) {
		let APP = tangram,
			Self = APP.board,
			Drag = Self.drag;
		switch (event.type) {
			case "mousedown":
				let target = event.target,
					pEl = target.parentNode,
					el = $(pEl),
					[x, y, d] = el.attr("style").match(/(-?)[\d\.]{1,}/g).map(i => +i),
					offset = { x, y, d },
					click = {
						x: event.clientX,
						y: event.clientY,
					};

				Self.drag = { el, offset, click };
				// cover app content
				APP.content.addClass("cover");
				// bind event handerls
				Self.els.doc.on("mousemove mouseup", Self.doRotate);
				break;
			case "mousemove":
				let top = Drag.click.y - event.clientY,
					deg = Drag.offset.d - (top * 2) + 720,
					snap = deg % 45;
				if (snap < 10) deg -= snap;
				Drag.el.css({ transform: `translate(${Drag.offset.x}px, ${Drag.offset.y}px) rotate(${deg}deg)` });
				// save value for mouseup
				Drag.deg = deg;
				break;
			case "mouseup":
				// make sure it lands on 45 deg's
				let val = Math.round(Drag.deg / 45) * 45;
				Drag.el.css({ transform: `translate(${Drag.offset.x}px, ${Drag.offset.y}px) rotate(${val}deg)` });
				// reset app content
				APP.content.removeClass("cover");
				// unbind event handerls
				Self.els.doc.off("mousemove mouseup", Self.doRotate);
				break;
		}
	},
	doDrag(event) {
		let APP = tangram,
			Self = APP.board,
			Drag = Self.drag;
		switch (event.type) {
			case "mousedown":
				let target = event.target;
				if (target.nodeName === "circle") return Self.doRotate(event);
				if (target.nodeName === "svg") return;

				let pEl = target.parentNode;
				// make sure active element is on top (z-index)
				pEl.parentNode.insertBefore(pEl, pEl.parentNode.lastChild);

				let el = $(pEl).addClass("dragging");
				if (!el.attr("style")) console.log(el);
				let [x, y, d] = el.attr("style").match(/(-?)[\d\.]{1,}/g).map(i => +i),
					offset = { x, y, d },
					click = {
						x: x - event.clientX,
						y: y - event.clientY,
					},
					guides = new Guides({
						debug: true,
						omit: [pEl],
						offset,
					});
				// make item active
				if (Self.els.active) Self.els.active.removeClass("active");
				Self.els.active = el.addClass("active");

				Self.drag = { el, offset, click, guides };
				// cover app content
				APP.content.addClass("cover");
				// bind event handerls
				Self.els.doc.on("mousemove mouseup", Self.doDrag);
				break;
			case "mousemove":
				let pos = {
						top: Drag.click.y + event.clientY,
						left: Drag.click.x + event.clientX,
					};
				// "filter" position with guide lines
				Drag.guides.snapPos(pos);

				let transform = `translate(${pos.left}px, ${pos.top}px) rotate(${Drag.offset.d}deg)`;
				Drag.el.css({ transform });
				break;
			case "mouseup":
				// reset dragged element
				Drag.el.removeClass("dragging");
				// reset app content
				APP.content.removeClass("cover");
				// unbind event handerls
				Self.els.doc.off("mousemove mouseup", Self.doDrag);
				break;
		}
	}
}
