var PageObject = require('./PageObject');

/**
 * Selector Page Objects - Shared functions where a selector is required.
 * @param {String} selector - CSS selector for target Page Object.
 */
function SelectorPageObject(selector) {
    this.selector = selector;
}

SelectorPageObject.prototype = Object.create(PageObject.prototype);

/**
 * Retrieves if this element is existing on the page.
 * @returns {Promise} A promise that resolves if this element is existing on the page.
 */
SelectorPageObject.prototype.isExisting = function() {
    return this.getBrowser().isExisting(this.selector);
};

/**
 * Retrieves if this element is visible on the page.
 * @returns {Promise} A promise that resolves if this element is visible on the page.
 */
SelectorPageObject.prototype.isVisible = function() {
    return this.getBrowser().isVisible(this.selector);
};

/**
 * Checks if the component is visible within the viewport.
 * @returns {Promise} a promise that will resolve into the visibility of the component.
 */
SelectorPageObject.prototype.isVisibleWithinViewport = function() {
    return this.getBrowser().isVisibleWithinViewport(this.selector);
};

/**
 * Waits until this object is visible within the viewport.
 * @returns {Promise} A promise that resolves when the element is visible within the viewport.
 */
SelectorPageObject.prototype.waitForVisibleWithinViewport = function() {
    return this.getBrowser().waitUntil(() => this.isVisibleWithinViewport());
};

/**
 * Waits until this object is not visible within the viewport.
 * @returns {Promise} A promise that resolves when the element is not visible within the viewport.
 */
SelectorPageObject.prototype.waitForNotVisibleWithinViewport = function() {
    return this.getBrowser().waitUntil(() => this.isVisibleWithinViewport().then(visible => !visible));
};

/**
 * Waits until this object is not existing anymore.
 * @returns {Promise} A promise that resolves when the element does not exist.
 */
SelectorPageObject.prototype.waitForNotExisting = function() {
    var _this = this;
    return this.getBrowser().waitUntil(function() {
        return _this.isExisting().then(function(isExisting) {
            return !isExisting;
        });
    });
};

/**
 * Waits until this object is visible.
 * @param {Number} timeToWait - time in milliseconds
 * @returns {Promise} A promise that resolves when the element is visible.
 */
SelectorPageObject.prototype.waitForVisible = function(timeToWait) {
    return this.getBrowser().waitForVisible(this.selector, timeToWait);
};

/**
 * Retrieves if this element is enabled on the page.
 * @returns {Promise} A promise that resolves if this element is enabled on the page.
 */
SelectorPageObject.prototype.isEnabled = function() {
    return this.getBrowser().isEnabled(this.selector);
};

/**
 * Waits until this object is enabled.
 * @returns {Promise} A promise that resolves when the element is enabled.
 */
SelectorPageObject.prototype.waitForEnabled = function() {
    return this.getBrowser().waitForEnabled(this.selector);
};

/**
 * Waits until this object is existing.
 * @returns {Promise} A promise that resolves when the element is existing.
 */
SelectorPageObject.prototype.waitForExist = function() {
    return this.getBrowser().waitForExist(this.selector);
};

/**
 * Retrieves a promise that resolves width of the element.
 * @returns {Promise} A promise that resolves width of the element.
 */
SelectorPageObject.prototype.getWidth = function() {
    return this.getBrowser().getElementSize(this.selector, 'width');
};

/**
 * Retrieves a promise that resolves height of the element.
 * @returns {Promise} A promise that resolves height of the element.
 */
SelectorPageObject.prototype.getHeight = function() {
    return this.getBrowser().getElementSize(this.selector, 'height');
};

/**
 * Retrieves a promise that resolves a value for the given attribute of the element.
 * @param {String} name - property name
 * @returns {Promise} A promise that resolves a value for the given attribute of the element.
 */
SelectorPageObject.prototype.attribute = function(name) {
    var selector = this.selector;
    return this.getBrowser().getAttribute(selector, name);
};

/**
 * Retrieves attribute and returns the parsed JSON value.
 * @param {String} name - Name of attribute.
 * @returns {Promise} A promise that resolves into the parsed JSON value of the attribute.
 */
SelectorPageObject.prototype.parsedAttribute = function(name) {
    var selector = this.selector;
    return this.getBrowser()
        .getAttribute(selector, name)
        .then(function(value) {
            var result;
            if (value.constructor === Array) {
                result = [];
                value.forEach(function(entry) {
                    result.push(JSON.parse(entry.toString()));
                });
            } else {
                result = JSON.parse(value.toString());
            }

            return result;
        });
};

