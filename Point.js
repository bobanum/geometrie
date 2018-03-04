/*jslint browser:true,esnext:true*/
class Point {
	/**
	 * Constructor
	 * @param {number} x X-coordinate
	 * @param {number} y Y-coordinate
	 * @param {number} z Z-coordinate
	 */
	constructor(x, y, z) {
		if (arguments.length < 2 || arguments.length > 3) {
			this.dimensions = this.constructor.dimensions;
		} else {
			this.dimensions = arguments.length;
		}
		this._x = x || 0;
		this._y = y || 0;
		this._z = z || 0;
		this._r = null;	// Radius
		this._theta = null; // Azimuth. Angle on the xy plane
		this._phi = null;	// Inclination
	}
	/**
	 * The X-coordinate
	 * @type {number}
	 */
	get x() {
		if (this._x === null) {
			this._x = this._r * Math.cos(this._theta) * Math.sin(this._phi) ;
		}
		return this._x;
	}
	set x(val) {
		this._x = val;
		this._clearPolar();
	}
	/**
	 * The Y-coordinate
	 * @type {number}
	 */
	get y() {
		if (this._y === null) {
			this._y = this._r * Math.sin(this._theta) * Math.sin(this._phi);
		}
		return this._y;
	}
	set y(val) {
		this._y = val;
		this._clearPolar();
	}
	/**
	 * The Z-coordinate
	 * @type {number}
	 */
	get z() {
		if (this._z === null) {
			this._z = this._r * Math.cos(this._phi);
		}
		return this._z;
	}
	set z(val) {
		this._z = val;
		this._clearPolar();
	}
	/**
	 * The polar radius
	 * @type {number}
	 */
	get r() {
		if (this._r === null) {
			this._r = Math.sqrt(this._x * this._x, this._y * this._y, this._z * this._z);
		}
		return this._r;
	}
	set r(val) {
		this._r = val;
		this._clearCartesian();
	}
	/**
	 * The polar angle (radian)
	 * @type {number}
	 */
	get theta() {
		if (this._theta === null) {
			this._theta = Math.atan2(this._y, this._x);
		}
		return this._theta;
	}
	/**
	 * The polar angle (radian)
	 * @type {number}
	 */
	get phi() {
		if (this._phi === null) {
			if (this._z === 0) { // To avoid division by 0
				this._phi = 0;
			} else {
				this._phi = Math.acos(this._z / this.r);
			}
		}
		return this._phi;
	}
	set phi(val) {
		this._phi = val;
		this._clearCartesian();
	}
	/**
	 * Clears polar coordinates (after setting a cartesian coordinate)
	 * @private
	 * @returns {Point} this
	 */
	_clearPolar() {
		this._r = this._theta = this._phi = null;
		return this;
	}
	/**
	 * Clears cartesian coordinates (after setting a polar coordinate)
	 * @private
	 * @returns {Point} this
	 */
	_clearCartesian() {
		this._x = this._y = this._z = null;
		return this;
	}
	/**
	 * Returns the coordinates formatted "x,y,z"
	 * @param   {number} [dim=this.dimensions] - Number of dimensions to consider (2 or 3)
	 * @returns {string} Formatted coordinates
	 */
	toString(dim) {
		var result = this.toArray(dim);
		return result.join(",");
	}
	/**
	 * Returns an array of the coordinates [x,y,z]
	 * @param   {number} [dim=this.dimensions] - Number of dimensions to consider (2 or 3)
	 * @returns {Array}  - Resulting coordinates
	 */
	toArray(dim) {
		dim = dim || this.dimensions;
		var result = [this.x , this.y];
		if (dim > 2) {
			result.push(this.z);
		}
		return result;
	}
	/**
	 * Returns a generic object with the coordinates {x:x,y:y,z:z}
	 * @param   {number} [dim=this.dimensions] - Number of dimensions to consider (2 or 3)
	 * @returns {Object} - Resulting coordinates
	 */
	toObject(dim) {
		dim = dim || this.dimensions;
		var result = {x: this.x , y: this.y};
		if (dim > 2) {
			result.z = this.z;
		}
		return result;
	}
	/**
	 * Applies a function to several elements
	 * ... many values as parameters
	 * ... an array of values
	 * ... a Point object (normal behavior)
	 * ... a scalar value. Applies the value to each coordinate.
	 * @private
	 * @param   {function} fct - The function to apply to each coordinates
	 * @param   {object}   pt  - Object Arguments, Array, Point or scalar value
	 * @returns {Point}   - this
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
			this.setCartesian(fct(this.x, pt.x), fct(this.y, pt.y), fct(this.z, pt.z));
		} else {
			this.setCartesian(fct(this.x, pt), fct(this.y, pt), fct(this.z, pt));
		}
		return this;
	}
	/**
	 * Sets the x, y and z at the same time (resets polar)
	 * @param   {number} x The X-coordinate
	 * @param   {number} y The Y-coordinate
	 * @returns {Point}  this
	 */
	setCartesian(x, y, z = 0) {
		this._x = x;
		this._y = y;
		this._z = z;
		this._clearPolar();
		return this;
	}
	/**
	 * Sets the r and theta at the same time (resets cartesian)
	 * @param   {number} radius The r-coordinate
	 * @param   {number} theta  The polar angle
	 * @returns {Point}  this
	 */
	setPolar(radius, theta, phi = 0) {
		this._r = radius;
		this._theta = theta;
		this._phi = phi;
		this._clearCartesian();
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
	 * Returns a new Point object with sum of the given points
	 * @param {variable} - See method _recurse
	 * @returns {Point}   - this
	 */
	static sum(pt) {
		return pt.clone().add(Array.from(arguments).slice(1));
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
	 * Returns a new Point object with the difference of the given points
	 * @param {variable} - See method _recurse
	 * @returns {Point}   - this
	 */
	static difference(pt) {
		return pt.clone().subtract(Array.from(arguments).slice(1));
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
	 * Returns a new Point object with the product of the given points
	 * @param {variable} - See method _recurse
	 * @returns {Point}   - this
	 */
	static product(pt) {
		return pt.clone().multiply(Array.from(arguments).slice(1));
	}
	/**
	 * Divide by the given points
	 * @param {variable} - {@see _recurse}
	 * @returns {Point}   - this
	 */
	divideBy() {
		return this._recurse((a, b) => ((!b) ? 0 : a / b), arguments);
	}
	/**
	 * Returns a new Point object with the quotient of the given points
	 * @param {variable} - See method _recurse
	 * @returns {Point}   - new Point object
	 */
	static quotient(pt) {
		return pt.clone().divideBy(Array.from(arguments).slice(1));
	}
	/**
	 * Inverts the signe of the coordinates
	 * @returns {Point} - this
	 */
	negate() {
		return this._recurse((a) => (-a), arguments);
	}
	/**
	 * Returns new Point with opposite signes
	 * @param   {Point} pt - Point to negate
	 * @returns {Point}   - new Point object
	 */
	static negation(pt) {
		return pt.clone().negate();
	}
	/**
	 * Returns new Point between this ans given Point at givent ration
	 * @param   {Point}  pt    - Destination point
	 * @param   {number} ratio - Potion of vector to place new point
	 * @returns {Point}  new mid-Point
	 */
	fraction(pt, ratio) {
		return Point.negation(this).add(pt).multiply(ratio).add(this);
	}
	/**
	 * Rotates the point around the origin
	 * @param   {number} angle - Radian angle
	 * @returns {Point}   - this
	 */
	rotate(angle) {
		angle *= Math.PI / 180;
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
		return Point.fromArray(this.toArray()); // To keep the dimension property
	}
	/**
	 * Returns a new Point from given string.
	 * @param   {string} val String to parse. Must be of format : "x, y, z"
	 * @returns {Point}  A new Point Object
	 */
	static fromString(val) {
		val = val.split(/\s*,\s*/);
		return this.fromArray(val);
	}
	/**
	 * Returns a new Point from given Array.
	 * @param   {number[]} val Array of coordinates [x, y, z]
	 * @returns {Point}    Resulting new Point object
	 */
	static fromArray(val) {
		var resultat;
		if (val.length >= 3) {
			resultat = new this(val[0], val[1], val[2]);
		} else {
			resultat = new this(val[0], val[1]);
		}
		return resultat;
	}
	/**
	 * Returns a new Point from given Object.
	 * @param   {object}   val [[Description]]
	 * @returns {Point}    Resulting new Point object
	 */
	static fromObject(val) {
		var resultat;
		if (val.z === undefined) {
			resultat = new this(val.x, val.y);
		} else {
			resultat = new this(val.x, val.y, val.z);
		}
		return resultat;
	}
	/**
	 * Returns a new Point from given data. Calls appropriate "from" method according to data type
	 * @param   {mixed} val Data to parse
	 * @returns {Point} Resulting new Point object
	 */
	static from(val) {
		if (typeof val === "string") {
			return this.fromString(val);
		} else if (val instanceof Array) {
			return this.fromArray(val);
		} else if (typeof val === "object") {
			return this.fromObject(val);
		} else {
			throw "Bad data type";
		}
	}
	/**
	 * Inits static properties
	 */
	static init() {
		this.dimensions = 3;
	}
}
Point.init();
