
class Line {
	constructor(x1, y1, x2, y2) {
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;

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
		return new Line(x1, y1, x2, y2);
	}

	midpoint() {
		let mx = ((this.x1 + this.x2) / 2),
			my = ((this.y1 + this.y2) / 2);
		return [mx, my];
	}

	euclideanDistance(line) {
		let a = this.midpoint(),
			b = line.midpoint();
		return Math.hypot(...Object.keys(a).map(k => b[k] - a[k]));
	}

	inRange(line) {

	}

	serialize() {
		return [this.x1, this.y1, this.x2, this.y2];
	}

	extend() {
		let a = 20,
			b = 15,
			x1 = this.x1,
			y1 = this.y1,
			x2 = this.x2,
			y2 = this.y2;
		switch (this.theta) {
			case 0:   x1 += a; x2 -= a; break;
			case 90:  y1 += a; y2 -= a; break;
			case 180: x1 -= a; x2 += a; break;
			case 270: y1 -= a; y2 += a; break;
			case 45:  x1 += b; y1 += b; x2 -= b; y2 -= b; break;
			case 135: x1 -= b; y1 += b; x2 += b; y2 -= b; break;
			case 225: x1 -= b; y1 -= b; x2 += b; y2 += b; break;
			case 315: x1 += b; y1 -= b; x2 -= b; y2 += b; break;
			default: console.log(theta);
		}
		return new Line(x1, y1, x2, y2);
	}
}
