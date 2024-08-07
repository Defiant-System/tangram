
let DEFAULT_PRECISION = 0.000001;
let PRECISION = DEFAULT_PRECISION;


let last = (arr, i=0) => arr[arr.length - 1 - i];

function nearlyEquals(a, b, t = PRECISION) {
	if (isNaN(a) || isNaN(b)) return false;
	return Math.abs(a - b) < t;
}





function pointAboveOrOnLine(pt, left, right) {
	const d1 = (right.x - left.x) * (pt.y - left.y);
	const d2 = (right.y - left.y) * (pt.x - left.x);
	return d1 - d2 >= -PRECISION;
}

function pointBetween(p, left, right) {
	// p must be collinear with left->right
	// returns false if p == left, p == right, or left == right
	const dpyly = p.y - left.y;
	const drxlx = right.x - left.x;
	const dpxlx = p.x - left.x;
	const dryly = right.y - left.y;

	const dot = dpxlx * drxlx + dpyly * dryly;
	// if `dot` is 0, then `p` == `left` or `left` == `right` (reject)
	// if `dot` is less than 0, then `p` is to the left of `left` (reject)
	if (dot < PRECISION) return false;

	const sqlen = drxlx * drxlx + dryly * dryly;
	// if `dot` > `sqlen`, then `p` is to the right of `right` (reject)
	// therefore, if `dot - sqlen` is greater than 0, then `p` is to the right of `right` (reject)
	return dot - sqlen <= -PRECISION;
}

function pointsCompare(p1, p2) {
	// returns -1 if p1 is smaller, 1 if p2 is smaller, 0 if equal
	if (nearlyEquals(p1.x, p2.x, PRECISION)) {
		return nearlyEquals(p1.y, p2.y, PRECISION) ? 0 : (p1.y < p2.y ? -1 : 1);
	}
	return p1.x < p2.x ? -1 : 1;
}

/**
 * Categorize where intersection point is along A and B:
 *  -2: intersection point is before segment's first point
 *  -1: intersection point is directly on segment's first point
 *   0: intersection point is between segment's first and second points (exclusive)
 *   1: intersection point is directly on segment's second point
 *   2: intersection point is after segment's second point
 */
function getOffset(A, length) {
	const precision = PRECISION / length;
	if (A <= -precision) return -2;
	if (A < precision) return -1;
	if (A - 1 <= -precision) return 0;
	if (A - 1 < precision) return 1;
	return 2;
}

function linesIntersect(a0, a1, b0, b1) {
	const adx = a1.x - a0.x;
	const ady = a1.y - a0.y;
	const bdx = b1.x - b0.x;
	const bdy = b1.y - b0.y;

	const axb = adx * bdy - ady * bdx;
	if (nearlyEquals(axb, 0, PRECISION)) return false;  // lines are coincident

	const dx = a0.x - b0.x;
	const dy = a0.y - b0.y;
	const A = (bdx * dy - bdy * dx) / axb;
	const B = (adx * dy - ady * dx) / axb;
	const aLength = Math.hypot(adx, ady);
	const bLength = Math.hypot(bdx, bdy);

	const pt = new Point(a0.x + A * adx, a0.y + A * ady);
	return {alongA: getOffset(A, aLength), alongB: getOffset(B, bLength), pt};
}



// -----------------------------------------------------------------------------
// Main Algorithm

function copy(start, end, seg) {
	const myFill = {above: seg.myFill.above, below: seg.myFill.below};
	return {start, end, myFill};
}

function eventCompare(p1isStart, p11, p12, p2isStart, p21, p22) {
	const comp = pointsCompare(p11, p21);
	if (comp !== 0) return comp;  // the selected points are the same

	// If the non-selected points are the same too then the segments are equal.
	if (Point.equals(p12, p22, PRECISION)) return 0;

	// If one is a start and the other isn't favor the one that isn't the start.
	if (p1isStart !== p2isStart) return p1isStart ? 1 : -1;

	// Otherwise, we'll have to calculate which one is below the other manually. Order matters!
	return pointAboveOrOnLine(p12, p2isStart ? p21 : p22, p2isStart ? p22 : p21,) ? 1 : -1;
}

