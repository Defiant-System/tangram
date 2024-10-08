
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

@import "modules/shuffle.js"
@import "modules/snapshot.js";
@import "modules/bg.js";
@import "modules/simplify.js";
@import "modules/boolean.js";
@import "modules/misc.js";
@import "modules/test.js"


// will be populated below
let Level = {};

window.bluePrint.selectNodes(`//World/i`).map(xLevel => {
	let w = xLevel.parentNode.getAttribute("id"),
		i = xLevel.getAttribute("id"),
		name = xLevel.getAttribute("name"),
		tiles = JSON.parse(xLevel.textContent);
	// level details
	Level[`${w}.${i}`] = { name, tiles };
});


let DefaultState = {
	theme: "classic",
	level: "1.1",
	cleared: ["1.1"],
	state: {
		"a": [-97, 305, 45],
		"b": [306,-124, 225],
		"c": [85,-137, 45],
		"d": [165, 313, 0],
		"e": [323, 186, 270],
		"f": [-79,-96, 270],
		"g": [-152, 55, 45],
	}
};


const tangram = {
	init() {
		// fast references
		this.content = window.find("content");

		// init objects
		Snapshot.init();
		Bg.init();

		// init all sub-objects
		Object.keys(this)
			.filter(i => typeof this[i].init === "function")
			.map(i => this[i].init(this));
		
		// transform levels into menu entries
		this.dispatch({ type: "levels-to-menu" });

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
				break;
			case "window.close":
				// stop bg-worker
				Bg.dispatch({ type: "dispose", kill: true });
				// make sure state is saved
				Self.game.dispatch({ type: "save-state" });
				// save game state
				window.settings.setItem("state", Self.state);
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
						case "cleared":
							Self.start.dispatch({ type: "enable-levels", levels: Self.state[key] });
							break;
					}
					Self.game.dispatch({ type: `set-${key}`, arg: Self.state[key], state: Self.state.state });
				});
				break;
			case "levels-to-menu":
				let xMenu = window.bluePrint.selectSingleNode(`//Menu[@for="level-entries"]`),
					xLevel = [];
				
				Object.keys(Level).map(k => {
					let [w, i] = k.split(".").map(i => +i);
					if (!xLevel[w-1]) xLevel[w-1] = [];
					xLevel[w-1].push(`<Menu name="${Level[k].name}" click="set-level" arg="${k}" check-group="game-level"/>`);
				});

				let xStr = xLevel.map((xW, i) => `<Menu name="${i+1}">${xLevel[i].join("")}</Menu>`);
				$.xmlFromString(`<data>${xStr.join("")}</data>`).selectNodes("/data/Menu").map(x => xMenu.appendChild(x));
				// finalize / commit menu changes to bluePrint
				window.menuBar.commit();
				break;
			case "show-start-view":
			case "show-game-view":
				Self.content.data({ show: event.type.split("-")[1] })
				break;
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
				break;
			// proxy events
			case "toggle-background":
			case "shuffle-pieces":
			case "solve-puzzle":
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
	start: @import "areas/start.js",
};

window.exports = tangram;
