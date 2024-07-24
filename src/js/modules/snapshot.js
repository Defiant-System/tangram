
let Snapshot = {
	init() {
		let size = 73,
			{ cvs, ctx } = Misc.createCanvas(size, size);
		this.cvs = cvs;
		this.ctx = ctx;
		this.size = size;

		// TODO: check/skip if image is cached

		// create queue
		this.queue = [];

		// Object.keys()
		Object.keys(Level).map(id => {
			let pieces = [];
			Object.keys(Level[id].tiles).map(k => {
				let list = POLYGONS[k].slice(1,-1).split("L").map(p => p.split(",").map(i => +i)),
					points = list.map(p => new Point(p[0], p[1])),
					path = new Polygon(...points),
					[x, y, r] = Level[id].tiles[k],
					position = new Point(x, y);
				// rotate path
				path = path.translate(position).rotate(toRadians(r), position);
				// add path to be "union"ed
				pieces.push(path);
			});

			let union = Polygon.union(pieces, TOLERANCE.union);
			let clean = simplify(union[0].points, TOLERANCE.simplify);
			let path = new Polygon(...clean);

			this.queue.push({ id, path: path.toSvg() });
		});

		// start queue
		if (this.queue.length) this.make();
	},
	make() {
		let width = this.size,
			height = this.size,
			opt = this.queue.shift(),
			[w,i] = opt.id.split("."),
			name = `${opt.id}.png`,
			img = new Image(),
			svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-200 -200 600 600">
					<style type="text/css">
						.st0{fill:url(#SVG-GR-1);}
					</style>
					<linearGradient id="SVG-GR-1" x1=".5" y1="0" x2=".5" y2="1">
						<stop offset="0%" stop-color="#f2f2f2" />
						<stop offset="100%" stop-color="#888" />
					</linearGradient>
					<path class="st0" d="${opt.path}"></path></svg>`,
			src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

		img.onload = () => {
			// reset canvas
			this.cvs.attr({ width, height });
			this.ctx.drawImage(img, -5, -5, width + 10, height + 10);

			this.cvs[0].toBlob(async blob => {
				await window.cache.set({ name, blob });
				window.find(`.world li[data-id="${w}.${i}"]`).css({ "background-image": `url('~/cache/${name}')` });

				if (this.queue.length) this.make();
				// else console.log("done");
			});
		};
		img.src = src;
	}
};
