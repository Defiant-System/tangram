
let Test = {
	init(APP) {
		APP.board.dispatch({ type: "solve-puzzle", name: "test" });

		// let l1 = new Line(5, 0, 5, 10),
		// 	l2 = new Line(5, 5, 5, 20);

		// let l1 = new Line(0, 0, 10, 10),
		// 	l2 = new Line(5, 5, 15, 15);
		// console.log( l1.distance(l2) );

		new Guides({ debug: true });
	}
};

/**/
class Fail {
	distance(line) {
		let dx1 = this.x1 - line.x1,
			dy1 = this.y1 - line.y1,
			dx2 = this.x1 - line.x2,
			dy2 = this.y1 - line.y2,
			dx3 = this.x2 - line.x2,
			dy3 = this.y2 - line.y2,
			dx4 = this.x2 - line.x1,
			dy4 = this.y2 - line.y1,
			dx = Math.min(dx1, dx2, dx3, dx4),
			dy = Math.min(dy1, dy2, dy3, dy4);
		return [dx, dy];
	}

	distance2(line) {
		let dx = 0,
			dy = 0;
		
		if (this.x1 < line.x2 && line.x1 < this.x2) dx = 0;
		if (this.x2 < line.x1 && this.x2 < line.x2) dx = Math.min(line.x1, line.x2) - Math.max(this.x1, this.x2);
		if (this.x1 > line.x1 && this.x1 > line.x2) dx = Math.min(this.x1, this.x2) - Math.max(line.x1, line.x2);
		
		if (this.y1 < line.y2 && line.y1 < this.y2) dy = 0;
		if (this.y2 < line.y1 && this.y2 < line.y2) dy = Math.min(line.y1, line.y2) - Math.max(this.y1, this.y2);
		if (this.y1 > line.y1 && this.y1 > line.y2) dy = Math.max(this.y1, this.y2) - Math.max(line.y1, line.y2);
		
		return [dx, dy];
	}
}
