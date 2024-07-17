
let Test = {
	init(APP) {
		// return;

		// setTimeout(() => APP.game.tiles.b.rotate(15, APP.game.tiles.b.center), 200);
		setTimeout(() => APP.game.els.el.find(".tile").get(1).trigger("mousedown").trigger("mouseup"), 200);
		
	}
};

