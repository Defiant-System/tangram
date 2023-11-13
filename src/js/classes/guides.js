
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
				selector: Guides.selector,
				context: Guides.context,
				omit: [],
				debug: false,
				// snap sensitivity
				sensitivity: 10,
				...opt,
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
				deg = (360 - d) % 360;
			// console.log( shape, ox, oy );
			// console.log( shape.getAttribute("class") );

			[...polygon.points].map((p1, i, arr) => {
				let p2 = arr[i+1] || arr[0],
					[p1x, p1y] = this.rotate(0, 0, p1.x+ox, p1.y+oy, deg),
					[p2x, p2y] = this.rotate(0, 0, p2.x+ox, p2.y+oy, deg),
					line = new Line(p1x+x, p1y+y, p2x+x, p2y+y, ox, oy);
				// if (shape.getAttribute("class") === "g21" && line.dir === 2) {
				// 	console.log( line.serialize(), line.midpoint() );
				// }
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
			l = mouse.left - opt.offset.x,
			t = mouse.top - opt.offset.y,
			// translate moving lines
			move = this.movingLines.map(line => line.translate(l, t));

		move.map(line => {
			let filtered = this.stickyLines.filter(l => l.dir === line.dir);
			if (line.dir === 2) {
				filtered.map(fLine => {
					let d = line.distance(fLine),
						diff = line.dir === fLine.dir ? d[0] : -d[0];
					if (diff < s && diff > -s) mouse.left += diff;
				});
			}
			// if (line.dir === 2 && filtered.length) {
			// 	let d = line.distance(filtered[0]);
			// 	console.log( d );
			// 	if (d[0] < s && d[0] > -s) mouse.left += d[0];
			// }
		});

	}

}
