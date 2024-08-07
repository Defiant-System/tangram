
// tangram.start

{
	init() {
		// fast references
		this.els = {
			el: window.find(".start-view"),
			content: window.find("content"),
		};

		// render HTML
		window.render({
			template: "start-view",
			match: "//Data",
			target: this.els.el.find(".levels"),
		});

		// reference to "frame"
		this.els.frame = this.els.el.find(".frame");
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
				// smooth scroll to "world"
				Self.els.frame.data({ world: el.index() + 1 });
				break;
			case "select-level":
				// prepare level
				el = $(event.target).parents("?li");
				if (!Level[el.data("id")] || !el.hasClass("unlocked")) return;

				APP.game.dispatch({ type: "set-level", arg: el.data("id") });
				// switch view
				APP.dispatch({ type: "show-game-view" });
				break;
			case "enable-levels":
				event.levels.map(key => {
					let [w,i] = key.split(".");
					Self.els.el.find(`.world li[data-id="${w}.${i}"]`).addClass("unlocked");
					// remember the last
					value = Math.max(w, value || 0);
				});
				// "auto scroll" to last cleared level
				let wIndex = +Self.els.frame.data("world");
				if (value > wIndex) {
					// Self.els.frame.data({ world: value });
					Self.els.el.find(`.nav[data-click="select-world"] li`).get(value - 1).trigger("click");
				}
				break;
		}
	}
}
