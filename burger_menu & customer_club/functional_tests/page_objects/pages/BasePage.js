'use strict';

const PageObject = require('./../PageObject');
const HeaderObject = require('./../components/Header');
const FooterObject = require('./../components/Footer');
const BurgerMenu = require('./../components/BurgerMenu');
const CookiePolicy = require('./../components/CookiePolicy');
const CustomerClubPopup = require('./../components/CustomerClubPopup');
const CanonicalLinkComponent = require('./../components/CanonicalLink');
const ButtonElement = require('./../elements/Button');
const AnchorElement = require('./../elements/Anchor');
const AlternateLanguageLinks = require('./../components/AlternateLanguageLinks');
const AMPElement = require('../components/AMPElement');
const BaseElement = require('./../elements/BaseElement');
const Map = require('./../elements/Map');
const Button = require('./../elements/Button');
const LinkElement = require('../elements/Link');
const urlInfo = require('../../util/url_info');
const objectDeepSearch = require('../../util/object_deep_search');
const testBaseDimensions = require('../../test_base').dimensions;
const Promise = require('promise');

const HTML_TAG_H1 = 'h1';
const HTML_TAG_H2 = 'h2';
const HTML_TAG_H3 = 'h3';

class BasePage extends PageObject {

    /**
     * Base Page Object
     */
    constructor() {
        super();
    }

    /**
     * Validate if inputted element has valid heading size
     *
     * @param {*} element - element to very the font-size
     * @returns {Boolean} - true if valid size
     */
    async validMarkdownHeadingSize(element) {
        const windowSizeObject = await this.getBrowser().windowHandleSize();
        const bodyFontSize = await this.body().cssProperty('font-size').then(fonts => _getFontSizeValue(fonts));
        const elementFontSize = await element.cssProperty('font-size').then(fonts => _getFontSizeValue(fonts));

        // This can return more than one value
        let elementTag = await this.getBrowser().getTagName(element.selector);
        elementTag = elementTag instanceof Array ? elementTag[0] : elementTag;

        switch (elementTag) {
            case HTML_TAG_H1:
                const maxSizeAllowedH1 = _getMaxHeaderSizeByWindowWidth(windowSizeObject.value.width, elementFontSize, HTML_TAG_H1);
                return elementFontSize > bodyFontSize && elementFontSize <= maxSizeAllowedH1;
            case HTML_TAG_H2:
                const maxSizeAllowedH2 = _getMaxHeaderSizeByWindowWidth(windowSizeObject.value.width, elementFontSize, HTML_TAG_H2);
                return elementFontSize > bodyFontSize && elementFontSize <= maxSizeAllowedH2;
            case HTML_TAG_H3:
                const maxSizeAllowedH3 = _getMaxHeaderSizeByWindowWidth(windowSizeObject.value.width, elementFontSize, HTML_TAG_H3);
                return elementFontSize > bodyFontSize && elementFontSize <= maxSizeAllowedH3;
            default:
                return false;
        }
    }

    /**
     * Goes to the requested URL and waits until it is loaded.
     * @param {String} url - The URL to load.
     * @returns {Promise} A promise.
     */
    async url(url) {
        await this.getBrowser().url(url);
        return await this.waitUntilLoaded();
    }

    /**
     * Clear local storage item.
     * @param {String} key - Key of local storage item.
     */
    async clearLocalStorageItem(key) {
        await this.getBrowser().execute(function(key) {
            window.localStorage.removeItem(key);
        }, key);
    }

    /**
     * Reload page.
     */
    async reload() {
        await this.getBrowser().execute(function() {
            document.body.removeAttribute('data-appjs-loaded'); // Remove attribute.
        });

        await this.getBrowser().refresh();
        await this.waitUntilLoaded();
    }

    /**
     * Wrapper around this.url() which directs the browser to an AMP page
     * @param {String} url - The URL to load.
     * @returns {Promise} A promise which resolves with a new page.
     */
    ampUrl(url) {
        url = url + urlInfo.getParameterCharacter(url) + 'amp=1';
        url = url.replace('http://', 'https://'); // AMP demands https

        return this.url(url);
    }

