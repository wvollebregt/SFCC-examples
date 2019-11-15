'use strict';

var $ = require('jquery');
var popup = require('./popup');
var cookies = require('./base/cookies');
var TermsConditions = require('./ui-control/terms_conditions');
var termsConditionsType = require('./ui-control/terms_conditions_type');
var utils = require('./util');
var domCaching = require('./util/dom_caching');
var swiper = require('./ui-control/swiper');

/**
 * Module for Customer club popup/overlay, tie-in is `class='js-customer-club__popup'`, shows
 * on page load, `class='js-customer-club__overlay'` shows on customer club signup submit
 *
 * @module
 */
var CustomerClub = (function($) {
    var CUSTOMER_CLUB_INPUT_SELECTOR = '.customer-club-%customerClubType%__form__%paramName% input';
    var PREFILLING_CUSTOMER_CLUB_PARAMS = ['firstname', 'lastname', 'email'];
    var PREFILLING_CUSTOMER_CLUB_TYPES = ['popup', 'signup', 'widget'];
    var CUSTOMER_CLUB_PARAMS_PREFIX = 'customer_club_';
    var CLOSE_COOKIE_NAME = 'customer_club_closed';
    var CLOSE_COOKIE_DURATION = 4 * 7; // 4 weeks
    var SIGNED_COOKIE_NAME = 'customer_club_signed';
    var SIGNED_COOKIE_DURATION = 365; // 1 year
    var COOKIE_PATH = '/';
    var closePopupTimeout = 5000; // 5 seconds
    var removeFromDOMTimeout = 600; // 600 milliseconds
    var $formClasses;
    var closeClasses = '.js-overlay-close, .lightbox-overlay-close';
    var closeClass = '.js-customer-club--close';
    var signedClass = '.js-customer-club--signed';
    var popupClass = '.js-customer-club__popup';
    var overlayClass = '.js-customer-club__overlay';
    var signupClass = '.js-customer-club__signup';
    var widgetClass = '.js-customer-club__widget';
    var lightboxOverlay = '.js-lightbox-overlay';
    var secondStepPopUp = '.js-customer-club-popup__second-step';
    var LIGHTBOX_TERMS_SELECTOR = '#lightbox-terms';
    var styleGenerator = require('./style_generator');
    var validator = require('./validator');
    var executeRegister = false;

    var cachedQuerySelector = domCaching.cachedQuerySelector;
    var eventFilter = domCaching.eventFilter;
    var closest = domCaching.closest;
    var getButton = cachedQuerySelector(closeClass, false);
    var getCustomerPopup = cachedQuerySelector(popupClass, false);
    var getTerms = cachedQuerySelector(LIGHTBOX_TERMS_SELECTOR, false);
    var getLightBoxOverlay = cachedQuerySelector(lightboxOverlay, false);
    var switchClass = domCaching.switchClass;

    /**
     * Check for existing cookie that indicates we should not show the popup.
     *
     * @returns {boolean} - True if cookie exists
     */
    function hasCookie() {
        var closeCookieValue = cookies.get(CLOSE_COOKIE_NAME);
        var signedCookieValue = cookies.get(SIGNED_COOKIE_NAME);

        // at least 1 cookie is set to true
        if (closeCookieValue || signedCookieValue) {
            return true;
        }

        // no cookies are set
        return false;
    }

    /**
     * Set a cookie on closing the dialog
     *
     */
    function popupCloseCookieHandler() {
        cookies.set(CLOSE_COOKIE_NAME, true, CLOSE_COOKIE_DURATION, COOKIE_PATH);
    }

    /**
     * Set a cookie on closing the dialog as signed user
     *
     */
    function popupSignedCookieHandler() {
        cookies.set(SIGNED_COOKIE_NAME, true, SIGNED_COOKIE_DURATION, COOKIE_PATH);
    }

    /**
     * Clear the customer club sign up form
     */
    function clearSignupForm() {
        // Clear the forms
        $formClasses.find('.form__input-text').val('').removeClass('valid');
        $formClasses.find('.form__input-checkbox').removeAttr('checked');
    }

    /**
     * Send the dataLayer event for successful newsletter subscription
     */
    function sendDataLayerNewsletterSubscriptionEvent() {
        window.dataLayer.push({
            event: 'interaction',
            interaction: {
                category: 'Newsletter',
                action: 'Sign Up',
                label: '',
                value: 1
            }
        });
    }

    /**
     * Do the ajax call to register the new member without the second step for either customer club pop up or sign up
     * @param {*} data - The origin of the event.
     */
    function registerWithoutSecondStep(data) {
        var element = document.querySelector(lightboxOverlay);

        // Checking if it comes from the close overlay click event
        if (typeof data !== 'string' && !(data instanceof String) && data.originalEvent instanceof window.Event) {
            data = 'signup';
        }

        if (executeRegister) {
            $.ajax({
                type: 'POST',
                url: window.Urls.newsletterSubscribe,
                data: $('.customer-club-' + data + '__form').serialize()
            })
            .done(function() {
                // setting to false in order to prevent the user from sending multiple requests
                executeRegister = false;

                if (data === 'popup' || data === 'widget') {
                    // Show the 'Thank you' step
                    $(popupClass + ' .swiper-container,' + widgetClass + ' .swiper-container')[0].swiper.slideNext();

                    // Close the popup after a few seconds
                    setTimeout(function() {
                        popup.click({target: document.querySelector(signedClass)});
                    }, closePopupTimeout);

                    // track successful newsletter subscription from the customer club popup
                    sendDataLayerNewsletterSubscriptionEvent();
                } else {
                    clearSignupForm();

                    // Removing the overlay from the DOM when animation ends
                    if (element) {
                        removeOverlayFromDOM(element);
                    }
                }
            });
        } else {
            if (element) {
                removeOverlayFromDOM(element);
            }
        }
    }

    /**
    * Go to the thank you step for the customer club WIDGET
    */
    function customerClubWidgetThankYouStep() {
        $('.js-customer-club-widget__thank-you-step').on('click', function() {
            $(widgetClass + ' .swiper-container')[0].swiper.slideNext();
        });
    }

    /**
     * Show second step and do the ajax call to register the new member with the second step info for the customer club pop up
     */

    function registerWithSecondStepPopUp() {
        // Show the 'Second Step' step
        $(popupClass + ' .swiper-container')[0].swiper.slideNext();

        // On submitting second step do ajax call to register the new member with the second step
        $(popupClass + ' form').on('submit', function(event) {
            event.preventDefault();

            validator.initForm(popupClass + ' form');

            if (!validator.isValid(popupClass + ' form')) {
                return;
            }

            $.ajax({
                type: 'POST',
                url: window.Urls.newsletterSubscribeLong,
                data: $('.customer-club-' + popupClass + '__form').serialize()
            }).done(function() {
                // Set to false because we don't want to fire the click event on close
                executeRegister = false;

                clearSignupForm();

                // Show the 'Thank you' step
                $(popupClass + ' .swiper-container')[0].swiper.slideNext();

                // Close the popup after a few seconds
                setTimeout(function() {
                    popup.click({target: document.querySelector(signedClass)});
                }, closePopupTimeout);

                // track successful newsletter subscription from the customer club popup
                sendDataLayerNewsletterSubscriptionEvent();
            });
        });
    }

    /**
     * Do the ajax call to register the new member with the second step info for the customer club sign up
     */
    function registerWithSecondStepSignUp() {
        $.ajax({
            type: 'POST',
            url: window.Urls.newsletterSubscribeLong,
            data: $('.customer-club-signup__form, .customer-club-overlay__form, .customer-club-widget__form').serialize()
        }).done(function() {
            // Set to false because we don't want to fire the click event on close
            executeRegister = false;

            clearSignupForm();

            // Show the 'Thank you' step
            $(overlayClass + ' .swiper-container,' + widgetClass + ' .swiper-container')[0].swiper.slideNext();

            // Close the popup after a few seconds
            setTimeout(function() {
                var element = getLightBoxOverlay();

                if (element) {
                    removeOverlayFromDOM(element);
                }
            }, closePopupTimeout);
        });
    }

    /**
     * Do the ajax call to render the second step
     */
    function renderSecondStep() {
        $.ajax({
            type: 'GET',
            url: window.Urls.getCustomerOverlay
        })
        .done(function(data) {
            var $content = $(data);
            $($content).insertAfter('.customer-club-signup');

            var overlay = document.querySelector('#customer-club-overlay');
            registerChangeEvents(overlay);
            registerOverlayClickEvent();

            // We generate the style because we have a background image in the inserted content
            styleGenerator(overlay);
            window.location.hash = '#customer-club-overlay';

            var swipers = document.querySelectorAll('.js-customer-club__overlay .swiper-container, .js-customer-club__widget .swiper-container');
            var swiperOptions = {
                loop: false,
                autoplayDelay: 0
            };
            for (var i = 0; i < swipers.length; i++) {
                swiper.initForElement(swipers[i], swiperOptions);
            }

            $('form', overlayClass).on('submit', function(event) {
                event.preventDefault();

                validator.initForm(overlayClass + ' form');

                if (validator.isValid(overlayClass + ' form')) {
                    registerWithSecondStepSignUp();
                }

                // track successful newsletter subscription from the customer club widget
                sendDataLayerNewsletterSubscriptionEvent();
            });
        });
    }

    /**
     * Register overlay click event so that we can send the info when clicking on close
     */
    function registerOverlayClickEvent() {
        $(closeClasses).on(
            'click touchstart',
            registerWithoutSecondStep
        );
    }

    /**
     * Register onchange events on form fields to cause a repaint. Patches an iOS bug with
     * position fixed elements disappearing.
     *
     * Using a select causes elements to, sometimes, disappear. Scrolling causes iOS to
     * repaint the affected elements.
     * @param {HTMLElement} overlay - The overlay.
     */
    function registerChangeEvents(overlay) {
        var fields = overlay.querySelectorAll('select');
        var causeRepaint = function() {
            var x = document.body.scrollLeft;
            var y = document.body.scrollTop;

            window.scrollTo(x, y + 1);
            overlay.classList.add('js-causeRepaint');

            window.requestAnimationFrame(function() {
                window.scrollTo(x, y);
                overlay.classList.remove('js-causeRepaint');
            });
        };

        var i;
        for (i = 0; i < fields.length; ++i) {
            fields[i].addEventListener('change', causeRepaint);
        }
    }

    var customerClubStatic = {
        init: function() {
            bindWindowEventToggle();

            var popupElement = document.querySelector(popupClass);
            var signupElement = document.querySelector(signupClass);
            $formClasses = $('.js-customer-club__popup form, .js-customer-club__signup form, .js-customer-club__overlay form, .js-customer-club__widget form');

            $formClasses.on('submit', function(event) {
                event.preventDefault();
                var formName = $(this).attr('class').split('-')[2].split('_')[0];
                var secondStepForm = '.customer-club-' + formName + '__form';
                var secondStepSignUp = document.querySelector('.js-customer-club__' + formName).getAttribute('data-show-additional-fields') === 'true';
                var secondStepPopUpElement = document.querySelector(secondStepPopUp);
                var submitOnPopup = (formName === 'popup');
                var submitOnSignUp = (formName === 'signup');

                executeRegister = true;

                validator.initForm(secondStepForm);

                if (validator.isValid(secondStepForm)) {
                    if (secondStepSignUp && submitOnSignUp) {
                        renderSecondStep();
                    } else if (secondStepPopUpElement && submitOnPopup) {
                        registerWithSecondStepPopUp();
                    } else {
                        registerWithoutSecondStep(formName);
                    }
                }
            });

            if ($formClasses.length) {
                var termsConditions = new TermsConditions(
                    document.querySelector(termsConditionsType.GENERAL_CONTEXT),
                    document.querySelector(signupClass + ' .js-lightbox-overlay--customer-club'),
                    termsConditionsType.CUSTOMER_CLUB_TERMS
                );
                termsConditions.startup();
            }

            if (!hasCookie() && popupElement) {
                loadDeferredStyles(popupElement);
                popup.show(popupElement);

                var termsConditionsPopup = new TermsConditions(
                    document.querySelector(termsConditionsType.GENERAL_CONTEXT),
                    popupElement.querySelector('.js-lightbox-overlay--customer-club'),
                    termsConditionsType.CUSTOMER_CLUB_TERMS
                );
                termsConditionsPopup.startup();

                $(closeClass).on(
                    'click touchstart',
                    popupCloseCookieHandler
                );

                $(signedClass).on(
                    'click touchstart',
                    popupSignedCookieHandler
                );
            }

            if (signupElement) {
                loadDeferredStyles(signupElement);
            }

            customerClubWidgetThankYouStep();

            prefillCustomerClubForms();
        }
    };

    /**
     * Appends data-style-generator and generates style to HTMLElements which should have
     * images loaded
     *
     * @param {HTMLElement} element HTML Element
     */
    function loadDeferredStyles(element) {
        // defer image loading until popup is shown
        var styleAttribute = 'data-style-generator';
        var generateStyle = false;
        var backgroundElement = element.querySelector('.js-customer-club-background');
        if (element.getAttribute(styleAttribute) === null) {
            element.setAttribute(styleAttribute, '');
            generateStyle = true;
        }
        if (backgroundElement !== null && backgroundElement.getAttribute(styleAttribute) === null) {
            backgroundElement.setAttribute(styleAttribute, '');
            generateStyle = true;
        }
        if (generateStyle) {
            styleGenerator(element.parentNode);
        }
    }

    /**
     * Returns the customer club GET params from URL if there are some
     * @returns {{}} - GET Customer Club params from URL
     */
    function getCustomerClubParamsFromURL() {
        var urlParams = utils.getQueryStringParams(window.location.href);
        var params = {};

        // if we don't have any params no need to go further
        if (!Object.keys(urlParams).length) {
            return params;
        }

        // retrieve only the parameters that we need if there any
        for (var paramIndex = 0; paramIndex < PREFILLING_CUSTOMER_CLUB_PARAMS.length; paramIndex++) {
            var paramName = PREFILLING_CUSTOMER_CLUB_PARAMS[paramIndex];
            var prefixedParamName = CUSTOMER_CLUB_PARAMS_PREFIX + paramName;

            if (urlParams.hasOwnProperty(prefixedParamName)) {
                params[paramName] = urlParams[prefixedParamName];
            }
        }

        return params;
    }

    /**
     * Retrieves NodeList with inputs that should be filled with data of provided parameter
     * @param {String} paramName - parameter name for which inputs should be retrieved (example: email, firstname, lastname)
     * @returns {NodeList} - list of customer club inputs for provided parameter
     */
    function getCustomerClubFormsInputs(paramName) {
        var selector = CUSTOMER_CLUB_INPUT_SELECTOR.replace('%paramName%', paramName);
        var selectors = [];

        for (var i = 0; i < PREFILLING_CUSTOMER_CLUB_TYPES.length; i++) {
            selectors.push(selector.replace('%customerClubType%', PREFILLING_CUSTOMER_CLUB_TYPES[i]));
        }

        return document.querySelectorAll(selectors.join(', '));
    }

    /**
     * Prefills the Customer Club Forms with data provided as GET params within URL
     */
    function prefillCustomerClubForms() {
        var params = getCustomerClubParamsFromURL();

        // get the available param keys
        var paramsKeys = Object.keys(params);

        // iterate through params and fill the forms
        for (var paramKeyIndex = 0; paramKeyIndex < paramsKeys.length; paramKeyIndex++) {
            var paramKey = paramsKeys[paramKeyIndex];
            var fields = getCustomerClubFormsInputs(paramKey);
            fillCustomerClubParam(fields, params[paramKey]);
        }
    }

    /**
     * Puts data into according Customer Club forms input fields
     * @param {?Array} fields - Customer Club fields that should be filled with passed value
     * @param {String} value - Customer Club value that should be passed
     */
    function fillCustomerClubParam(fields, value) {
        for (var fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
            fields[fieldIndex].value = value;
        }
    }

    /**
     * Removes the popup overlay from DOM
     * @param {String} element - the element to be removed
     */
    function removeOverlayFromDOM(element) {
        element.style.opacity = 0;

        setTimeout(function() {
            window.location.hash = '#';
            element.parentNode.removeChild(element);
        }, removeFromDOMTimeout);
    }

    /**
     * Check if the popup is visible or not.
     *
     * @return {boolean} - true if popup is open, false if not
     */
    function isPopupOpen() {
        var popup = getCustomerPopup();
        return popup && popup.classList.contains('js-popup--show');
    }

    /**
     * Verify if an event is targeting the close button, or another child of its parent.
     *
     * @param {Event} event - The event to check against
     * @return {boolean} - true if the event target is the popup close button.
     */
    function isButtonEvent(event) {
        return closest(event.target, getButton(), 3) >= 0; // click on Popup Close Button
    }

    /**
     * Checks if close action coming from terms
     * @param {Event} event - The event to toggle lightbox
     * @return {boolean} -
     */
    function isTermsEvent(event) {
        return closest(event.target, getTerms()) >= 0;
    }

    /**
     * Toggle menu between open and closed.
     */
    function toggle() {
        var element = getLightBoxOverlay();
        switchClass(getCustomerPopup(), 'js-popup', 'js-popup--show');

        if (element) {
            window.location.hash = '#';
            element.parentNode.removeChild(element);
        }
    }

    /**
     * Bind events to the windows to close the popup when a non-relevant click is triggered.
     */
    function bindWindowEventToggle() {
        var filteredEvent = eventFilter(
            function(event) {
                return !isButtonEvent(event) &&
                    isPopupOpen() &&
                    !isTermsEvent(event) &&
                    closest(event.target, getCustomerPopup(), 10) < 0 // is not close button click
                ;
            },

            function(event) {
                // the data layer should not capture the event when the popup is closing
                event.stopPropagation();

                toggle();
            }
        );

        document.documentElement.addEventListener('click', filteredEvent);
        document.documentElement.addEventListener('tap', filteredEvent);
    }

    return customerClubStatic;
}($));

module.exports = CustomerClub;
