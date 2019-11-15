'use strict';

var BaseComponent = require('./BaseComponent');
var TextElement = require('./../elements/Text');
var BaseElement = require('./../elements/BaseElement');
var LabelElement = require('./../elements/Label');
var InputElement = require('./../elements/Input');
var AnchorElement = require('./../elements/Anchor');
var CustomPosition = require('./../../util/custom_position.js');

class CustomerClubSignUp extends BaseComponent {
    /**
     * Customer Club Widget Component
     * @constructor
     * @param {String} selector - The selector to use.
     */
    constructor(selector) {
        super(selector);
    }

    /**
     * Return the div containing the background image
     * @returns {BaseElement} A page object.
     */
    divBackgroundImage() {
        return new BaseElement(this.selector + ' .customer-club-signup__background');
    }

    /**
     * Return the firstname input
     * @returns {InputElement} A page object.
     */
    firstName() {
        return new InputElement(this.selector + ' .customer-club-signup__form__firstname > input');
    }

    /**
     * Return the firstname div with the error class
     * @returns {BaseElement} A page object.
     */
    firstNameError() {
        return new BaseElement(this.selector + ' .customer-club-signup__form__firstname.error');
    }

    /**
     * Return the firstname input
     * @returns {InputElement} A page object.
     */
    lastName() {
        return new InputElement(this.selector + ' .customer-club-signup__form__lastname > input');
    }

    /**
     * Return the lastname div with the error class
     * @returns {BaseElement} A page object.
     */
    lastNameError() {
        return new BaseElement(this.selector + ' .customer-club-signup__form__lastname.error');
    }

    /**
     * Return the email input
     * @returns {InputElement} A page object.
     */
    email() {
        return new InputElement(this.selector + ' .customer-club-signup__form__email > input');
    }

    /**
     * Return the email div with the error class
     * @returns {BaseElement} A page object.
     */
    emailError() {
        return new BaseElement(this.selector + ' .customer-club-signup__form__email.error');
    }

    /**
     * Return the header text element
     * @returns {TextElement} A page object.
     */
    header() {
        return new TextElement(this.selector + ' .customer-club-signup__firstheader');
    }

    /**
     * Return the customer club sub text element
     * @param {boolean} [palmHidden=false] - look for sub text that is hidden in palm break points
     * @returns {TextElement} A page object.
     */
    subText(palmHidden) {
        return new TextElement(`${this.selector} .widget-customer-club__text${palmHidden ? '--palm-hidden' : ''}`);
    }

    /**
     * Return the desktop sign up button
     * @returns {AnchorElement} A page object.
     */
    signMeUpDesktopAnchor() {
        return new AnchorElement(this.selector + ' .customer-club-signup__form__button--inline > button');
    }

    /**
     * Return the hand sign up button
     * @returns {AnchorElement} A page object.
     */
    signMeUpHandsAnchor() {
        return new AnchorElement(this.selector + ' .customer-club-signup__form__button--block > button');
    }

    /**
     * Return the terms & conditions link
     * @returns {AnchorElement} A page object.
     */
    termsAndConditionsAnchor() {
        return new AnchorElement(this.selector + ' .customer-club-signup__form__anchor');
    }

    /**
     * Return the terms & conditions label
     * @returns {BaseElement} A page object.
     */
    termsAndConditions() {
        return new LabelElement(this.selector + ' .customer-club-signup__form__terms > label');
    }

    /**
     * Return the terms & conditions div with the error class
     * @returns {BaseElement} A page object.
     */
    termsAndConditionsError() {
        return new BaseElement(this.selector + ' .customer-club-signup__form__terms.error');
    }

    /**
     * Get custom styling for the desktop sign up button
     * @returns {Promise} A promise that resolves into custom properties.
     */
    getCustomStylesSignMeUpDesktopAnchor() {
        const properties = ['color', 'background-color', 'border-width', 'border-color', 'padding'];
        const selector = this.selector + ' .customer-club-signup__form__button--inline > button';

        return CustomPosition.getCustomPosition(selector, this.getBrowser(), properties);
    }

    getSliderWrapper() {
        return new BaseComponent(this.selector + ' [data-autoplay-delay]');
    }
}
module.exports = CustomerClubSignUp;
