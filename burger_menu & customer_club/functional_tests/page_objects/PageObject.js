var testBase = require('../test_base');

/**
 * Base class for all PageObjects.
 */
function PageObject() {
}

/**
 * Gets the webdriverio browser object.
 * This method should be called by base classes to access and encapsulate webdriverio functionality.
 *
 * @protected
 * @returns {Object} The webdriverio object.
 */
PageObject.prototype.getBrowser = function() {
    return testBase.getBrowser();
};

/**
 * Get the current url.
 * @returns {Promise} A promise that resolves into the current URL.
 */
PageObject.prototype.getCurrentUrl = function() {
    return this.getBrowser().getUrl()
        .then(function(urlObject) {
            return urlObject;
        });
};

/**
 * Saves a screenshot (for debugging purposes only) of the whole page.
 * @param {String} filename - The filename to save the screenshot.
 * @returns {Promise} A promise that resolves by taking a screenshot.
 */
PageObject.prototype.saveScreenshot = function(filename) {
    return this.getBrowser().saveScreenshot(filename);
};

/**
 * Go back using the browser's back button.
 * @returns {Promise} A promise that resolves by going back.
 */
PageObject.prototype.back = function() {
    return this.getBrowser().back();
};

/**
 * Focus out of a field or form by sending the TAB key to the browser.
 * @returns {Promise} A promise that resolves by sending the TAB keypress to the browser.
 */
PageObject.prototype.focusOut = function() {
    return this.getBrowser().keys('\t');
};

/**
 * Get cookie.
 * @param {String} cookie - The name of the cookie.
 * @returns {Promise} A promise that resolves into the cookie value.
 */
PageObject.prototype.getCookie = function(cookie) {
    return this.getBrowser().getCookie(cookie);
};

/**
 * Set cookie.
 * @param {Object} cookie - The cookie to set.
 * @returns {Promise} A promise that resolves by setting the specified cookie.
 */
PageObject.prototype.setCookie = function(cookie) {
    return this.getBrowser().setCookie(cookie);
};

/**
 * Gets the window Y offset of the page,
 * @returns {Promise} A promise that resolves by returning the Y offset of the page.
 */
PageObject.prototype.getYOffset = function() {
    return this.getBrowser().execute(function() {
        return window.pageYOffset;
    });
};

PageObject.prototype.waitUntilLoaded = async function() {
    await this.getBrowser().waitForDocumentReady();
    return await this.getBrowser().deleteDemandwareToolkit();
};

module.exports = PageObject;