function eventAdd(eventRoot, ev, otherPt) {
	eventRoot.insertBefore(ev, (here) =>
		eventCompare(!!ev.isStart, ev.pt, otherPt, !!here.isStart, here.pt, here.other.pt) < 0);
}

function addSegmentStart(eventRoot, seg, primary) {
	const evStart = LinkedList.node({isStart: true, pt: seg.start, seg, primary});
	eventAdd(eventRoot, evStart, seg.end);
	return evStart;
}

function addSegmentEnd(eventRoot, evStart, seg, primary) {
	const evEnd = LinkedList.node({pt: seg.end, seg, primary, other: evStart});
	evStart.other = evEnd;
	eventAdd(eventRoot, evEnd, evStart.pt);
}

function addSegment(eventRoot, seg, primary) {
	const evStart = addSegmentStart(eventRoot, seg, primary);
	addSegmentEnd(eventRoot, evStart, seg, primary);
	return evStart;
}

function eventUpdateEnd(eventRoot, ev, end) {
	// Slides an end backwards
	ev.other.remove();
	ev.seg.end = end;
	ev.other.pt = end;
	eventAdd(eventRoot, ev.other, ev.pt);
}

function eventDivide(eventRoot, ev, pt) {
	const ns = copy(pt, ev.seg.end, ev.seg);
	eventUpdateEnd(eventRoot, ev, pt);
	return addSegment(eventRoot, ns, !!ev.primary);
}

function statusCompare(ev1, ev2) {
	const a1 = ev1.seg.start;
	const a2 = ev1.seg.end;
	const b1 = ev2.seg.start;
	const b2 = ev2.seg.end;

	if (!Point.colinear(a1, b1, b2, PRECISION)) return pointAboveOrOnLine(a1, b1, b2) ? 1 : -1;
	if (!Point.colinear(a2, b1, b2, PRECISION)) return pointAboveOrOnLine(a2, b1, b2) ? 1 : -1;
	return 1;
}

/** Returns the segment equal to ev1, or false if nothing equal. */
function checkIntersection(eventRoot, ev1, ev2) {
	const seg1 = ev1.seg;
	const seg2 = ev2.seg;
	const a1 = seg1.start;
	const a2 = seg1.end;
	const b1 = seg2.start;
	const b2 = seg2.end;

	const i = linesIntersect(a1, a2, b1, b2);

	if (i === false) {
		// Segments are parallel or coincident. If points aren't collinear, then
		// the segments are parallel, so no intersections. Otherwise, segments are
		// on top of each other somehow (aka coincident)
		if (!Point.colinear(a1, a2, b1, PRECISION)) return false;
		if (Point.equals(a1, b2, PRECISION) || Point.equals(a2, b1, PRECISION)) return false;

		const a1isb1 = Point.equals(a1, b1, PRECISION);
		const a2isb2 = Point.equals(a2, b2, PRECISION);

		if (a1isb1 && a2isb2) return ev2;  // Segments are exactly equal

		const a1Between = !a1isb1 && pointBetween(a1, b1, b2);
		const a2Between = !a2isb2 && pointBetween(a2, b1, b2);

		if (a1isb1) {
			a2Between ? eventDivide(eventRoot, ev2, a2) : eventDivide(eventRoot, ev1, b2);
			return ev2;
		} else if (a1Between) {
			if (!a2isb2) {
				a2Between ? eventDivide(eventRoot, ev2, a2) : eventDivide(eventRoot, ev1, b2);
			}
			eventDivide(eventRoot, ev2, a1);
		}

	} else {
		// Otherwise, lines intersect at i.pt, which may or may not be between the endpoints

		// Is A divided between its endpoints? (exclusive)
		if (i.alongA === 0) {
			if (i.alongB === -1) { // yes, at exactly b1
				eventDivide(eventRoot, ev1, b1);
			} else if (i.alongB === 0) { // yes, somewhere between B's endpoints
				eventDivide(eventRoot, ev1, i.pt);
			} else if (i.alongB === 1) { // yes, at exactly b2
				eventDivide(eventRoot, ev1, b2);
			}
		}

		// Is B divided between its endpoints? (exclusive)
		if (i.alongB === 0) {
			if (i.alongA === -1) { // yes, at exactly a1
				eventDivide(eventRoot, ev2, a1);
			} else if (i.alongA === 0) { // yes, somewhere between A's endpoints (exclusive)
				eventDivide(eventRoot, ev2, i.pt);
			} else if (i.alongA === 1) { // yes, at exactly a2
				eventDivide(eventRoot, ev2, a2);
			}
		}
	}
	return false;
}

