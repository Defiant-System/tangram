
class Guides {

	static get selector() {
		return "svg.pieces g.center > *:not(.debug)";
	}

	static get context() {
		return ".board";
	}

	constructor(opt={}) {
		// reference to root application
		let opts = {
				// default selector & context
				selector: opt.selector || Guides.selector,
				context: opt.context || Guides.context,
				debug: opt.debug || false,
				// snap sensitivity
				sensitivity: 5,
			},
			items = window.find(opts.context +" "+ opts.selector),
			gCenter = items.get(0).parent();

		// default properties
		this.lines = [];
		// add guide line element to "this"
		this.opts = opts;

		items.map(shape => {
			let box = shape.getBBox(),
				polygon = shape.childNodes[1],
				[ox, oy] = polygon.getAttribute("offset").split(",").map(i => +i),
				[x, y, d] = shape.style.transform.match(/(-?)\d{1,}/g).map(i => +i),
				deg = 360 - d;

			[...polygon.points].map((p1, i, arr) => {
				let p2 = arr[i+1] || arr[0],
					[p1x, p1y] = this.rotate(0, 0, p1.x + ox, p1.y + oy, deg),
					[p2x, p2y] = this.rotate(0, 0, p2.x + ox, p2.y + oy, deg),
					x1 = x + p1x,
					y1 = y + p1y,
					x2 = x + p2x,
					y2 = y + p2y,
					dx = Math.round(x2 - x1),
					dy = Math.round(y2 - y1),
					theta = Math.atan2(-dy, -dx);
				
				theta *= 180 / Math.PI;
				if (theta < 0) theta += 360;

				switch (theta) {
					case 0: x1 += 50; x2 -= 50; break;
					case 90: y1 += 50; y2 -= 50; break;
					case 180: x1 -= 50; x2 += 50; break;
					case 270: y1 -= 50; y2 += 50; break;
					case 45: x1 += 40; y1 += 40; x2 -= 40; y2 -= 40; break;
					case 135: x1 -= 40; y1 += 40; x2 += 40; y2 -= 40; break;
					case 225: x1 -= 40; y1 -= 40; x2 += 40; y2 += 40; break;
					case 315: x1 += 40; y1 -= 40; x2 -= 40; y2 += 40; break;
					default: console.log(theta);
				}
				this.lines.push({ x1, y1, x2, y2 });
			});
		});

		if (opts.debug) {
			// clear old
			window.find(".board svg.debug").remove();

			let str = this.lines.map(line => `<line x1="${line.x1}" y1="${line.y1}" x2="${line.x2}" y2="${line.y2}"/>`);
			// insert debug lines
			str = `<svg class="debug" viewBox="0 0 600 540"><g class="center">${str.join("")}</g></svg>`;
			window.find(".board").append(str);
		}
	}

	rotate(cx, cy, x, y, angle) {
		let radians = (Math.PI / 180) * angle,
			cos = Math.cos(radians),
			sin = Math.sin(radians),
			nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
			ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
		return [nx, ny];
	}

	snapPos(m) {

	}

}
