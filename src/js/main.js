
@import "./classes/line.js"
@import "./classes/guides.js"
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
			name,
			value,
			pEl,
			el;
		switch (event.type) {
			case "window.init":
				break;
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
				break;
			default:
				el = event.el;
				if (event.origin) el = event.origin.el;
				if (!el && event.target) el = $(event.target);
				if (el) {
					pEl = el.data("area") ? el : el.parents(`[data-area]`);
					if (pEl.length) {
						name = pEl.data("area");
						return Self[name].dispatch(event);
					}
				}
		}
	},
	board: @import "./modules/board.js"
};

window.exports = tangram;
