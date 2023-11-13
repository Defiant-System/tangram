
let Test = {
	init(APP) {
		APP.board.dispatch({ type: "solve-puzzle", name: "test" });

		// let l1 = new Line(5, 0, 5, 10),
		// 	l2 = new Line(5, 5, 5, 20);

		let l1 = new Line(0, 0, 10, 10),
			l2 = new Line(8, 5, 18, 15);

		// console.log(l1.slope);
		// console.log(l2.slope);

		l1.distance(l2);
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

	pDistance(x, y, x1, y1, x2, y2) {
		var A = x - x1;
		var B = y - y1;
		var C = x2 - x1;
		var D = y2 - y1;
		var dot = A * C + B * D;
		var len_sq = C * C + D * D;
		var param = -1;

		//in case of 0 length line
		if (len_sq != 0) param = dot / len_sq;

		var xx, yy;

		if (param < 0) {
			xx = x1;
			yy = y1;
		} else if (param > 1) {
			xx = x2;
			yy = y2;
		} else {
			xx = x1 + param * C;
			yy = y1 + param * D;
		}

		var dx = x - xx;
		var dy = y - yy;
		return Math.sqrt(dx * dx + dy * dy);
	}
}
