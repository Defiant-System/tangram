
let Anim = {
	init(canvas) {
		// setTimeout(() => { this.paused = true }, 300);
	},
	dispatch(event) {
		let Self = Anim,
			value;
		switch (event.type) {
			case "start":
				Self.cvs = event.canvas;
				Self.ctx = Self.cvs.getContext("2d");
				Self.width = Self.cvs.width;
				Self.height = Self.cvs.height;
				Self.dispatch({ type: "create-scene" });
				Self.paused = false;
				Self.draw();
				break;
			case "pause":
				Self.paused = true;
				break;
			case "resume":
				if (Self.paused && Self.ctx) {
					Self.paused = false;
					Self.draw();
				}
				break;
			case "create-scene":
				Self.tick = 0;
				Self.size = 40;
				Self.lines = [];

				Self.cvs.width = Self.cvs.width;
				Self.cvs.height = Self.cvs.height;

				let len = Self.size;
				// while (len--) {
				// 	Self.lines.push(new Line);
				// }
				break;
		}
	},
	update(Self) {
		let i = Self.lines.length;
		while (i--) {
			Self.lines[i].step(i);
		}

		if (Self.tick % 10 === 0) {		
			Self.lines.push(new Line);
		}

		Self.tick++;
	},
	draw() {
		let Self = Anim,
			cvs = Self.cvs,
			ctx = Self.ctx,
			hW = Self.width / 2,
			hH = Self.height / 2,
			i = Self.lines.length;
		// clear react
		ctx.globalCompositeOperation = "destination-out";
		ctx.fillStyle = "hsla(0, 0%, 0%, 0.15)";
		ctx.fillRect(0, 0, Self.width, Self.height);
		ctx.globalCompositeOperation = "screen";

		ctx.save();
		ctx.translate(hW, hH);
		ctx.rotate(Self.tick * 0.0001);
		var scale = 0.8 + Math.cos(Self.tick * 0.005 ) * 0.1;
		ctx.scale(scale, scale);
		ctx.translate(-hW, -hH);
		
		while (i--) {
			Self.lines[i].draw(ctx);	
		}
		ctx.restore();

		// next tick
		if (!Self.paused) {
			Self.update(Self);
			requestAnimationFrame(Self.draw);
		}
	}
};

// auto call init
Anim.init();

// forward message / event
self.onmessage = event => Anim.dispatch(event.data);



// simple utils
let Utils = {
	// get a random number within a range
	rand(min, max) {
		return Math.random() * ( max - min ) + min;
	},
	randInt(min, max) {
		return Math.floor( min + Math.random() * ( max - min + 1 ) );
	},
	// calculate the distance between two points
	calculateDistance(p1x, p1y, p2x, p2y) {
		let xDistance = p1x - p2x,
			yDistance = p1y - p2y;
		return Math.sqrt((xDistance ** 2) + (yDistance ** 2));
	}
};

// line class
class Line {
	constructor() {
		this.path = [];
		this.speed = Utils.rand(10, 20);
		this.count = Utils.randInt(10, 30);
		this.size = Anim.size;
		this.lines = Anim.lines;
		this.x = Anim.width / 2, + 1;
		this.y = Anim.height / 2 + 1;
		this.target = {
			x: Anim.width / 2,
			y: Anim.height / 2,
		};
		this.dist = 0;
		this.angle = 0;
		this.hue = Anim.tick / 5;
		this.life = 1;
		this.updateAngle();
		this.updateDist();
	}

	updateDist() {
		var dx = this.target.x - this.x,
			dy = this.target.y - this.y;
		this.dist = Math.sqrt(dx * dx + dy * dy);
	}

	updateAngle() {
		var dx = this.target.x - this.x,
			dy = this.target.y - this.y;
		this.angle = Math.atan2(dy, dx);
	}

	changeTarget() {
		var randStart = Utils.randInt(0, 3);
		switch (randStart) {
			case 0: this.target.y = this.y - this.size; break; // up
			case 1: this.target.x = this.x + this.size; break; // right
			case 2: this.target.y = this.y + this.size; break; // down
			case 3: this.target.x = this.x - this.size; break; // left
		}
		this.updateAngle();
	}

	step(i) {
		this.x += Math.cos(this.angle) * this.speed;
		this.y += Math.sin(this.angle) * this.speed;
		this.updateDist();
		
		if (this.dist < this.speed) {
			this.x = this.target.x;
			this.y = this.target.y;
			this.changeTarget();
		}
			
		this.path.push({ x: this.x, y: this.y });
		if (this.path.length > this.count) {
			this.path.shift();
		}
		
		this.life -= 0.001;
		
		if (this.life <= 0) {
			this.path = null;
			this.lines.splice(i, 1);
		}
	}

	draw(ctx) {
		ctx.beginPath();
		var rando = Utils.rand(0, 10);
		for (let j=0, length=this.path.length; j<length; j++) {
			ctx[(j === 0) ? "moveTo" : "lineTo"](this.path[j].x + Utils.rand(-rando, rando), this.path[j].y + Utils.rand(-rando, rando));
		}
		ctx.strokeStyle = `hsla(200, 80%, 70%, ${this.life/5})`;
		// ctx.strokeStyle = `hsla(${Utils.rand(this.hue, this.hue + 30)}, 80%, 55%, ${this.life/3})`;
		ctx.lineWidth = Utils.rand( 0.1, 2 );
		ctx.stroke();
	}
}

