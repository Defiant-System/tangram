
let Test = {
	init(APP) {
		// return;

		let poly = (...p) => new Polygon(...p.map(q => new Point(q[0], q[1])));

		let p1 = poly([0, 0], [0, 2], [2, 2], [2, 0]),
			p2 = poly([0, 0], [0, 3], [1, 3], [1, 0]),
			p3 = Polygon.union([p1, p2]);
		console.log( p1 );
		console.log( p2 );
		console.log( p3 );

		// APP.game.svg.drawOutline("1.3");
		// APP.game.svg.solve();
		
		// setTimeout(() => APP.game.svg.shuffle(), 1e3);

		// APP.game.dispatch({ type: "output-pgn" });


		// let p = new Point(0, 0),
		// 	path = [new Point(-1, 2), new Point(1, 2)],
		// 	t1 = new Polygon(...path),
		// 	t2 = t1.rotate(toRadians(180), p);
		// console.log( t1.toString() );
		// console.log( t2.toString() );


		// setTimeout(() => APP.game.tiles.b.rotate(15, APP.game.tiles.b.center), 200);
		// return setTimeout(() => APP.game.els.el.find(".tile").get(0).trigger("mousedown").trigger("mouseup"), 200);
	}
};