function calculate(eventRoot, selfIntersection) {
	const statusRoot = new LinkedList();

	const segments = [];
	while (eventRoot.head) {
		const ev = eventRoot.head;

		if (ev.isStart) {
			const surrounding = statusRoot.findTransition((here) => statusCompare(ev, here.ev) > 0);
			const above = surrounding.before?.ev;
			const below = surrounding.after?.ev;

			// eslint-disable-next-line no-inner-declarations
			function checkBothIntersections() {
				if (above) {
					const eve = checkIntersection(eventRoot, ev, above);
					if (eve) return eve;
				}
				if (below) return checkIntersection(eventRoot, ev, below);
				return false;
			}

			const eve = checkBothIntersections();
			if (eve) {
				// ev and eve are equal: we'll keep eve and throw away ev

				if (selfIntersection) {
					// If we are a toggling edge, we merge two segments that belong to the
					// same polygon. Think of this as sandwiching two segments together,
					// where `eve.seg` is the bottom. This will cause the above fill flag to toggle
					const toggle = !ev.seg.myFill.below ? true : ev.seg.myFill.above !== ev.seg.myFill.below;
					if (toggle) eve.seg.myFill.above = !eve.seg.myFill.above;
				} else {
					// Merge two segments that belong to different polygons. Each segment
					// has distinct knowledge, so no special logic is needed note that
					// this can only happen once per segment in this phase, because we are
					// guaranteed that all self-intersections are gone.
					eve.seg.otherFill = ev.seg.myFill;
				}

				ev.other.remove();
				ev.remove();
			}

			// something was inserted before us in the event queue, so loop back around and
			// process it before continuing
			if (eventRoot.head !== ev) continue;

			// Calculate fill flags

			if (selfIntersection) {
				// We toggle an edge if if we are a new segment, or we are a segment
				// that has previous knowledge from a division
				const toggle = (!ev.seg.myFill.below) ? true : ev.seg.myFill.above !== ev.seg.myFill.below;

				// Calculate whether we are filled below us. If nothing is below us, we
				// are not filled below. Otherwise, the answer is the same if whatever
				// is below us is filled above it.
				ev.seg.myFill.below = !below ? false : below.seg.myFill.above;

				// since now we know if we're filled below us, we can calculate whether
				// we're filled above us by applying toggle to whatever is below us
				ev.seg.myFill.above = toggle ? !ev.seg.myFill.below : ev.seg.myFill.below;

			} else if (ev.seg.otherFill === undefined) {
				// If we don't have other information, we need to figure out if we're
				// inside the other polygon. If nothing is below us, then we're
				// outside. Otherwise copy the below segment's other polygon's above.
				const inside = !below ? false : (ev.primary === below.primary) ? below.seg.otherFill.above : below.seg.myFill.above;
				ev.seg.otherFill = {above: inside, below: inside};
			}

			// Insert the status and remember it for later removal
			ev.other.status = surrounding.insert(LinkedList.node({ev}));

		} else {
			const st = ev.status;
			if (st === undefined) throw new Error('Zero-length segment detected!');

			// Removing the status will create two new adjacent edges, so we'll need
			// to check for those.
			if (statusRoot.exists(st.prev) && statusRoot.exists(st.next)) {
				checkIntersection(eventRoot, st.prev.ev, st.next.ev);
			}

			st.remove();

			// Now we've calculated everything, so save the segment for reporting.
			if (!ev.primary) {
				const s = ev.seg.myFill;  // Make sure `seg.myFill` points to the primary polygon.
				ev.seg.myFill = ev.seg.otherFill;
				ev.seg.otherFill = s;
			}
			segments.push(ev.seg);
		}

		eventRoot.head.remove();
	}

	return segments;
}


