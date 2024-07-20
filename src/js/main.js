
@import "classes/Angle.js"
@import "classes/Arc.js"
@import "classes/Bounds.js"
@import "classes/Circle.js"
@import "classes/Line.js"
@import "classes/LinkedList.js"
@import "classes/Point.js"
@import "classes/Polygon.js"
@import "classes/Polyline.js"
@import "classes/Ray.js"
@import "classes/Rectangle.js"
@import "classes/Sector.js"
@import "classes/Segment.js"
@import "classes/Snapping.js"
@import "classes/Svg.js"
@import "classes/Tile.js"

@import "puzzles/index.js"
@import "puzzles/shuffle.js"

@import "modules/bg.js";
@import "modules/boolean.js";
@import "modules/misc.js";
@import "modules/test.js"



let DefaultState = {
	level: "1.3",
	theme: "sunset",
};


const tangram = {
	init() {
		// init objects
		Bg.init();

		// init all sub-objects
		Object.keys(this)
			.filter(i => typeof this[i].init === "function")
			.map(i => this[i].init(this));
		
		// get saved state, if any
		this.state = window.settings.getItem("state") || DefaultState;
		// go to last saved state
		this.dispatch({ type: "apply-saved-state" });

		// DEV-ONLY-START
		Test.init(this);
		// DEV-ONLY-END
	},
	dispatch(event) {
		let Self = tangram,
			value,
			el;
		switch (event.type) {
			// system events
			case "window.init":
			case "window.close":
				break;
			case "window.focus":
				// resume background worker
				Bg.dispatch({ type: "resume" });
				break;
			case "window.blur":
				// resume background worker
				Bg.dispatch({ type: "pause" });
				break;
			// custom events
			case "apply-saved-state":
				Object.keys(Self.state).map(k => {
					Self.game.dispatch({ type: `set-${k}`, arg: Self.state[k] });
				});
				break;
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
				break;
			// proxy events
			case "output-pgn":
			case "draw-outline":
			case "set-level":
			case "set-theme":
				return Self.game.dispatch(event);
			default:
				el = event.el;
				if (!el && event.origin) el = event.origin.el;
				if (el) {
					let pEl = el.parents(`?div[data-area]`);
					if (pEl.length) {
						let name = pEl.data("area");
						return Self[name].dispatch(event);
					}
				}
		}
	},
	game: @import "areas/game.js",
};

window.exports = tangram;
