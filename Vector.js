/*jslint browser:true,esnext:true*/
/*globals Point*/
/*exported Vector*/
class Vector extends Point {
	/**
	 * Constructor
	 * @param {number} x     The X-coordinate
	 * @param {number} y     The Y-coordinate
	 * @param {number} angle The angle in radians
	 * @param {number} norm  The length of the vector
	 */
	constructor(x, y, angle, norm) {
		super(x, y);
		this._angle = angle || 0;
		this._norm = (norm === undefined) ? 1 : norm;
		this._start = null;
		this._end = null;
	}
	/**
	 * The starting Point object
	 * @type {Point}
	 */
	get start() {
		if (!this._start) {
			this._start = new Point(this.x, this.y);
		}
		return this._start;
	}
	set start(value) {
		this._x = value.x;
		this._y = value.y;
		this._angle = null;
		this._norm = null;
	}
	/**
	 * The ending Point object
	 * @type {Point}
	 */
	get end() {
		if (!this._end) {
			this._end = new Point().setPolar(this._angle, this._norm);
		}
		return this._end;
	}
	set end(value) {
		this._end = value.clone();
		this._angle = null;
		this._norm = null;
	}
	/**
	 * The angle in radians
	 * @type {number}
	 */
	get angle() {
		if (this._angle === null) {
			this._angle = Point.difference(this.start, this.end).theta;
		}
		return this._angle;
	}
	set angle(value) {
		this._angle = value.clone();
		this._end = null;
	}
	/**
	 * The length of the vector
	 * @type {number}
	 */
	get norm() {
		if (this._norm === null) {
			this._norm = Point.difference(this.start, this.end).r;
		}
		return this._norm;
	}
	set norm(value) {
		this._norm = value.clone();
		this._end = null;
	}
	/**
	 * Returns a unitary vector at the origin with a given angle
	 * @param   {number} angle The angle in radians
	 * @returns {Point}  [[Description]]
	 */
	static unit(angle) {
		return new Point(Math.cos(angle), Math.sin(angle));
	}
	static fromPoints(start, end) {
		var result = new this();
		result.start = start;
		result.end = end;
		return result;
	}
	fraction(ratio) {
		return Point.difference(this.end, this).multiply(ratio).add(this);
	}

}
