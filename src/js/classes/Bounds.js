
class Bounds {
	constructor(t, e, i, n, r) {
		this.xMin = t,
		this.xMax = e,
		this.yMin = i,
		this.yMax = n,
		r === "swap" ? (this.dx < 0 && ([this.xMin,this.xMax] = [e, t]),
		this.dy < 0 && ([this.yMin,this.yMax] = [n, i])) : r === "center" && (this.dx < 0 && (this.xMin = this.xMax = (t + e) / 2),
		this.dy < 0 && (this.yMin = this.yMax = (i + n) / 2))
	}
	contains(t) {
		return this.containsX(t) && this.containsY(t)
	}
	containsX(t) {
		return K(t.x, this.xMin, this.xMax)
	}
	containsY(t) {
		return K(t.y, this.yMin, this.yMax)
	}
	resize(t, e) {
		return new Bounds(this.xMin,this.xMax + t,this.yMin,this.yMax + e)
	}
	get dx() {
		return this.xMax - this.xMin
	}
	get dy() {
		return this.yMax - this.yMin
	}
	get xRange() {
		return [this.xMin, this.xMax]
	}
	get yRange() {
		return [this.yMin, this.yMax]
	}
	extend(t, e=t, i=t, n=e) {
		return new Bounds(this.xMin - n,this.xMax + e,this.yMin - t,this.yMax + i)
	}
	get rect() {
		return new Rectangle(new Point(this.xMin,this.yMin),this.dx,this.dy)
	}
	get center() {
		return new Point(this.xMin + this.dx / 2,this.yMin + this.dy / 2)
	}
	get flip() {
		return new Bounds(this.yMin,this.yMax,this.xMin,this.xMax)
	}
}
