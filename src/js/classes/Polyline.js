
class Polyline extends Polygon {
	constructor() {
		super(...arguments);
		this.type = "polyline";
	}

	get circumference() {
		return this.length;
	}

	get length() {
		let s = 0;
		for (let t = 1; t < this.points.length; ++t) {
			s += u.distance(this.points[t - 1], this.points[t]);
		}
		return s;
	}

	get edges() {
		let s = [];
		for (let t = 0; t < this.points.length - 1; ++t) {
			s.push(new Segment(this.points[t],this.points[t + 1]));
		}
		return s;
	}
	
	toString() {
		return `polyline(${this.points.join(",")})`;
	}
}