// -----------------------------------------------------------------------------
// Segment Chainer

function segmentChainer(segments) {
	const chains = [];
	const regions = [];

	segments.forEach((seg) => {
		const pt1 = seg.start;
		const pt2 = seg.end;
		if (Point.equals(pt1, pt2, PRECISION)) return;  // Zero-length segment: maybe PRECISION is too small or too large!

		// Search for two chains that this segment matches.
		const firstMatch = {index: 0, matchesHead: false, matchesPt1: false};
		const secondMatch = {index: 0, matchesHead: false, matchesPt1: false};

		// TODO Better types without any
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let nextMatch = firstMatch;

		function setMatch(index, matchesHead, matchesPt1) {
			nextMatch.index = index;
			nextMatch.matchesHead = matchesHead;
			nextMatch.matchesPt1 = matchesPt1;
			const match = nextMatch === firstMatch;
			nextMatch = match ? secondMatch : undefined;
			return !match;
		}

		for (let i = 0; i < chains.length; i++) {
			const chain = chains[i];
			const head = chain[0];
			const tail = last(chain);
			if (Point.equals(head, pt1, PRECISION)) {
				if (setMatch(i, true, true)) break;
			} else if (Point.equals(head, pt2, PRECISION)) {
				if (setMatch(i, true, false)) break;
			} else if (Point.equals(tail, pt1, PRECISION)) {
				if (setMatch(i, false, true)) break;
			} else if (Point.equals(tail, pt2, PRECISION)) {
				if (setMatch(i, false, false)) break;
			}
		}

		if (nextMatch === firstMatch) {
			// We didn't match anything, so create a new chain.
			chains.push([pt1, pt2]);
			return;
		}

		if (nextMatch === secondMatch) {
			// We matched a single chain. Add the other point to the appropriate end,
			// and check to see if we've closed the chain into a loop.

			const index = firstMatch.index;
			const pt = firstMatch.matchesPt1 ? pt2 : pt1;
			const addToHead = firstMatch.matchesHead;

			const chain = chains[index];
			let grow = addToHead ? chain[0] : chain[chain.length - 1];
			const grow2 = addToHead ? chain[1] : chain[chain.length - 2];
			const oppo = addToHead ? chain[chain.length - 1] : chain[0];
			const oppo2 = addToHead ? chain[chain.length - 2] : chain[1];

			if (Point.colinear(grow2, grow, pt, PRECISION)) {
				// Grow isn't needed because it's directly between grow2 and pt.
				addToHead ? chain.shift() : chain.pop();
				grow = grow2; // Old grow is gone... new grow is what grow2 was.
			}

			if (Point.equals(oppo, pt, PRECISION)) {
				// We're closing the loop, so remove chain from chains.
				chains.splice(index, 1);

				if (Point.colinear(oppo2, oppo, grow, PRECISION)) {
					// Oppo isn't needed because it's directly between oppo2 and grow.
					addToHead ? chain.pop() : chain.shift();
				}

				regions.push(chain);
				return;
			}

			// Not closing a loop, so just add it to the appropriate side.
			addToHead ? chain.unshift(pt) : chain.push(pt);
			return;
		}

		// Otherwise, we matched two chains, so we need to combine those chains together.

		function reverseChain(index) {
			chains[index].reverse();
		}

		function appendChain(index1, index2) {
			// index1 gets index2 appended to it, and index2 is removed
			const chain1 = chains[index1];
			const chain2 = chains[index2];
			let tail = chain1[chain1.length - 1];
			const tail2 = chain1[chain1.length - 2];
			const head = chain2[0];
			const head2 = chain2[1];

			if (Point.colinear(tail2, tail, head, PRECISION)) {
				// Tail isn't needed because it's directly between tail2 and head
				chain1.pop();
				tail = tail2; // old tail is gone... new tail is what tail2 was
			}

			if (Point.colinear(tail, head, head2, PRECISION)) {
				// Head isn't needed because it's directly between tail and head2
				chain2.shift();
			}

			chains[index1] = chain1.concat(chain2);
			chains.splice(index2, 1);
		}

		const F = firstMatch.index;
		const S = secondMatch.index;

		const reverseF = chains[F].length < chains[S].length;  // Reverse the shorter chain
		if (firstMatch.matchesHead) {
			if (secondMatch.matchesHead) {
				if (reverseF) {
					reverseChain(F);
					appendChain(F, S);
				} else {
					reverseChain(S);
					appendChain(S, F);
				}
			} else {
				appendChain(S, F);
			}
		} else {
			if (secondMatch.matchesHead) {
				appendChain(F, S);
			} else {
				if (reverseF) {
					reverseChain(F);
					appendChain(S, F);
				} else {
					reverseChain(S);
					appendChain(F, S);
				}
			}
		}
	});

	return regions;
}


