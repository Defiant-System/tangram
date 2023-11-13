
let Test = {
	init(APP) {
		APP.board.dispatch({ type: "solve-puzzle", name: "test" });

		let l1 = new Line(0, 0, 10, 0),
			l2 = new Line(12, 5, 22, 5);

		console.log( l1.distance(l2) );
		// console.log( l1.midpoint() );
		// console.log( l2.midpoint() );
		// console.log( l1.euclideanDistance(l2) );

		new Guides({ debug: true });
	}
};
