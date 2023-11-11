
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
				// offsets origo
				x: 0,
				y: 0,
				// offsets guide line
				w: 0,
				h: 0,
				debug: opt.debug || false,
				lines: opt.lines || [],
				// snap sensitivity
				sensitivity: 5,
				// override defaults, if any
				...opt.offset,
			};
		
		// default properties
		this.els = [];

		window.find(opts.context +" "+ opts.selector).map(elem => {
			let box = elem.getBBox(),
				w = box.width,
				h = box.height,
				polygon = elem.childNodes[1],
				[ox, oy] = polygon.getAttribute("offset").split(",").map(i => +i),
				[x, y, d] = elem.style.transform.match(/(-?)\d{1,}/g).map(i => +i);
			if (!isNaN(y) && !isNaN(x)) {
				this.els.push({ y, x, d: 360-d, w, h, ox, oy, points: polygon.points });
			}
		});

		// add guide line element to "this"
		this.opts = opts;

		if (opts.debug) {
			// clear old
			window.find(".board svg.debug").remove();

			let gCenter = window.find(".board svg g.center"),
				[a, b, c, d, cx, cy] = gCenter.css("transform").match(/\d{1,}/g).map(i => +i),
				rotate = (cx, cy, x, y, angle) => {
					let radians = (Math.PI / 180) * angle,
						cos = Math.cos(radians),
						sin = Math.sin(radians),
						nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
						ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
					return [nx, ny];
				},
				str = [];
			this.els.map(shape => {
				[...shape.points].map((p1, i, arr) => {
					let p2 = arr[i+1] || arr[0],
						[p1x, p1y] = rotate(0, 0, p1.x + shape.ox, p1.y + shape.oy, shape.d),
						[p2x, p2y] = rotate(0, 0, p2.x + shape.ox, p2.y + shape.oy, shape.d),
						x1 = shape.x + p1x,
						y1 = shape.y + p1y,
						x2 = shape.x + p2x,
						y2 = shape.y + p2y,
						dx = Math.round(x2 - x1),
						dy = Math.round(y2 - y1),
						theta = Math.atan2(-dy, -dx);
					
					theta *= 180 / Math.PI;
					if (theta < 0) theta += 360;

					switch (theta) {
						case 0: x1 += 50; x2 -= 50; break;
						case 45: x1 += 40; y1 += 40; x2 -= 40; y2 -= 40; break;
						case 90: y1 += 50; y2 -= 50; break;
						case 135: x1 -= 40; y1 += 40; x2 += 40; y2 -= 40; break;
						case 180: x1 -= 50; x2 += 50; break;
						case 225: x1 -= 40; y1 -= 40; x2 += 40; y2 += 40; break;
						case 270: y1 -= 50; y2 += 50; break;
						case 315: x1 += 40; y1 -= 40; x2 -= 40; y2 += 40; break;
						default: console.log(theta);
					}

					str.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`);
				});
			});
			// insert debug lines
			str = `<svg class="debug" viewBox="0 0 600 540"><g class="center">${str.join("")}</g></svg>`;
			window.find(".board").append(str);
		}
	}

	snapPos(m) {
		let o = this.opts,
			s = o.sensitivity,
			t = m.top + o.y,
			l = m.left + o.x,
			vert = { top: -1, left: -1, width: 1 },
			hori = { top: -1, left: -1, height: 1 },
			calcH = (g, y, add = { t: 0 }) => {
				let minX = l,
					maxX = g.x,
					w = maxX-minX+g.w;
				if (w < o.w) w = o.w;
				m.top -= y;
				if (maxX < minX) {
					minX = g.x;
					maxX = l;
					w = maxX-minX+o.w;
					if (w < g.w) w = g.w;
				}
				return { top: g.y+add.t, left: minX, width: w };
			},
			calcV = (g, x, add = { l: 0 }) => {
				let minY = t,
					maxY = g.y,
					h = maxY-minY+g.h;
				if (h < o.h) h = o.h;
				m.left -= x;
				if (maxY < minY) {
					minY = g.y;
					maxY = t;
					h = maxY-minY+o.h;
					if (h < g.h) h = g.h;
				}
				return { top: minY, left: g.x+add.l, height: h };
			};
		// iterate guide lines
		this.els.map(g => {
			let dy = t - g.y,
				dx = l - g.x,
				ohy = dy + o.h,
				ghy = dy - g.h,
				ogh = ohy - g.h,
				owx = dx + o.w,
				gwx = dx - g.w,
				ogw = owx - g.w,
				_hd = hori.top !== -1,
				_vd = vert.top !== -1;
			// vertical comparisons
			switch (true) {
				case (!_hd && dy  < s && dy  > -s): hori = calcH(g, dy);                break;
				case (!_hd && ohy < s && ohy > -s): hori = calcH(g, ohy);               break;
				case (!_hd && ghy < s && ghy > -s): hori = calcH(g, ghy, { t: g.h-1 }); break;
				case (!_hd && ogh < s && ogh > -s): hori = calcH(g, ogh, { t: g.h-1 }); break;
			}
			// horizontal comparisons
			switch (true) {
				case (!_vd && dx  < s && dx  > -s): vert = calcV(g, dx);                break;
				case (!_vd && owx < s && owx > -s): vert = calcV(g, owx);               break;
				case (!_vd && gwx < s && gwx > -s): vert = calcV(g, gwx, { l: g.w-1 }); break;
				case (!_vd && ogw < s && ogw > -s): vert = calcV(g, ogw, { l: g.w-1 }); break;
			}
		});
	}

}