// -----------------------------------------------------------------------------
// Workflow

function select(segments, selection) {
	let result = [];
	for (let seg of segments) {
		let index = (seg.myFill.above ? 8 : 0) +
									(seg.myFill.below ? 4 : 0) +
									((seg.otherFill && seg.otherFill.above) ? 2 : 0) +
									((seg.otherFill && seg.otherFill.below) ? 1 : 0);
		if (selection[index] !== 0) {
			result.push({
				start: seg.start,
				end: seg.end,
				myFill: {above: selection[index] === 1, below: selection[index] === 2}
			});
		}
	}
	return result;
}

function segments(poly) {
	let root = new LinkedList();
	for (let region of poly) {
		for (let i = 0; i < region.length; i++) {
			let pt1 = i ? region[i - 1] : last(region);
			let pt2 = region[i];

			let forward = pointsCompare(pt1, pt2);
			if (forward === 0) continue; // skip zero-length segments

			let start = forward < 0 ? pt1 : pt2;
			let end = forward < 0 ? pt2 : pt1;
			addSegment(root, {start, end, myFill: {}}, true);
		}
	}
	try {
		return calculate(root, true);
	} catch (e) {
		return [];
	}
}

function operate(poly1, poly2, selection, precision) {
	if (precision !== undefined) PRECISION = precision;
	let root = new LinkedList();
	for (let s of segments(poly1)) addSegment(root, copy(s.start, s.end, s), true);
	for (let s of segments(poly2)) addSegment(root, copy(s.start, s.end, s), false);

	try {
		let results = segmentChainer(select(calculate(root, false), selection));
		PRECISION = DEFAULT_PRECISION;
		return results.filter(polygon => polygon.length > 2);
	} catch (e) {
		return [];
	}
}


let UNION = [0, 2, 1, 0, 2, 2, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0];
let INTERSECT = [0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 1, 1, 0, 2, 1, 0];
let DIFFERENCE = [0, 0, 0, 0, 2, 0, 2, 0, 1, 1, 0, 0, 0, 1, 2, 0];
let XOR = [0, 2, 1, 0, 2, 0, 0, 1, 1, 0, 0, 2, 0, 1, 2, 0];

let union = (p1, p2, precision) => operate(p1, p2, UNION, precision);
let intersect = (p1, p2, precision) => operate(p1, p2, INTERSECT, precision);
let difference = (p1, p2, precision) => operate(p1, p2, DIFFERENCE, precision);
let xor = (p1, p2, precision) => operate(p1, p2, XOR, precision);
