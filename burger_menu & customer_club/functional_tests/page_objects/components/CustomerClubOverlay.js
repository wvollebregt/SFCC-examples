var BaseComponent = require('./BaseComponent');
var TextElement = require('./../elements/Text');
var InputElement = require('./../elements/Input');
var SelectElement = require('./../elements/Select');
var ButtonElement = require('./../elements/Button');
var CheckboxElement = require('./../elements/Checkbox');

/**
 * Customer Service Overlay Component
 */
function CustomerClubOverlay() {
    BaseComponent.call(this, '.customer-club-overlay');
}

CustomerClubOverlay.prototype = Object.create(BaseComponent.prototype);

/**
 * Return the first checkbox input
 * @returns {CheckboxElement} A page object.
 */
CustomerClubOverlay.prototype.firstCheckbox = function() {
    return new CheckboxElement(this.selector + ' .customer-club-overlay__form__gender > input:nth-child(2)');
};

/**
 * Return the second checkbox input
 * @returns {CheckboxElement} A page object.
 */
CustomerClubOverlay.prototype.secondCheckbox = function() {
    return new CheckboxElement(this.selector + ' .customer-club-overlay__form__gender > input:nth-child(4)');
};

/**
 * Return the third checkbox input
 * @returns {CheckboxElement} A page object.
 */
CustomerClubOverlay.prototype.thirdCheckbox = function() {
    return new CheckboxElement(this.selector + ' .customer-club-overlay__form__gender > input:nth-child(6)');
};

/**
 * Return the birthday day select
 * @returns {SelectElement} A page object.
 */
CustomerClubOverlay.prototype.day = function() {
    return new SelectElement(this.selector + ' select[name=day]');
};

/**
 * Return the birthday month select
 * @returns {SelectElement} A page object.
 */
CustomerClubOverlay.prototype.month = function() {
    return new SelectElement(this.selector + ' select[name=month]');
};

/**
 * Return the birthday year select
 * @returns {SelectElement} A page object.
 */
CustomerClubOverlay.prototype.year = function() {
    return new SelectElement(this.selector + ' select[name=year]');
};

/**
 * Return the phone input
 * @returns {InputElement} A page object.
 */
CustomerClubOverlay.prototype.phone = function() {
    return new InputElement(this.selector + ' .customer-club-overlay__form__mobile > input:not(.country)');
};

/**
 * Return the countryCode hidden input
 * @returns {InputElement} A page object.
 */
CustomerClubOverlay.prototype.countryCode = function() {
    return new InputElement(this.selector + ' .country');
};

/**
 * Return the first step header text element
 * @returns {TextElement} A page object.
 */
CustomerClubOverlay.prototype.firstHeader = function() {
    return new TextElement(this.selector + ' .customer-club-overlay__firstheader');
};

/**
 * Return the extra message text element
 * @returns {TextElement} A page object.
 */
CustomerClubOverlay.prototype.extraMessage = function() {
    return new TextElement(this.selector + ' .customer-club-overlay__extramessage');
};

/**
 * Return the 'thank you' step header text element
 * @returns {TextElement} A page object.
 */
CustomerClubOverlay.prototype.secondHeader = function() {
    return new TextElement(this.selector + ' .customer-club-overlay__secondheader');
};

/**
 * Return the join button
 * @returns {ButtonElement} A page object.
 */
CustomerClubOverlay.prototype.signMeUpAnchor = function() {
    return new ButtonElement(this.selector + ' .customer-club-overlay__form__button');
};

/**
 * Return the close button
 * @returns {ButtonElement} A page object.
 */
CustomerClubOverlay.prototype.closeButton = function() {
    return new ButtonElement(this.selector + ' .customer-club-overlay__close');
};

/**
 * Return the lightbox overlay
 * @returns {ButtonElement} A page object.
 */
CustomerClubOverlay.prototype.lightboxOverlay = function() {
    return new ButtonElement('#customer-club-overlay .lightbox-overlay-close');
};

module.exports = CustomerClubOverlay;
