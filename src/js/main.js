
@import "classes/Angle.js"
@import "classes/Arc.js"
@import "classes/Bounds.js"
@import "classes/Circle.js"
@import "classes/Line.js"
@import "classes/LinkedList.js"
@import "classes/Outline.js"
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
@import "modules/simplify.js";
@import "modules/boolean.js";
@import "modules/misc.js";
@import "modules/test.js"



let DefaultState = {
	level: "1.3",
	theme: "classic",
	state: {
		// "a": [51, 99, 270],
		// "b": [101, 48.999999999999986, 0],
		// "c": [277, 34.999999999999986, 90],
		// "d": [76.00000000000003, 174, 0],
		// "e": [176.00000000000003, 49, 270],
		// "f": [101.00000000000003, 124, 0],
		// "g": [151.00000000000003, 149, 90],
		"a": [141.6106781186547,41,45],
		"b": [70.85533905932738,41.08932188134523,315],
		"d": [35.5,111.80000000000001,45],
		"g": [106.21067811865476,76.44466094067263,135],
		"e": [159.24368670764582,129.4776695296637,135],
		"f": [194.64368670764583,94.0330085889911,315],
		"c": [-108.1,4.5,45],
	}
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
				Object.keys(Self.state).map(key => {
					switch (key) {
						case "theme":
							window.bluePrint.selectNodes(`//*[@check-group="game-theme"]`).map(xMenu => {
								if (xMenu.getAttribute("arg") === Self.state[key]) xMenu.setAttribute("is-checked", 1);
								else xMenu.removeAttribute("is-checked");
							});
							break;
						case "level":
							window.bluePrint.selectNodes(`//*[@check-group="game-level"]`).map(xMenu => {
								if (xMenu.getAttribute("arg") === Self.state[key]) xMenu.setAttribute("is-checked", 1);
								else xMenu.removeAttribute("is-checked");
							});
							break;
					}
					Self.game.dispatch({ type: `set-${key}`, arg: Self.state[key] });
				});
				break;
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
				break;
			// proxy events
			case "toggle-background":
			case "output-pgn":
			case "set-level":
			case "set-theme":
			case "set-state":
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
