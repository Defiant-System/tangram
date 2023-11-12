
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
				omit: opt.omit || [],
				debug: opt.debug || false,
				// snap sensitivity
				sensitivity: 8,
			},
			items = window.find(opts.context +" "+ opts.selector),
			gCenter = items.get(0).parent();

		// default properties
		this.stickyLines = [];
		this.movingLines = [];
		// add guide line element to "this"
		this.opts = opts;

		items.map(shape => {
			let box = shape.getBBox(),
				polygon = shape.childNodes[1],
				[ox, oy] = polygon.getAttribute("offset").split(",").map(i => +i),
				[x, y, d] = shape.style.transform.match(/(-?)\d{1,}/g).map(i => +i),
				deg = 360 - d;
			// console.log( shape, ox, oy );

			[...polygon.points].map((p1, i, arr) => {
				let p2 = arr[i+1] || arr[0],
					[p1x, p1y] = this.rotate(0, 0, p1.x+ox, p1.y+oy, deg),
					[p2x, p2y] = this.rotate(0, 0, p2.x+ox, p2.y+oy, deg),
					line = new Line(p1x+x, p1y+y, p2x+x, p2y+y, ox, oy);
				if (opts.omit.includes(shape)) this.movingLines.push(line);
				else this.stickyLines.push(line);
			});
		});

		if (opts.debug) {
			// clear old
			window.find(".board svg.debug").remove();

			let str = [`<svg class="debug" viewBox="0 0 600 540"><g class="center">`];
			this.stickyLines.map(line => {
				let l = line.extend();
				// insert debug lines
				str.push(`<line x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}"/>`);
			});
			str.push(`</g></svg>`);
			window.find(".board").addClass("debug").append(str.join(""));
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

	snapPos(mouse) {
		let opt = this.opts,
			s = opt.sensitivity,
			t = mouse.top,
			l = mouse.left,
			// translate moving lines
			move = this.movingLines.map(line => line.translate(l, t));

		move.map(mLine => {
			let filtered = this.stickyLines.filter(l => l.dir === mLine.dir);
			// console.log( mLine.dir, filtered.length );
			if (mLine.dir === 2 && filtered.length) {
				console.log( mLine.euclideanDistance(filtered[0]) );
			}
		});

	}

}
