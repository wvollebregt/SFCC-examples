const SHARED_CSS_CLASSES = require('../style/css_classes');

/**
 * Create a cached query. This function creates an immutable object and returns a getter
 * function. This allows for lazy-loading and caching for rapid reuse.
 *
 * Example:
 *
 * ``` javascript
 * var getMenu = cachedQuerySelector('.menu');
 *
 * document.documentElement.addEventListener('click', function openMenu(event) {
 *     if (event.target === getMenu()) {
 *         getMenu().classList.add('showMe');
 *     }
 * });
 * ```
 *
 * @param {String} selector - The CSS selector for the query
 * @param {Boolean} [all] - Determines if all elements matching the selector are returned. Default is false
 * @returns {function} - getter function
 */
function cachedQuerySelector(selector, all) {
    var _ELEMENT = null;

    /**
     * Retrieve an HTML element by selector and cache the result.
     * @param {HTMLElement} [baseElement] - Element to be used as root for query selector, will find only descendants of baseElement
     * @returns {HTMLElement} The cached HTML element(s).
     */
    return function getCachedQuery(baseElement) {
        var _baseElement = (baseElement && baseElement instanceof HTMLElement) ? baseElement : document;

        if (!_ELEMENT) {
            if (all) {
                _ELEMENT = _baseElement.querySelectorAll(selector);
            } else {
                _ELEMENT = _baseElement.querySelector(selector);
            }
        }

        return _ELEMENT;
    };
}

/**
 * Create a filter to capture only relevant events.
 *
 * @param {function} filter - Filter to pass only relevant events
 * @param {function} handler - Actual handler
 * @returns {function} handler for attaching to the event
 */
function eventFilter(filter, handler) {
    /**
     * This is the actual handler that runs the filter and handler.
     *
     * @param {Event} event - The browser event
     * @returns {*} The result of invoking the handler.
     */
    return function eventFilterHandler(event) {
        if (filter(event)) {
            return handler(event);
        }

        return true;
    };
}

/**
 * Find if `origin` has an ancestor that matches `target`.
 *
 * @param {Element} origin - Element from where to start bubbling up
 * @param {Element} target - Element that you're looking for
 * @param {Integer} [limit] - How long to bubble up before we stop looking (default: 100)
 * @returns {Integer} - How far it bubbled to find parent. (if target not found returns -1)
 */
function closest(origin, target, limit) {
    var DEFAULT_LIMIT = 100;

    var stopAt = limit >= 0 ? limit : DEFAULT_LIMIT;
    var i = 0;
    var parent = origin;

    while (parent && i < stopAt) {
        if (parent === target) {
            return i;
        }

        parent = parent.parentNode;
        i++;
    }

    return -1;
}

/**
 * Find if `origin` has an ancestor that matches `target`.
 *
 * @param {Element} origin - Element from where to start bubbling up
 * @param {String} className - Class name that you're looking for
 * @param {Integer} [limit] - How long to bubble up before we stop looking (default: 100)
 * @returns {Element} - Element that matches the class you're looking for (if target not found returns null)
 */
function closestByClass(origin, className, limit) {
    var DEFAULT_LIMIT = 100;

    var stopAt = limit >= 0 ? limit : DEFAULT_LIMIT;
    var i = 0;
    var parent = origin;

    while (parent && i < stopAt) {
        if (parent.classList && parent.classList.contains(className)) {
            return parent;
        }

        parent = parent.parentNode;
        i++;
    }

    return null;
}

/**
 * Adds and removes a css class for an element
 * @param {Element} element - DOM Node Element
 * @param {String} add - class to add
 * @param {String} remove - class to remove
 */
function switchClass(element, add, remove) {
    element.classList.add(add);
    element.classList.remove(remove);
}

/**
 * IIFE function to determine if passive event listeners are supported.
 * Detection based on MDN code:
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Improving_scrolling_performance_with_passive_listeners
 */
const supportsPassiveListeners = (function() {
    let supportsPassive = false;
    let testPerformed = false;

    const testPassiveListeners = () => {
        try {
            window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
                get: function() {
                    supportsPassive = true;
                    return true;
                }
            }));
        } catch (err) {

        }

        testPerformed = true;
    };

    /**
     * Public function.
     * @returns {Boolean} - True or false.
     */
    return () => {
        if (!testPerformed) {
            testPassiveListeners();
        }

        return supportsPassive;
    };
}());

/**
 * IIFE function to determine if sticky positioning is supported.
*/
const supportsStickyPositioning = (function() {
    let supportsSticky = false;
    let testPerformed = false;

    /**
     * Performs the actual testing.
     */
    let testSticky = () => {
        testPerformed = true;

        // The current Edge version unfortunately has a very buggy sticky implementation.
        if (navigator.userAgent.toLowerCase().indexOf('edge') > -1) {
            supportsSticky = false;
            return;
        }

        // Temporarily add a test element to the DOM.
        // It needs to be in the DOM during the tests, otherwise getComputedStyle() will not work.
        let div = document.createElement('div');
        div.style.width = '1px';
        div.style.height = '1px';
        document.body.appendChild(div);

        try {
            for (let i = 0, values = ['sticky', '-webkit-sticky']; i < values.length; i++) {
                const testValue = values[i];
                div.style.position = testValue;
                const domValue = window.getComputedStyle(div).getPropertyValue('position');
                if (domValue === testValue) {
                    supportsSticky = true;
                    break;
                }
            }
        } catch (e) {
            supportsSticky = false;
        }

        // Remove element after test.
        document.body.removeChild(div);
        div = null;
    };

    /**
     * Public function.
     * @returns {Boolean} - True or false.
     */
    return () => {
        if (!testPerformed) {
            testSticky();
        }

        return supportsSticky;
    };
}());

/**
 * IIFE to determine the combined height for all header elements.
 */
const getHeaderElementsHeight = (function() {
    let headerElements = null;

    const getHeaderElements = () => {
        headerElements = headerElements || [
            document.querySelector(`.${SHARED_CSS_CLASSES.SERVICE_BAR}`),
            document.querySelector(`.${SHARED_CSS_CLASSES.MENU_TOP_NAVIGATION}`),
            document.querySelector(`.${SHARED_CSS_CLASSES.SLIM_FIT_WIDGET}`)
        ];

        return headerElements;
    };

    /**
     * Public function.
     * @returns {Number} - Combined height of header elements.
     */
    return () => getHeaderElements().reduce((total, element) => element ? total + element.getBoundingClientRect().height : total, 0);
}());

/**
 * Public exports.
 */
module.exports = {
    closest,
    closestByClass,
    eventFilter,
    cachedQuerySelector,
    switchClass,
    supportsPassiveListeners,
    supportsStickyPositioning,
    getHeaderElementsHeight
};
