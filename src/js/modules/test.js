
let Test = {
	init(APP) {
		APP.board.dispatch({ type: "solve-puzzle", name: "box" });

		let l1 = new Line(120, 69, 170, 119),
			l2 = new Line(175, 220, 125, 170);

		// console.log( l1.snap(l2, 1, 10) );

		// let line = new Line(50, 0, -50, 100);
		// console.log( line.pointDistance(50, 50) );

		// new Guides({ debug: true });
	}
};

