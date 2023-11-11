
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
				this.els.push({ y, x, w, h, ox, oy, points: polygon.points });
			}
		});

		// add guide line element to "this"
		this.opts = opts;

		if (opts.debug) {
			let gCenter = window.find(".board svg g.center"),
				[a, b, c, d, cx, cy] = gCenter.css("transform").match(/\d{1,}/g).map(i => +i),
				str = [];
			this.els.map(shape => {
				switch (shape.points.length) {
					case 3: // triangle
						[...shape.points].map(point => {
							let x1 = point.x + shape.ox,
								y1 = point.y + shape.oy;
							str.push(`<circle cx="${x1}" cy="${y1}" r="5"/>`);
						});
						// str.push(`<line x1="-100" y1="50" x2="0" y2="-50"/>`);
						// str.push(`<line x1="0" y1="-50" x2="100" y2="50"/>`);
						// str.push(`<line x1="100" y1="50" x2="-100" y2="50"/>`);
						break;
					case 4: // rect or rhomboid
						break;
				}
			});
			window.find(".board")
				.append(`<svg class="debug" viewBox="0 0 600 540"><g class="center">${str.join("")}</g></svg>`);
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
