/*jslint browser:true,esnext:true*/
/*exported Polyline*/
class Polyline {
	/**
	 * Constructor
	 * @param {Array} points Array of points
	 */
	constructor(points) {
		/** @member {Array} */
		this._points = points || [];
	}
	//*** GETTERS/SETTERS ***************************************
	/**
	 * Array of points
	 * @type {Array}
	 */
	get points() {
		return this._points;
	}
	set points(pts) {
		this._points = [];
		pts.forEach(function (pt) {
			this._point.push(pt);
		});
	}
	/**
	 * Number of points in the polyline
	 * @type {number}
	 */
	get length() {
		return this._points.length;
	}
	/**
	 * Returns the string of the points
	 * @returns {string}
	 */
	toString() {
		return this._points.join(" ");
	}
	//*** PRIVATE METHODS **************************************

	//*** PUBLIC METHODS ***************************************
	/**
	 * Adds a point at the end
	 * @param   {Point} pt The Point object to append
	 * @returns {Point} The Point object just added
	 */
	append(point) {
		this.insertAt(point, -1);
		return point;
	}
	/**
	 * Adds a point at the beginning
	 * @param   {Point} point The Point object to prepend
	 * @returns {Point} The Point object just added
	 */
	prepend(point) {
		this.insertAt(point, 0);
		return point;
	}
	/**
	 * Adds a point at the a givent position
	 * @param   {number} point The Point object to added
	 * @param   {number} idx   The position of insertion
	 * @returns {Point}  The Point object just added
	 */
	insertAt(point, idx) {
		idx = (idx === undefined) ? this._points.length : idx;
		this._points.splice(idx, 0, point);
		point.polyline = this;
		return point;
	}
	/**
	 * Adds a point just before a givent point
	 * @param   {Point} point     The Point object to append
	 * @param   {Point} reference The reference Point
	 * @returns {Point} The Point object just added
	 */
	insertBefore(point, reference) {
		var idx;
		if (reference) {
			idx = this._points.indexOf(reference);
			if (idx < 0) {
				throw "Reference point doesn't belong to polyline.";
			}
		} else {
			idx = -1;
		}
		this.insertAt(point, idx);
		return point;
	}
	/**
	 * Returns the index of a point in the polyline
	 * @param   {Point}  point The point object
	 * @returns {number} The index of the object (of -1 if not found)
	 */
	indexOf(point) {
		return this._points.indexOf(point);
	}
	//*** STATIC METHODS ***************************************
}
