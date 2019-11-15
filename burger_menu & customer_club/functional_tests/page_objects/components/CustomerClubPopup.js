const BaseComponent = require('./BaseComponent');
const TextElement = require('./../elements/Text');
const BaseElement = require('./../elements/BaseElement');
const InputElement = require('./../elements/Input');
const ButtonElement = require('./../elements/Button');
const AnchorElement = require('./../elements/Anchor');
const CheckboxElement = require('./../elements/Checkbox');

class CustomerClubPopup extends BaseComponent {

    /**
     * Customer Service Widget Component
     * @constructor
     */
    constructor() {
        super();
        this.selector = '.customer-club-popup';
    }

    /**
     * Return the div containing the background image
     * @returns {BaseElement} A page object.
     */
    divBackgroundImage() {
        return new BaseElement(this.selector + ' .customer-club-popup__background');
    }

    /**
     * Return the firstname input
     * @returns {InputElement} A page object.
     */
    firstName() {
        return new InputElement(this.selector + ' .customer-club-popup__form__firstname > input');
    }

    /**
     * Return the firstname div with the error class
     * @returns {BaseElement} A page object.
     */
    firstNameError() {
        return new BaseElement(this.selector + ' .customer-club-popup__form__firstname.error');
    }

    /**
     * Return the firstname input
     * @returns {InputElement} A page object.
     */
    lastName() {
        return new InputElement(this.selector + ' .customer-club-popup__form__lastname > input');
    };

    /**
     * Return the lastname div with the error class
     * @returns {BaseElement} A page object.
     */
    lastNameError() {
        return new BaseElement(this.selector + ' .customer-club-popup__form__lastname.error');
    };

    /**
     * Return the email input
     * @returns {InputElement} A page object.
     */
    email() {
        return new InputElement(this.selector + ' .customer-club-popup__form__email > input');
    };

    /**
     * Return the email div with the error class
     * @returns {BaseElement} A page object.
     */
    emailError() {
        return new BaseElement(this.selector + ' .customer-club-popup__form__email.error');
    };

    /**
     * Return the first step header text element
     * @returns {TextElement} A page object.
     */
    firstHeader() {
        return new TextElement(this.selector + ' .customer-club-popup__firstheader');
    };

    /**
     * Return the extra message text element
     * @returns {TextElement} A page object.
     */
    firstExtraMessage() {
        return new TextElement(this.selector + ' .widget-customer-club__text--markdown:first-of-type > p');
    };

    /**
     * Gets the markdown headline (h1) for the widget content step
     *
     * @returns {BaseElement} A page object.
     */
    getMarkdownHeadlineWidgetContent() {
        return this._getMarkdownElement('h1');
    }

    /**
     * Gets the markdown headline (h1) for the widget thank you step
     *
     * @returns {BaseElement} A page object.
     */
    getMarkdownHeadlineThankYouMessage() {
        return this._getMarkdownElement('h1', 'second-of-type');
    }

    /**
     * Gets the markdown header (h2) for the widget content step
     *
     * @returns {BaseElement} A page object.
     */
    getMarkdownHeaderWidgetContent() {
        return this._getMarkdownElement('h2');
    }

    /**
     * Gets the markdown header (h2) for the widget thank you step
     *
     * @returns {BaseElement} A page object.
     */
    getMarkdownHeaderThankYouMessage() {
        return this._getMarkdownElement('h2', 'second-of-type');
    }

    /**
     * Gets the markdown subheader (h3) for the widget content step
     *
     * @returns {BaseElement} A page object.
     */
    getMarkdownSubHeaderWidgetContent() {
        return this._getMarkdownElement('h3');
    }

    /**
     * Gets the markdown subheader (h3) for the widget thank you step
     *
     * @returns {BaseElement} A page object.
     */
    getMarkdownSubHeaderThankYouMessage() {
        return this._getMarkdownElement('h3', 'second-of-type');
    }

