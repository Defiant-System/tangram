
let Test = {
	init(APP) {
		APP.board.dispatch({ type: "solve-puzzle", name: "test" });

		new Guides({ debug: true });
	}
};

