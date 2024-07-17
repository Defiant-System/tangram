

@import "modules/bg.js";
@import "modules/test.js"

const tangram = {
	init() {
		// init objects
		Bg.init();
		
		// DEV-ONLY-START
		Test.init(this);
		// DEV-ONLY-END
	},
	dispatch(event) {
		let Self = tangram,
			el;
		switch (event.type) {
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
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
				break;
		}
	}
};

window.exports = tangram;