    /**
     * Gets the title of the page
     * @returns {Promise} A promise that resolves into the title of the page.
     */
    title() {
        return this.getBrowser().getTitle();
    }

    /**
     * Gets the meta attribute of the page
     * @param {String} metaName - The name of the meta attribute.
     * @returns {Promise} A promise that resolves into the value of the given meta attribute.
     */
    meta(metaName) {
        return this.getBrowser().getAttribute('meta[name="' + metaName + '"]', 'content');
    }

    /**
     * Gets the body element of the page (servicebar)
     * @returns {HeaderObject} A page object.
     */
    body() {
        return new HeaderObject('body');
    }

    /**
     * Gets the header of the page (servicebar)
     * @returns {HeaderObject} A page object.
     */
    header() {
        return new HeaderObject('.js-service-bar');
    }

    /**
     * Returns the homepage
     * @returns {BaseElement} A page object.
     */
    homePage() {
        return new BaseElement('.homepage');
    }

    /**
     * Returns the content wrapper
     * @returns {BaseElement} A page object.
     */
    contentWrapper() {
        return new BaseElement('.content-wrapper');
    }

    /**
     * Gets the footer of the page (footer-container)
     * @returns {FooterObject} A page object.
     */
    footer() {
        return new FooterObject('footer.footer-container');
    }

    /**
     * Gets the branded css of the page
     * @returns {Promise} A promise that resolves into the href of the branded css file.
     */
    css() {
        return this.getBrowser().getAttribute('link[href$="style.css"]', 'href');
    }

    /**
     * Get the Open Graph tags.
     * @returns {Promise} - Promise that resolves with array of Open Graph meta tags content.
     */
    getOpenGraphTags() {
        return this.getBrowser().execute(function() {
            var regex = /^og:(.+)/;
            var result = [];
            var tags = document.querySelectorAll('meta');

            for (var i = 0; i < tags.length; i++) {
                var tag = tags[i];
                var property = tag.getAttribute('property') || '';
                var match = property.match(regex);

                if (!match) {
                    continue;
                }

                var content = tag.getAttribute('content');

                result.push({property: match[1], content: content});
            }

            return result;
        });
    }

    async getDataLayerEvent(eventName) {
        const dataLayer = await this.getDataLayer();
        return dataLayer.filter((tracking) => tracking.event === eventName);
    }

    /**
     * Gets the Data Layer of a giver parameter (e.g. user)
     * @param {String} propertyName - The name of the property.
     * @param {String} gtmAccountId - The ID of the GTM account.
     * @returns {Promise} A promise that resolves into the value of the given data layer property.
     */
    getDataLayerProperty(propertyName, gtmAccountId) {
        var accountId = gtmAccountId || 'GTM-TH9ZQM';
        return this.getBrowser().waitForGoogleTagManager().execute('return google_tag_manager[\'' + accountId + '\'].dataLayer.get(\'' + propertyName + '\');');
    }

    /**
     * Gets the data layer client-side JavaScript object.
     * @returns {Promise} A promise that resolves into the data layer object.
     */
    getDataLayer() {
        return this.getBrowser().waitForGoogleTagManager().execute('return window.dataLayer;')
            .then(function(result) {
                return result.value;
            });
    }

    /**
     * Gets the window client-side JavaScript object.
     * @param {String} property Window property
     * @returns {Promise} A promise that resolves into the window object.
     */
    getWindowProperty(property) {
        return this.getBrowser().execute(`return window['${property}'];`)
            .then(function(result) {
                return result.value;
            });
    }

    /**
     * Gets the data layer client-side JavaScript object.
     * @param {Number} index - The zero-based index of the data layer item.
     * @returns {Promise} A promise that resolves into the specified data layer object.
     */
    getDataLayerElement(index) {
        return this.getBrowser().waitForGoogleTagManager().execute('return window.dataLayer;')
            .then(function(result) {
                return result.value[index];
            });
    }

