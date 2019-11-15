'use strict';

const domCaching = require('../../../app_bse_core/cartridge/js/util/dom_caching');

/**
 * Module for popups, intended to cover all requirements
 * @module
 */
const popup = (() => {
    const SHOW_POPUP_CLASSNAME = 'js-popup--show';
    const HIDE_POPUP_ATTRIBUTE = 'js-popup--hide';

    /**
     * Handle click events.
     * @param {MouseEvent} event - Click event.
     */
    function clickHandler(event) {
        let element = event.target;

        while (element && element.nodeType === 1) {
            const trigger = element.getAttribute('data-trigger') || '';

            if (trigger && triggerAction(trigger, element)) {
                // We need to call preventDefault() and stopPropagation() to be aligned with previous JQuery implementation.
                event.preventDefault();
                event.stopPropagation();
                return;
            }

            element = element.parentNode;
        }
    }

    /**
     * Perform trigger action when relevant.
     * @param {String} trigger - Value of data-trigger attribute.
     * @param {HTMLElement} element - Current element.
     * @returns {Boolean} - Indication if action has been performed.
     */
    function triggerAction(trigger, element) {
        if (trigger.indexOf(SHOW_POPUP_CLASSNAME) > -1) {
            popupShowHandler(element);
            return true;
        } else if (trigger.indexOf(HIDE_POPUP_ATTRIBUTE) > -1) {
            popupHideHandler(element);
            return true;
        }

        return false;
    }

    /**
     * Handler for popup hiding elements.
     * @param {HTMLElement} element - Hide button.
     */
    function popupHideHandler(element) {
        const popup = domCaching.closestByClass(element, SHOW_POPUP_CLASSNAME);
        hidePopup(popup);
    }

    /**
     * Handler for popup showing elements.
     * @param {HTMLElement} element - Show button.
     */
    function popupShowHandler(element) {
        const href = element.href || '';
        const index = href.indexOf('#');
        let popup;

        if (index >= 0) {
            popup = document.querySelector(href.substr(index));
        } else {
            popup = domCaching.closestByClass(element, SHOW_POPUP_CLASSNAME);
        }

        showPopup(popup);
    }

    /**
     * Show a popup.
     * @param {HTMLElement} node - Element that needs to be shown.
     */
    function showPopup(node) {
        if (node) {
            node.classList.add(SHOW_POPUP_CLASSNAME);
        }
    }

    /**
     * Hide a popup.
     * @param {HTMLElement} node - Element that needs to be hidden.
     */
    function hidePopup(node) {
        if (node) {
            node.classList.remove(SHOW_POPUP_CLASSNAME);
        }
    }

    return {
        init: function() {
            // Attaching click listener directly to document does not work in PhantomJS.
            document.body.addEventListener('click', clickHandler);
        },

        show: showPopup,
        hide: hidePopup,

        click: clickHandler
    };
})();

module.exports = popup;
