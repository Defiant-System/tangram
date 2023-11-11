
// tangram.board

{
	init() {
		// fast references
		this.els = {
			doc: $(document),
			el: window.find(".board"),
			svg: window.find(".board svg"),
		};

		// bind event handlers
		this.els.svg.on("mousedown", "polygon", this.doDrag);
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
				break;
			case "solve-puzzle":
				data = Puzzles[event.name];
				Object.keys(data).map(k => {
					let [x, y, r] = data[k];
					APP.content.find(`g.${k}`)
						.css({ "transform": `translate(${x}px, ${y}px) rotate(${r}deg)` });
				});
				value = data.bg ? `url('~/icons/puzzle-${data.bg}.png')` : "";
				APP.content.find(`.board`).css({ "--puzzle": value });
				break;
		}
	},
	doDrag(event) {
		let APP = tangram,
			Self = APP.board,
			Drag = Self.drag;
		switch (event.type) {
			case "mousedown":
				let target = event.target.parentNode,
					el = $(target),
					[x, y, d] = el.attr("style").match(/\d{1,}/g).map(i => +i),
					offset = { x, y, d },
					click = {
						x: event.clientX,
						y: event.clientY,
					};
				// make sure active element is on top (z-index)
				target.parentNode.insertBefore(target, target.parentNode.lastChild);
				if (Self.els.active) Self.els.active.removeClass("active");
				Self.els.active = el.addClass("active");

				Self.drag = { el, offset, click };
				// cover app content
				APP.content.addClass("cover");
				// bind event handerls
				Self.els.doc.on("mousemove mouseup", Self.doDrag);
				break;
			case "mousemove":
				let left = Drag.offset.x - Drag.click.x + event.clientX,
					top = Drag.offset.y - Drag.click.y + event.clientY,
					deg = Drag.offset.d,
					transform = `translate(${left}px, ${top}px) rotate(${deg}deg)`;
				Drag.el.css({ transform });
				break;
			case "mouseup":
				// reset app content
				APP.content.removeClass("cover");
				// unbind event handerls
				Self.els.doc.off("mousemove mouseup", Self.doDrag);
				break;
		}
	}
}