    /**
     * Gets the data layer client-side last JavaScript object.
     * @returns {Promise} A promise that resolves into the latest data layer item.
     */
    async getInteractionElement() {
        const result = await this.getBrowser().waitForGoogleTagManager().execute('return window.dataLayer;');
        return result.value.find((dataLayerEntry) => {
            return !!dataLayerEntry.interaction;
        });
    }

    async getDeepDataLayerProperty(property) {
        let dataLayer = await this.getDataLayer();
        let results = [];
        for (var i = 0; i < dataLayer.length; i++) {
            let result = objectDeepSearch.getDeepObjectProperty(dataLayer[i], property);
            if (result && result.length !== 0) {
                results.push(result);
            }
        }

        if (results.length) {
            // If results has multiple subarrays squash them all into a single array
            return Array.prototype.concat.apply([], results);
        } else {
            return null;
        }
    }

    /**
     * Gets the burger menu of the page.
     * @returns {BurgerMenu} A page object.
     */
    burgerMenu() {
        return new BurgerMenu();
    }

    resize(size) {
        return this.getBrowser().windowHandleSize(size || this.dimensions.desktop);
    }

    /**
     * Get any malformed links on a page level.
     * @param {String} url - The url to visit.
     * @returns {Promise} A promise that resolves into the number of malformed links.
     */
    malformedLinksCount(url) {
        var _this = this;

        return this.url(url)
            .then(function() {
                return _this.getBrowser().elements('a[href="null"], a[href="undefined"]');
            })
            .then(function(result) {
                return result.value.length;
            });
    }

    /**
     * Gets the mini cart icon of the page.
     * @returns {AnchorElement} A page object.
     */
    miniCartIconButton() {
        return new AnchorElement('.servicebar__minicart-button');
    }

    /**
     * Gets the mini cart icon of the page when a product has been added to the basket.
     * @returns {AnchorElement} A page object.
     */
    miniCartIconButtonActive() {
        return new AnchorElement('.servicebar__minicart-button--active');
    }

    /**
     * Gets the map of the page.
     * @returns {Map} A page object.
     */
    map() {
        return new Map();
    }

    /**
     * Scroll to a position within the page.
     * @param {Number} xoffset - x offset to scroll to.
     * @param {Number} yoffset - y offset to scroll to.
     */
    async scroll(xoffset, yoffset) {
        await this.getBrowser().scroll(xoffset, yoffset);

        // adding delay after scroll was proven to have less flaky tests
        // rate limiter is often used with a throttle timeout of 200ms, using a safe margin.
        await this.getBrowser().pause(400);
    }

    /**
     * Scroll by selector.
     * @param {String} selector - Selector to use.
     */
    async scrollBySelector(selector) {
        const location = await this.getBrowser().getLocation(selector);
        await this.scroll(0, location.y);
    }

    /**
     * Gets the customer club popup
     * @returns {CustomerClubPopup} A page object.
     */
    customerClubPopup() {
        return new CustomerClubPopup();
    }

    cookiePolicy() {
        return new CookiePolicy();
    }

    quickSearchButton() {
        return new Button('.js-quick-search-button');
    }

    /**
     * Gets query string key/value pairs
     * @param {String} url - The URL to read information from.
     * @returns {Array} A collection of key-value pairs.
     */
    getAvailableQueryVariableFromUrl(url) {
        return urlInfo.getAvailableQueryVariableFromUrl(url);
    }

    /**
     * Returns an alternate language link
     * @returns {AlternateLanguageLinks } A link object.
     */
    getAlternateLanguageLinks() {
        return new AlternateLanguageLinks();
    }

    /**
     * Returns a canonical link
     * @returns {CanonicalLinkComponent} A link object.
     */
    getCanonicalLink() {
        return new CanonicalLinkComponent('link[rel="canonical"]');
    }

