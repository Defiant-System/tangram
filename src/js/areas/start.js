
// tangram.start

{
	init() {
		// fast references
		this.els = {
			el: window.find(".start-view"),
			content: window.find("content"),
		};
	},
	dispatch(event) {
		let APP = tangram,
			Self = APP.start,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			// custom events
			case "select-world":
				el = $(event.target);
				el.parent().find(".active").removeClass("active");
				el.addClass("active");
				break;
			case "select-level":
				break;
		}
	}
}
