
class Guides {
	constructor(opt={}) {
		// reference to root application
		let opts = {
				// offsets origo
				x: 0,
				y: 0,
				// offsets guide line
				w: 0,
				h: 0,
				mh: opt.offset.h >> 1 || 0,
				mw: opt.offset.w >> 1 || 0,
				lines: opt.lines || [],
				// snap sensitivity
				sensitivity: 7,
				// override defaults, if any
				...opt.offset,
			};
		
		// default properties
		this.els = [];

		opt.els.map(elem => {
			let rect = elem.getBBox(),
				y = rect.y,
				x = rect.x,
				w = rect.width,
				h = rect.height,
				mh = h >> 1,
				mw = w >> 1;
			if (!isNaN(y) && !isNaN(x)) {
				this.els.push({ y, x, w, h, mh, mw });
			}
		});

		// add guide line element to "this"
		this.opts = opts;
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
		// restrains position
		if (m.restrict) {
			let dy = m.top - o.t,
				dx = m.left - o.l,
				tie = ["h", "ne", "v", "nw", "h", "ne", "v", "nw", "h"],
				deg = Math.round(Math.atan2(dy, dx) * 180 / Math.PI);
			if (deg < 0) deg += 360;
			switch (tie[Math.round(deg / 45)]) {
				case "v": m.left = o.l; break;
				case "h": m.top = o.t; break;
				case "ne": m.left = o.l + (m.top - o.t); break;
				case "nw": m.left = o.l - (m.top - o.t); break;
			}
		}
		// iterate guide lines
		this.els.map(g => {
			let dy = t - g.y,
				dx = l - g.x,
				ohy = dy + o.h,
				oh1 = dy + o.mh,
				oh2 = ohy - g.h - o.mh,
				ghy = dy - g.h,
				ogh = ohy - g.h,
				oym = ohy - g.mh - o.mh,
				owx = dx + o.w,
				ow1 = dx + o.mw,
				ow2 = owx - g.w - o.mw,
				gwx = dx - g.w,
				ogw = owx - g.w,
				oxm = owx - g.mw - o.mw,
				_hd = hori.top !== -1,
				_vd = vert.top !== -1;
			// vertical comparisons
			switch (true) {
				case (!_hd && dy  < s && dy  > -s): hori = calcH(g, dy);                break;
				case (!_hd && ohy < s && ohy > -s): hori = calcH(g, ohy);               break;
				case (!_hd && oh1 < s && oh1 > -s): hori = calcH(g, oh1);               break;
				case (!_hd && oh2 < s && oh2 > -s): hori = calcH(g, oh2, { t: g.h });   break;
				case (!_hd && oym < s && oym > -s): hori = calcH(g, oym, { t: g.mh });  break;
				case (!_hd && ghy < s && ghy > -s): hori = calcH(g, ghy, { t: g.h-1 }); break;
				case (!_hd && ogh < s && ogh > -s): hori = calcH(g, ogh, { t: g.h-1 }); break;
			}
			// horizontal comparisons
			switch (true) {
				case (!_vd && dx  < s && dx  > -s): vert = calcV(g, dx);                break;
				case (!_vd && owx < s && owx > -s): vert = calcV(g, owx);               break;
				case (!_vd && ow1 < s && ow1 > -s): vert = calcV(g, ow1);               break;
				case (!_vd && ow2 < s && ow2 > -s): vert = calcV(g, ow2, { l: g.w });   break;
				case (!_vd && oxm < s && oxm > -s): vert = calcV(g, oxm, { l: g.mw });  break;
				case (!_vd && gwx < s && gwx > -s): vert = calcV(g, gwx, { l: g.w-1 }); break;
				case (!_vd && ogw < s && ogw > -s): vert = calcV(g, ogw, { l: g.w-1 }); break;
			}
		});
	}

}