    _getMarkdownElement(elementSelector, pseudoSelector) {
        return new BaseElement(`${this.selector} .widget-customer-club__text--markdown:${pseudoSelector ? pseudoSelector : 'first-of-type'} > ${elementSelector}`);
    }

    /**
     * Return the first markdown header found
     * @returns {TextElement} A page object.
     */
    markdownHeadlineFirst() {
        return new TextElement(this.selector + ' .widget-customer-club__text--markdown--palm-hidden:first-of-type > h1');
    }

    /**
     * Return the 'thank you' step header text element
     * @returns {TextElement} A page object.
     */
    secondHeader() {
        return new TextElement(this.selector + ' .customer-club-popup__secondheader');
    }

    /**
     * Return the 'thank you' step brand content text element
     * @returns {TextElement} A page object.
     */
    brandContent() {
        return new TextElement(this.selector + ' .customer-club-popup__brandcontent');
    }

    /**
     * Return the 'thank you' step extra message text element
     * @returns {TextElement} A page object.
     */
    extraMessage() {
        return new TextElement(this.selector + ' .widget-customer-club__text--markdown:nth-of-type(2)');
    }

    /**
     * Return the desktop sign up button
     * @returns {AnchorElement} A page object.
     */
    signMeUpDesktopAnchor() {
        return new AnchorElement(this.selector + ' .customer-club-popup__form__button--inline > button');
    }

    /**
     * Return the hand sign up button
     * @returns {AnchorElement} A page object.
     */
    signMeUpHandsAnchor() {
        return new AnchorElement(this.selector + ' .customer-club-popup__form__button--block > button');
    }

    /**
     * Return the terms & conditions link
     * @returns {AnchorElement} A page object.
     */
    termsAndConditionsAnchor() {
        return new AnchorElement(this.selector + ' .customer-club-popup__form__anchor');
    }

    /**
     * Return the terms & conditions label
     * @returns {BaseElement} A page object.
     */
    termsAndConditions() {
        return new BaseElement(this.selector + ' .customer-club-popup__form__terms > label');
    }

    /**
     * We create this helper methods because clicking on termsAndConditions label was sometimes opening
     * the terms and conditions pop (like clicking int he link inside the label)
     * @returns {BaseElement} A page element
     */
    termsAndConditionsCheckbox() {
        return new CheckboxElement(this.selector + ' .customer-club-popup__form__terms > input');
    }

    /**
     * Return the terms & conditions div with the error class
     * @returns {BaseElement} A page object.
     */
    termsAndConditionsError() {
        return new BaseElement(this.selector + ' .customer-club-popup__form__terms.error');
    }

    /**
     * Return the close button
     * @returns {ButtonElement} A page object.
     */
    closeButton() {
        return new ButtonElement(this.selector + ' .customer-club-popup__close');
    }

    /**
     * Helper method that will close the cookie policy if its visible.
     * There is no need ot check for visibility outside the component.
     * @return {Promise} a promise that the cookie policy will be closed
     */
    async close() {
        let isVisible = await this.closeButton().isVisible();

        if (isVisible) {
            return this.closeButton().click();
        }
    }

    /**
     * Return the "Already a member" link
     * @returns {AnchorElement} A page object.
     */
    alreadyMember() {
        return new AnchorElement(this.selector + ' .customer-club-popup__signed-in');
    }

    /**
     * Return the second step
     * @returns {TextElement} A page object.
     */
    secondStep() {
        return new TextElement(this.selector + ' .customer-club-popup__form--second-step');
    }

    /**
     * Return the markup text
     * @returns {TextElement} A page object.
     */
    markup() {
        return new TextElement(this.selector + ' .customer-club-popup__markup');
    }

    /**
     * Return the popup overlay
     * @returns {BaseElement} A page object.
     */
    overlay() {
        return new BaseElement(this.selector + ' .customer-club-popup__overlay');
    }
}

module.exports = CustomerClubPopup;
