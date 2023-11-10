
// tangram.board

{
	dispatch(event) {
		let APP = tangram,
			Self = APP.board,
			data,
			value,
			el;
		switch (event.type) {
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
	drag(event) {

	}
}