    /**
     * Returns the og:url  meta tag
     * @returns {LinkElement} A link object.
     */
    getOgUrl() {
        return new LinkElement('meta[property="og:url"]');
    }

    /**
     * Gets the button to scroll to top
     * @returns {ButtonElement} A page object.
     */
    backToTopButton() {
        return new ButtonElement('.js-back-to-top__button');
    }

    /**
     * Gets the page type ('plp', 'homepage', etc)
     * @returns {String} A String value.
     */
    getPageType() {
        return this.getBrowser().getAttribute('div[id="wrapper"]', 'class');
    }

    /**
     * Return the amp object
     * @returns {AMPElement} The AMP element
     */
    amp() {
        return new AMPElement();
    }

    /**
     * Use this method to create a delay between actions,
     * add the reason instead of the comment to inform developers why
     * you are adding this delay;
     *
     * @param {String} reason - reason of delay
     * @param {Number} delay - delay in miliseconds
     * @returns {Promise} - Returns a resolved promise
     */
    async wait(reason, delay = 300) {
        if (!reason) {
            throw new Error('Please add a reason of wait');
        }

        if (typeof delay !== 'number') {
            throw new Error('Delay must be a number');
        }

        return await new Promise(resolve => setTimeout(resolve, delay));
    }

    async removeToolKit() {
        try {
            await this.getBrowser().waitForVisible('#DW-SFToolkit');
            await this.getBrowser().deleteDemandwareToolkit();

            // for some reason DW sf tool kit is loaded twice
            await this.getBrowser().waitForVisible('#DW-SFToolkit');
            await this.getBrowser().deleteDemandwareToolkit();
        } catch (e) {
            // to not fail test when dw sftoolkit is not found
        }
    }
}

/**
 * @param {Object|Object[]} fonts - object returned from webdriverio
 * @param {Object} fonts.parsed - object with parsed values
 * @param {Object} fonts.parsed.value - numeric value
 * @returns {Number} - numeric representation of font
 */
function _getFontSizeValue(fonts) {
    fonts = fonts instanceof Array ? fonts[0] : fonts;
    return (fonts || {parsed: {}}).parsed.value;
}

/**
 * @param {String} type - string representation of tag name
 * @return {boolean} - true if string inputted is h1, h2 or h3 tags
 */
function _isValidHeaderTag(type) {
    // case insensitive
    return /^h(1|2|3)$/i.test(type);
}

/**
 * @param {Number} windowWidth - width size of window to verify the current breakpoint
 * @param {Number} elementFontSize - size of the element
 * @param {String} tagName - string representing the tag name of the element to check
 * @return {number} - approximate max font-size value a header can be (-1 if invalid tag)
 */
function _getMaxHeaderSizeByWindowWidth(windowWidth, elementFontSize, tagName) {
    if (!_isValidHeaderTag(tagName)) {
        return 0;
    }

    // these settings live on styleguide\web\_b.scalable.scss
    const scalableFontFactor = {
        desktop: 1.17,
        hands: 1.6,
        palm: 3.8
    };

    if (windowWidth >= testBaseDimensions.desktop.width) {
        const desktopFontSizesByType = {
            h1: 3 / 2,
            h2: 8 / 6,
            h3: 7 / 6
        };

        return elementFontSize * scalableFontFactor.desktop * desktopFontSizesByType[tagName];
    } else if (windowWidth >= testBaseDimensions.tablet.width && windowWidth < testBaseDimensions.desktop.width) {
        const tableFontSizesByType = {
            h1: 3,
            h2: 16 / 6,
            h3: 2
        };

        return elementFontSize * scalableFontFactor.tablet * tableFontSizesByType[tagName];
    } else {
        const mobileFontSizeByType = {
            h1: 3 / 2,
            h2: 8 / 6,
            h3: 1
        };

        return elementFontSize * scalableFontFactor.hands * mobileFontSizeByType[tagName];
    }
}

module.exports = BasePage;
