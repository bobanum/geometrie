/*jslint browser:true,esnext:true*/
/*globals Point*/
class Vector extends Point {
	constructor(x, y, angle, norm) {
		super(x, y);
		this._angle = angle || 0;
		this._norm = (norm === undefined) ? 1 : norm;
		this._start = null;
		this._end = null;
	}
	/**
	 * Getter for the start property.
	 * @returns {number} - The actual start value
	 */
	get start() {
		if (!this._start) {
			this._start = new Point(this.x, this.y);
		}
		return this._start;
	}

	/**
	 * Setter for the start property.
	 * @param {number} val - The new start value
	 */
	set start(value) {
		this._x = value.x;
		this._y = value.y;
		this._angle = null;
		this._norm = null;
	}
	/**
	 * Getter for the end property.
	 * @returns {number} - The actual end value
	 */
	get end() {
		if (!this._end) {
			this._end = Vector.unit(this._angle).multiply(this._norm);
		}
		return this._end;
	}

	/**
	 * Setter for the end property.
	 * @param {number} val - The new end value
	 */
	set end(value) {
		this._end = value.clone();
		this._angle = null;
		this._norm = null;
	}
	/**
	 * Getter for the angle property.
	 * @returns {number} - The actual angle value
	 */
	get angle() {
		if (this._angle === null) {
			this._angle = this.start.difference(this.end).theta;
		}
		return this._angle;
	}

	/**
	 * Setter for the angle property.
	 * @param {number} val - The new angle value
	 */
	set angle(value) {
		this._angle = value.clone();
		this._end = null;
	}
	/**
	 * Getter for the norm property.
	 * @returns {number} - The actual norm value
	 */
	get norm() {
		if (this._norm === null) {
			this._norm = this.start.difference(this.end).r;
		}
		return this._norm;
	}

	/**
	 * setter for the norm property.
	 * @param {number} val - The new norm value
	 */
	set norm(value) {
		this._norm = value.clone();
		this._end = null;
	}
	static unit(angle) {
		return new Point(Math.cos(angle), Math.sin(angle));
	}

}
