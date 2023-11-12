
class Line {
	constructor(x1, y1, x2, y2, ox, oy) {
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.ox = ox;
		this.oy = oy;

		let dx = Math.round(x2 - x1),
			dy = Math.round(y2 - y1),
			theta = Math.atan2(-dy, -dx);
		
		theta *= 180 / Math.PI;
		if (theta < 0) theta += 360;
		this.theta = theta;

		// reducing direction to value:
		// 1: 0,   180
		// 2: 45,  225
		// 3: 90,  270
		// 4: 135, 315
		this.dir = [0, 45, 90, 135].indexOf(theta >= 180 ? theta - 180 : theta);
	}

	translate(x, y) {
		let x1 = this.x1 + x,
			y1 = this.y1 + y,
			x2 = this.x2 + x,
			y2 = this.y2 + y;
		return new Line(x1, y1, x2, y2, this.ox, this.oy);
	}

	inRange(line) {
		
	}
}
