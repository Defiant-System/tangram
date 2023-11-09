
@import "./puzzles.js"

const tangram = {
	init() {
		// fast references
		this.content = window.find("content");

		this.dispatch({ type: "solve-puzzle", name: "house" });
	},
	dispatch(event) {
		let Self = tangram,
			data,
			el;
		switch (event.type) {
			case "window.init":
				break;
			case "solve-puzzle":
				data = Puzzles[event.name];
				Object.keys(data).map(k => {
					let [x, y, r] = data[k];
					Self.content.find(`g.${k}`)
						.css({ "transform": `translate(${x}px, ${y}px) rotate(${r}deg)` });
				});
				break;
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
				break;
		}
	}
};

window.exports = tangram;
