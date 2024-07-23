
let Snapshot = {
	init() {
		let size = 60,
			{ cvs, ctx } = Misc.createCanvas(size, size);
		this.cvs = cvs;
		this.ctx = ctx;
		this.size = size;

		// temp call
		let path = `M291.7766952966369,-19.355339059327378L191.7766952966369,-19.355339059327378L141.7766952966369,30.644660940672622L29.64466094067263,30.644660940672644L29.644660940672622,-40.066017177982104L-20.355339059327378,-90.0660171779821L-70.35533905932738,-40.066017177982104L-41.066017177982125,-40.0660171779821L-41.06601717798212,30.64466094067265L100.3553390593274,172.06601717798213L63.21067811865477,209.21067811865476L163.21067811865476,209.21067811865476L113.21067811865477,159.21067811865476L141.7766952966369,130.64466094067262L241.7766952966369,130.64466094067262L241.7766952966369,30.644660940672622Z`;
		this.make({ id: "1.0", path });
	},
	make(opt) {
		let width = this.size,
			height = this.size,
			name = `${opt.id}.png`,
			img = new Image,
			svg = `<svg id="tmp-1" viewBox="-200 -200 600 600"><path fill="#ccc" d="${opt.path}"></path></svg>`,
			src = `data:image/svg+xml,${encodeURIComponent(svg)}`;

		// reset canvas
		this.cvs.attr({ width, height });

		img.onload = () => {
			ctx.drawImage(img, 0, 0, width, height);

			this.cvs[0].toBlob(async blob => {
				await window.cache.set({ name, blob });
				window.find(`.world li.unlocked:nth(2)`).css({ "background-image": `url('~/cache/${name}')` });
			});
		};
		img.src = src;
	}
};
