'use strict';

const BaseComponent = require('./BaseComponent');
const TextElement = require('../elements/Text');
const InputElement = require('./../elements/Input');

/**
 * Customer Club Widget Component
 */
class CustomerClubWidget extends BaseComponent {
    constructor(selector) {
        super(selector);
    }

    /**
     * Gets the header element
     * @returns {TextElement} A text element.
     */
    header() {
        return new TextElement(this.selector + ' .customer-club-widget__header');
    }

    /**
     * Gets the message element
     * @returns {TextElement} A text element.
     */
    message() {
        return new TextElement(this.selector + ' [class^=widget-customer-club__text]');
    }

    /**
     * Gets the markup element
     * @returns {TextElement} A text element.
     */
    markup() {
        return new TextElement(this.selector + ' .customer-club-widget__markup [class^=widget-customer-club__text]');
    }

    /**
     * Gets the date of birth field in the first step element
     * @returns {TextElement} A text element.
     */
    firstStepDateOfBirthField() {
        return new TextElement(this.selector + ' .customer-club-widget__form-first-step .customer-club-widget__form__birthdate');
    }

    /**
     * Gets the gender field in the first step element
     * @returns {TextElement} A text element.
     */
    firstStepGenderField() {
        return new TextElement(this.selector + ' .customer-club-widget__form-first-step .customer-club-widget__form__gender');
    }

    /**
     * Gets the city field in the second step element
     * @returns {TextElement} A text element.
     */
    secondStepCityField() {
        return new TextElement(this.selector + ' .customer-club-widget__form-second-step .customer-club-widget__form__city');
    }

    /**
     * Gets the city field in the second step element
     * @returns {TextElement} A text element.
     */
    secondStepPhoneNumberField() {
        return new TextElement(this.selector + ' .customer-club-widget__form-second-step .customer-club-widget__form__phone-number');
    }

    /**
     * Gets the signed in label element
     * @returns {TextElement} A text element.
     */
    signedInLabel() {
        return new TextElement(this.selector + ' .customer-club-widget__signed-in');
    }

    /**
     * Gets the thank you message element
     * @returns {TextElement} A text element.
     */
    thankYouMessage() {
        return new TextElement(this.selector + ' .customer-club-widget__thank-you-message [class^=widget-customer-club__text]');
    }

    /**
     * Return the firstname input
     * @returns {InputElement} A page object.
     */
    firstName() {
        return new InputElement(this.selector + ' .customer-club-widget__form__firstname > input');
    }

    /**
     * Return the firstname input
     * @returns {InputElement} A page object.
     */
    lastName() {
        return new InputElement(this.selector + ' .customer-club-widget__form__lastname > input');
    }

    /**
     * Return the email input
     * @returns {InputElement} A page object.
     */
    email() {
        return new InputElement(this.selector + ' .customer-club-widget__form__email > input');
    }

}

module.exports = CustomerClubWidget;