/**
 * Click on the element, selector is optional and gets appended.
 * @param {String} [customSelector] - selector var is concatenated from SelectorPageObject selector & customSelector.
 * @returns {Promise} A promise that resolves by clicking the element.
 */
SelectorPageObject.prototype.click = function(customSelector) {
    var selector = this.selector + (customSelector || '');
    return this.getBrowser().waitForVisible(selector).click(selector).waitForjQueryDone();
};

/**
 * Move the mosue to the element, selector is optional and gets appended.
 * @param {String} [customSelector] - selector var is concatenated from SelectorPageObject selector & customSelector.
 * @returns {Promise} A promise that resolves by moving the mouse to the element.
 */
SelectorPageObject.prototype.moveToObject = function(customSelector) {
    var selector = this.selector + (customSelector || '');
    return this.getBrowser().waitForVisible(selector).moveToObject(selector);
};

SelectorPageObject.prototype.moveTo = function(x, y) {
    return this.getBrowser().moveTo(this.selector, x, y);
};

/**
 * Output a value [object] of the given CSS property name. http://webdriver.io/api/property/getCssProperty.html
 * @param {String} name - Single longhand CSS property name.
 * No return on shorthand CSS properties (e.g. background, font, border, margin, padding, list-style, outline).
 * @returns {Promise} A promise that resolves by the value of the given CSS property.
 */
SelectorPageObject.prototype.cssProperty = function(name) {
    return this.getBrowser().getCssProperty(this.selector, name);
};

/**
 * Scroll to a specific element. You can also append/pass two offset values as parameter to scroll to a specific position.
 * @param {Number} xoffset - x offset to scroll to.
 * @param {Number} yoffset - y offset to scroll to.
 * @returns {Promise} A promise that resolves by scrolling into this element.
 */
SelectorPageObject.prototype.scroll = function(xoffset, yoffset) {
    return this.getBrowser().scroll(this.selector, xoffset, yoffset);
};

/**
 * Scrolls so that this element is visible on the page but not hidden by the header.
 * The header is clickable and if the element is underneath it, we'll end up clicking the header
 * and landing on the homepage.
 * @returns {Promise} A promise that resolves by scrolling so that this element is not hidden by the header.
 */
SelectorPageObject.prototype.scrollUnderHeader = function() {
    return this.scroll(0, -150);
};

/**
 * Removes the element from the DOM. Use with moderation,
 * as it isn't really something the user would do while browsing.
 * @returns {Promise} A promise that resolves by removing the element from the DOM.
 */
SelectorPageObject.prototype.remove = function() {
    return this.getBrowser().execute(function(selector) {
        var element = document.querySelector(selector);
        if (element) {
            element.remove();
        }
    }, this.selector);
};

/**
 * Gets the height of the given object.
 * @returns {Promise} A promise that resolves into the height of this object.
 */
SelectorPageObject.prototype.getHeight = function() {
    return this.getBrowser().getElementSize(this.selector).then(function(size) {
        return size.height;
    });
};

/**
 * Gets the location of the given object.
 * @returns {Promise} A promise that resolves into the location data of this object.
 */
SelectorPageObject.prototype.getLocation = function() {
    return this.getBrowser().getLocation(this.selector);
};

/**
 * Counts the number of elements matching by the underlying selector.
 * @returns {Promise} A promise that resolves into the number of elements of this selector.
 */
SelectorPageObject.prototype.length = function() {
    // what if the selector matched many elements?
    // let's count them using a trick
    return this.isVisible().then(function(visible) {
        // isVisible() returns an array if it matches multiple elements
        if (typeof visible === 'boolean') {
            // it is a simple true/false
            return visible ? 1 : 0;
        } else {
            // it is an array
            return visible.length;
        }
    });
};

/**
 * Waits until the height of this object has stabilizied,
 * typically used to wait for a vertical animation to complete.
 * @returns {Promise} A promise that resolves when the height stops fluctuating.
 */
SelectorPageObject.prototype.waitUntilHeightIsStable = function() {
    // initialize with an impossible value
    var height = -1;
    var _this = this;
    return this.getBrowser().waitUntil(function() {
        return _this.getHeight().then(function(currentHeight) {
            var animationEnded = currentHeight === height;
            height = currentHeight;
            return animationEnded;
        });
    });
};

module.exports = SelectorPageObject;
