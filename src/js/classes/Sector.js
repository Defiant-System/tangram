
class Sector extends Arc {
	constructor() {
		super(...arguments);
		this.type = "sector";
	}

	contains(s) {
		return Point.distance(s, this.c) <= this.radius && new Angle(this.start,this.c,s).rad <= this.angle;
	}

	toString() {
		return `sector(${this.c},${this.start},${this.angle})`;
	}
}
