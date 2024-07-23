
let Snapshot = {
	init() {
		let size = 73,
			{ cvs, ctx } = Misc.createCanvas(size, size);
		this.cvs = cvs;
		this.ctx = ctx;
		this.size = size;

		// create queue
		this.queue = [];
		// this.queue.push({ id: "1.1", path: `M291.7766952966369,-19.355339059327378L191.7766952966369,-19.355339059327378L141.7766952966369,30.644660940672622L29.64466094067263,30.644660940672644L29.644660940672622,-40.066017177982104L-20.355339059327378,-90.0660171779821L-70.35533905932738,-40.066017177982104L-41.066017177982125,-40.0660171779821L-41.06601717798212,30.64466094067265L100.3553390593274,172.06601717798213L63.21067811865477,209.21067811865476L163.21067811865476,209.21067811865476L113.21067811865477,159.21067811865476L141.7766952966369,130.64466094067262L241.7766952966369,130.64466094067262L241.7766952966369,30.644660940672622Z` });
		// this.queue.push({ id: "1.2", path: `M268.3553390593274,-21.066017177982133L218.35533905932738,-71.06601717798213L168.35533905932738,-21.066017177982125L168.35533905932738,49.64466094067262L97.64466094067262,49.64466094067263L97.64466094067262,7.644660940672665L26.933982822017853,-63.066017177982076L-43.77669529663689,7.644660940672651L-43.77669529663689,107.64466094067265L6.223304703363116,157.64466094067265L6.223304703363112,57.64466094067265L97.64466094067265,149.06601717798213L97.64466094067264,191.06601717798213L136.8553390593274,151.85533905932738L186.8553390593274,201.85533905932738L186.8553390593274,101.85533905932738L239.06601717798213,49.644660940672615L239.06601717798213,-21.066017177982133Z` });


		// let tmp = {
		// 	"1.1": Level["1.1"],
		// 	"1.2": Level["1.2"],
		// 	"1.3": Level["1.3"],
		// 	"1.4": Level["1.4"],
		// };
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
		this.make();
	},
	make() {
		let width = this.size,
			height = this.size,
			opt = this.queue.shift(),
			[w,i] = opt.id.split("."),
			name = `${opt.id}.png`,
			img = new Image(),
			svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-200 -200 600 600">
					<linearGradient id="SVG-GR-1" x1=".5" y1="0" x2=".5" y2="1">
						<stop offset="0%" stop-color="#f2f2f2" />
						<stop offset="100%" stop-color="#888" />
					</linearGradient>
					<path fill="url(#SVG-GR-1)" d="${opt.path}"></path></svg>`,
			src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

		img.onload = () => {
			// reset canvas
			this.cvs.attr({ width, height });
			this.ctx.drawImage(img, -5, -5, width + 10, height + 10);

			this.cvs[0].toBlob(async blob => {
				await window.cache.set({ name, blob });
				window.find(`.world[data-id="${w}"] li[data-id="${i}"]`).css({ "background-image": `url('~/cache/${name}')` });

				if (this.queue.length) this.make();
				else console.log("done");
			});
		};
		img.src = src;
	}
};
