
class Line {
	constructor(x1, y1, x2, y2) {
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;

		let dx = Math.round(x2 - x1),
			dy = Math.round(y2 - y1),
			rad = Math.atan2(-dy, -dx),
			theta = rad * 180 / Math.PI;
		if (theta < 0) theta += 360;
		this.theta = theta;

		// reducing direction to value:
		// 1: 0,   180
		// 2: 45,  225
		// 3: 90,  270
		// 4: 135, 315
		this.dir = [0, 45, 90, 135].indexOf(theta >= 180 ? theta - 180 : theta);
		this.rad = rad - Math.PI;
		this._sin = Math.sin(this.rad);
		this._cos = Math.cos(this.rad);
	}

	get length() {
		let dx = this.x1 - this.x2,
			dy = this.y1 - this.y2;
		return Math.sqrt(dx * dx + dy * dy);
	}

	get slope() {
		return (this.y2 - this.y1) / (this.x2 - this.x1);
	}

	get sX() { return this.x1 > this.x2 ? this.x2 : this.x1; }
	get sY() { return this.y1 > this.y2 ? this.y2 : this.y1; }
	get eX() { return this.x1 < this.x2 ? this.x2 : this.x1; }
	get eY() { return this.y1 < this.y2 ? this.y2 : this.y1; }

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

	pointDistance(x, y) {
		let a = x - this.x1,
			b = y - this.y1,
			c = this.x2 - this.x1,
			d = this.y2 - this.y1,
			len_sq = c * c + d * d,
			param = -1,
			xx,
			yy;

		//in case of 0 length line
		if (len_sq != 0) param = (a * c + b * d) / len_sq;

		if (param < 0) {
			xx = this.x1;
			yy = this.y1;
		} else if (param > 1) {
			xx = this.x2;
			yy = this.y2;
		} else {
			xx = this.x1 + param * c;
			yy = this.y1 + param * d;
		}

		let dx = x - xx;
		let dy = y - yy;
		let ds = dx < 0 ? -1 : 1;
		return ds * Math.sqrt(dx * dx + dy * dy);
	}

	distance(line, dir, snap) {
		let dx = 0,
			dy = 0;
		if (this.dir % 2 === 0) {
			let cx, cy;
			// horisontal & vertical
			if (this.sX <= line.eX && this.eX >= line.sX) cx = 0;
			else if (this.eX < line.sX && this.eX < line.eX) cx = line.sX - this.eX;
			else if (this.sX > line.sX && this.sX > line.eX) cx = line.eX - this.sX;
			if (this.sY <= line.eY && this.eY >= line.sY) cy = 0;
			else if (this.eY < line.sY && this.eY < line.eY) cy = this.eY - line.sY;
			else if (this.sY > line.sY && this.sY > line.eY) cy = this.sY - line.eY;

			if (dir === 0 && cx === 0 && cy < snap && cy > -snap) dy = cy;
			if (dir === 2 && cy === 0 && cx < snap && cx > -snap) dx = cx;
		} else {
			// diagonal
			let distances = [
					{ line: this, x: line.x1, y: line.y1, },
					{ line: this, x: line.x2, y: line.y2, },
					{ line: line, x: this.x1, y: this.y1, },
					{ line: line, x: this.x2, y: this.y2, },
				];
			// calc distances
			distances.map(dist => {
				dist.val = dist.line.pointDistance(dist.x, dist.y);
				dist.abs = Math.abs(dist.val);
			});
			// shortest distance
			distances = distances.sort((a, b) => a.abs - b.abs);

				// console.log(distances[0].val);
			if (distances[0].abs < snap) {
				dx = distances[0].val * this._sin;
				dy = distances[0].val * this._cos;
			}
		}
		return [dx, dy];
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
			default: console.log(this.theta);
		}
		return new Line(x1, y1, x2, y2);
	}
}
