/*jslint browser:true,esnext:true*/
class Point {
	/**
	 * Constructor
	 * @param {number} x X-coordinate
	 * @param {number} y Y-coordinate
	 */
	constructor(x, y) {
		this._x = x || 0;
		this._y = y || 0;
		this._r = null;
		this._theta = null;
	}
	/**
	 * The X-coordinate
	 * @type {number}
	 */
	get x() {
		if (this._x === null) {
			this._x = this._r * Math.cos(this._theta);
		}
		return this._x;
	}
	set x(val) {
		this._x = val;
		this._r = this._theta = null;
	}
	/**
	 * The Y-coordinate
	 * @type {number}
	 */
	get y() {
		if (this._y === null) {
			this._y = this._r * Math.sin(this._theta);
		}
		return this._y;
	}
	set y(val) {
		this._y = val;
		this._r = this._theta = null;
	}
	/**
	 * The polar radius
	 * @type {number}
	 */
	get r() {
		if (this._r === null) {
			this._r = Math.atan2(this._y, this._x);
		}
		return this._r;
	}
	set r(val) {
		this._r = val;
		this._x = this._y = null;
	}
	/**
	 * The polar angle (radian)
	 * @type {number}
	 */
	get theta() {
		if (this._r === null) {
			this._r = Math.atan2(this._y, this._x);
		}
		return this._theta;
	}
	set theta(val) {
		this._theta = val;
		this._x = this._y = null;
	}
	/**
	 * Returns the coordinates formatted "x,y"
	 * @returns {string} Formatted coordinates
	 */
	toString() {
		return this.x + "," + this.y;
	}
	/**
	 * Applyes a function to several elements
	 * ... many values as parameters
	 * ... an array of values
	 * ... a Point object (normal behavior)
	 * ... a scalar value. Applies the value to each coordinate.
	 * @private
	 * @param   {function} fct - The function to apply to each coordinates
	 * @param   {object}   pt  - Object Arguments, Array, Point or scalar value
	 * @returns {Points}   - this
	 */
	_recurse(fct, pt) {
		if (arguments.length > 2) {
			this._recurse(fct, [].slice.call(arguments, 1));
		} else if (pt instanceof Array) {
			pt.forEach(function (p) {
				this._recurse(fct, p);
			}, this);
		} else if (pt.length !== undefined) {
			this._recurse(fct, [].slice.call(pt, 0));
		} else if (pt instanceof Point) {
			this.setCartesian(fct(this.x, pt.x), fct(this.y, pt.y));
		} else {
			this.setCartesian(fct(this.x, pt), fct(this.y, pt));
		}
		return this;
	}
	/**
	 * Sets the x and y at the same time (resets polar)
	 * @param   {number} x The X-coordinate
	 * @param   {number} y The Y-coordinate
	 * @returns {Point}  this
	 */
	setCartesian(x, y) {
		this._x = x;
		this._y = y;
		this._r = this._theta = null;
		return this;
	}
	/**
	 * Sets the r and theta at the same time (resets cartesian)
	 * @param   {number} radius The r-coordinate
	 * @param   {number} theta  The polar angle
	 * @returns {Point}  this
	 */
	setPolar(radius, theta) {
		this._r = radius;
		this._theta = theta;
		this._x = this._y = null;
		return this;
	}
	/**
	 * Add one or many points to object
	 * @param {variable} - See method _recurse
	 * @returns {Point}    - this
	 */
	add() {
		return this._recurse((a, b) => (a + b), arguments);
	}
	/**
	 * Returns a copy of the point added with given points
	 * @param {variable} - See method _recurse
	 * @returns {Point}   - this
	 */
	sum() {
		return this.clone().ajouter(arguments);
	}
	/**
	 * Returns a new Point object with sum of the given points
	 * @param {variable} - See method _recurse
	 * @returns {Point}   - this
	 */
	static sum() {
		return new Point().ajouter(arguments);
	}
	/**
	 * Subtracts given points
	 * @param {variable} - See method _recurse
	 * @returns {Point}   - this
	 */
	subtract() {
		return this._recurse((a, b) => (a - b), arguments);
	}
	/**
	 * Returns a copy with subtracted given points
	 * @param {variable} - See method _recurse
	 * @returns {Point}   - this
	 */
	difference() {
		return this.clone().subtract(arguments);
	}
	/**
	 * Returns a new Point object with the difference of the given points
	 * @param {variable} - See method _recurse
	 * @returns {Point}   - this
	 */
	static difference() {
		return new Point().subtract(arguments);
	}
	/**
	 * Multiplies the given points
	 * @param {variable} - See method _recurse
	 * @returns {Point}   - this
	 */
	multiply() {
		return this._recurse((a, b) => (a * b), arguments);
	}
	/**
	 * Returns of the point multiplied with given points
	 * @param {variable} - See method _recurse
	 * @returns {Point}   - this
	 */
	product() {
		return this.clone().multiply(arguments);
	}
	/**
	 * Returns a new Point object with the product of the given points
	 * @param {variable} - See method _recurse
	 * @returns {Point}   - this
	 */
	static product() {
		return new Point().multiply(arguments);
	}
	/**
	 * Divide by the given points
	 * @param {variable} - See method _recurse
	 * @returns {Point}   - this
	 */
	divideBy() {
		return this._recurse((a, b) => ((!b) ? 0 : a / b), arguments);
	}
	/**
	 * Returns of the point divides by the given points
	 * @param {variable} - See method _recurse
	 * @returns {Point}   - this
	 */
	quotient() {
		return this.clone().divideBy(arguments);
	}
	/**
	 * Returns a new Point object with the quotient of the given points
	 * @param {variable} - See method _recurse
	 * @returns {Point}   - this
	 */
	static quotient() {
		return new Point().divideBy(arguments);
	}
	/**
	 * Inverts the signe of the coordinates
	 * @returns {Point} -this
	 */
	negate() {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	}
	/**
	 * Returns a negated copy
	 * @returns {Point} - The negates point
	 */
	negation() {
		return this.clone().opposer();
	}
	/**
	 * Returns le point opposé au point donné en paramètre
	 * @param   {Point} pt - Le point à opposer
	 * @returns {Point} - Le point résultant
	 */
	static oppose(pt) {
		return pt.oppose();
	}
	/**
	 * Modifie le point pour inverser (1/x) les dimensions
	 * @returns {Point} - this
	 */
	inverser() {
		this.x = 1 / this.x;
		this.y = 1 / this.y;
		return this;
	}
	/**
	 * Returns l'inverse du point actuel
	 * @returns {Point} - Le point résultant
	 */
	inverseZZZ() {
		return this.clone().inverser();
	}
	/**
	 * Returns un point inverse d'un point donné en paramètre
	 * @param   {Point} pt - Le point à inverser
	 * @returns {Point} - Le point résultant
	 */
	static inverseZZZ(pt) {
		return pt.inverse();
	}
	fractionZZZ(pt, ratio) {
		return this.oppose().ajouter(pt).multiply(ratio).ajouter(this);
	}
	/**
	 * Rotates the point around the origin
	 * @param   {number} angle - Radian angle
	 * @returns {Point}   - this
	 */
	rotate(angle) {
		angle *= Math.PI/180;
		return new Point(
			this.x * Math.cos(angle) - this.y * Math.sin(angle),
			this.x * Math.sin(angle) + this.y * Math.cos(angle)
		);
	}
	/**
	 * Moves the point to a given location
	 * @param   {object} x - A point or the x coordinate
	 * @param   {number} y - The y coordinate
	 * @returns {Point}   - this
	 */
	moveTo(x, y) {
		if (arguments.length === 1) {
			this.moveTo(x.x, x.y);
		} else {
			this.x = x;
			this.y = y;
		}
		return this;
	}
	/**
	 * Moves the point by a given increment
	 * @param   {object} x - A point or the x coordinate
	 * @param   {number} y - The y coordinate
	 * @returns {Point}   - this
	 */
	moveBy(x, y) {
		if (arguments.length === 1) {
			this.moveBy(x.x, x.y);
		} else {
			this.x += x;
			this.y += y;
		}
		return this;
	}
	/**
	 * Returns a clone of the object
	 * @returns {Point} - The clone
	 */
	clone() {
		return new Point(this.x, this.y);
	}
}
