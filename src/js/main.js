
@import "./puzzles/index.js"
@import "./modules/test.js"

const tangram = {
	init() {
		// fast references
		this.content = window.find("content");
		// init sub objects
		Object.keys(this).filter(i => this[i].init).map(i => this[i].init());

		// DEV-ONLY-START
		Test.init(this);
		// DEV-ONLY-END
	},
	dispatch(event) {
		let Self = tangram,
			el;
		switch (event.type) {
			case "window.init":
				break;
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
				break;
		}
	},
	board: @import "./modules/board.js"
};

window.exports = tangram;
