'use strict';

// Used for firing a new CustomEvent
require('custom-event-polyfill');

const ACTIVE_STATE_CLASS = 'servicebar__menu-toggle--active';
const INACTIVE_STATE_CLASS = 'servicebar__menu-toggle';
const transitionend = require('./util/transitionend');
const lazyLoading = require('./ui-control/lazy_loading');

// Utility functions
const domCaching = require('./util/dom_caching');
const cachedQuerySelector = domCaching.cachedQuerySelector;
const eventFilter = domCaching.eventFilter;
const closest = domCaching.closest;
const switchClass = domCaching.switchClass;

// Object caching
const getCurtain = cachedQuerySelector('.js-curtain');
const getButton = cachedQuerySelector('.js-burger-menu-button');
const getLayeredCloseButton = cachedQuerySelector('.js-burger-menu-layered-close');
const getBurgerMenu = cachedQuerySelector('.js-burger-menu');
const getContentWrapper = cachedQuerySelector('.js-content-wrapper');
const getMenuSimpleSearchInput = cachedQuerySelector('.js-burger-menu .js-simple-search-input');

// Helper functions
const CONSTANT = {
    LAYERED_MENU_CLASSNAME: 'js-burger-menu-layered',
    LAYERED_MENU_INDEX_ATTRIBUTE: 'data-active-menu-layer'
};

/**
 * Check if the menu is in active state or not.
 *
 * @return {boolean} - true if burgerMenu is open, false if not
 */
function isActiveMenuState() {
    const button = getButton();

    // has button and has active class!
    return !!button && button.classList.contains(ACTIVE_STATE_CLASS);
}

/**
 * Verify if an event is targeting the menu-button, or a child there-of.
 *
 * @param {Event} event - The event to check against
 * @return {boolean} - true if the event target is the menu button.
 */
function isButtonEvent(event) {
    return closest(event.target, getLayeredCloseButton(), 3) >= 0 || closest(event.target, getButton(), 3) >= 0; // isBurgerButtonClick
}

/**
 * Toggle menu between open and closed.
 *
 */
function toggle() {
    const state = isActiveMenuState();
    const burgerMenuMarketingImage = document.querySelector('.js-burger-menu-marketing-widget__img');

    initLayeredMenuState();

    if (state) { // closing the menu
        switchClass(document.body, 'nav-is-closed-body', 'nav-is-open-body');
        switchClass(getContentWrapper(), 'nav-is-closed', 'nav-is-open');
        switchClass(getCurtain(), 'nav-is-closed-curtain', 'nav-is-open-curtain');
        switchClass(getButton(), INACTIVE_STATE_CLASS, ACTIVE_STATE_CLASS);
    } else { // opening the menu
        switchClass(document.body, 'nav-is-open-body', 'nav-is-closed-body');
        switchClass(getContentWrapper(), 'nav-is-open', 'nav-is-closed');
        switchClass(getCurtain(), 'nav-is-open-curtain', 'nav-is-closed-curtain');
        switchClass(getButton(), ACTIVE_STATE_CLASS, INACTIVE_STATE_CLASS);

        // lazyload the image for the burger-menu-marketing widget
        if (burgerMenuMarketingImage) {
            lazyLoading.lazyLoadImage(burgerMenuMarketingImage);
        }
    }

    triggerMenuStateEvent(state);
}

/**
 * Triggers menu state change on the burger menu DOM element.
 * Event for menu opened is 'burger-menu-opened'. For closed - 'burger-menu-closed'.
 *
 * @param {Boolean} state - burger menu open state
 */
function triggerMenuStateEvent(state) {
    const eventName = 'burger-menu-' + (state ? 'closed' : 'opened');
    const event = new CustomEvent(eventName);

    document.documentElement.dispatchEvent(event);
}

// Event initialisers

/**
 * Bind events to the button for toggling menu on and off.
 *
 */
function bindButtonToggle() {
    const buttonToggleFilteredEvent = eventFilter(
        isButtonEvent,

        function(event) {
            // the data layer should not capture the event when the menu is closing
            if (isActiveMenuState()) {
                event.stopPropagation();
            }

            event.preventDefault();
            toggle();
        }
    );

    document.documentElement.addEventListener('click', buttonToggleFilteredEvent);
    document.documentElement.addEventListener('tap', buttonToggleFilteredEvent);
}

/**
 * Bind events to the windows to close the menu when a non-relevant click is triggered.
 *
 */
function bindWindowEventToggle() {
    const filteredEvent = eventFilter(
        function(event) {
            return !isButtonEvent(event) &&
                    isActiveMenuState() &&
                    closest(event.target, getBurgerMenu(), 25) < 0 // !isBurgerButtonClick
            ;
        },

        function(event) {
            // the data layer should not capture the event when the menu is closing
            event.stopPropagation();

            toggle();
        }
    );

    document.documentElement.addEventListener('click', filteredEvent);
    document.documentElement.addEventListener('tap', filteredEvent);
}

/**
 * Prevent the touchstart event on anything other then the scrollable burger menu
 *
 */
function bindScrollPreventionEvents() {
    document.documentElement.addEventListener('touchmove', eventFilter(

        /**
         * Filter for only events on the curtain.
         * @param {Object} event - The event.
         * @returns {Boolean} A value indicating if this is a curtain event.
         */
        function filterTouchMove(event) {
            const isBurgerMenu = closest(event.target, getBurgerMenu(), 25) >= 0;
            return isActiveMenuState() && !isBurgerMenu;
        },

        /**
         * Cancel touchstart
         * @param {Object} event - The event.
         * @returns {Boolean} Returns false.
         */
        function touchStartOnCurtain(event) {
            event.preventDefault();
            return false;
        }
    ));
}

/**
 * Prevent "over scrolling", meaning if an element gets scrolled to the very top or
 * bottom, the scrolling does not continue over to the body, forcing the body to scroll,
 * hence preventing the rubber band effect.
 *
 */
function removeIOSRubberEffect() {
    const filteredEvent = eventFilter(

        /**
         * Filter for touchstart events on active burger menu
         * @param {Object} event - The event.
         * @returns {Bolean} A value indicating if we're on the active burger menu.
         */
        function rubberBandFilter(event) {
            const onlyOnBurgerMenu =
                isActiveMenuState() &&
                closest(event.target, getBurgerMenu(), 5) >= 0
            ;

            return onlyOnBurgerMenu;
        },

        /**
         * Apply a hack to scrollable menu to keep Safari overscroll from bubbling up.
         * @returns {Boolean} Returns false.
         */
        function rubberBandHack() {
            const target, top, totalScroll, currentScroll;

            target = getBurgerMenu();
            top = target.scrollTop;
            totalScroll = target.scrollHeight;
            currentScroll = top + target.offsetHeight;

            if (top === 0) {
                target.scrollTop = 1;
            } else if (currentScroll === totalScroll) {
                target.scrollTop = top - 1;
            }

            return false;
        }
    );

    document.documentElement.addEventListener('touchstart', filteredEvent);
}

/**
 * Toggles menu depending on the provided state. If state is false - menu would close if it's opened and
 * nothing will happen if menu is already closed. Vice versa for state is true
 *
 * If state is not provided it will just toggle the menu.
 *
 * @param {Boolean} [state] - toggle state
 */
function toggleMenu(state) {
    if (typeof state === 'undefined' || isActiveMenuState() !== state) {
        toggle();
    }
}

/**
 * Focuses on input from simple search
 */
function focusOnSimpleSearch() {
    const simpleSearchInput = getMenuSimpleSearchInput();

    simpleSearchInput.focus();
}

/**
 * Initialize state for layered menu
 * Reads category id from window.uncachedInformation.
 */
function initLayeredMenuState() {
    const categoryToOpen = window.uncachedInformation ? window.uncachedInformation.categoryIdForMenu : null;

    // if no category to open, leave as is.
    if (!categoryToOpen) {
        return;
    }

    showMenuCategoryRecursively(categoryToOpen);

    window.uncachedInformation.categoryIdForMenu = null;
}

/**
 * Function to scroll to menu header
 */
function scrollToHeader() {
    const element = document.getElementsByClassName(CONSTANT.LAYERED_MENU_CLASSNAME)[0];
    if (element.scrollTop >= 10) {
        element.scrollTop = 0;
    }
}

/**
 * Opens menu on category id inputted
 *
 * @param {String} categoryId - category id to be opened
 */
function showMenuCategoryRecursively(categoryId) {
    const layeredMenu = document.getElementsByClassName(CONSTANT.LAYERED_MENU_CLASSNAME)[0];

    // tries to find the menu group for the given category id
    const categoryElement = document.querySelector('ul.category-navigation__group[data-parent-id="' + categoryId + '"]');

    // if no group found, find the category menu item and get its parent
    if (!categoryElement) {
        categoryElement = (document.querySelector('li.category-navigation__item[data-category-id="' + categoryId + '"]') || {}).parentNode;

        // as no group for the given category found, updates category id value for opening parent group.
        categoryId = categoryElement ? categoryElement.getAttribute('data-parent-id') : null;
    }

    const menuLevel = categoryElement ? parseInt(categoryElement.getAttribute('data-menu-level'), 10) - 1 : 0;

    // opens from higher levels to lower levels, only update header for first iteration
    for (const i = 0; i < menuLevel; i++) {
        categoryId = showMenuCategory(layeredMenu, categoryId, (i !== 0));
    }
}

/**
 * Show menu category in menu
 *
 * @param {HTMLElement} layeredMenu - menu element
 * @param {String} categoryId - category id to be opened
 * @param {Boolean} [skipHeaderWrite = false] - boolean for skipping header write and menu level setter
 * @returns {*|string} - if opened element has a parent, returns its category id
 */
function showMenuCategory(layeredMenu, categoryId, skipHeaderWrite) {
    const childGroup = document.querySelector('.category-navigation__group[data-parent-id="' + categoryId + '"]');
    const layeredMenuIndex = childGroup ? Number(childGroup.getAttribute('data-menu-level')) : null;

    if (!layeredMenu || !childGroup) {
        return;
    }

    // the logic of adding and removing classes is spread out to category_navigation.js
    // There can be multiple previous levels from different childGroups with the same level number
    // The class for the forward animation should only be added to the parentGroup of the childGroup

    childGroup.classList.add('visible');
    childGroup.classList.remove('hidden', 'js-burger-menu__controls__close--backward');
    document.querySelector('.burger-menu__widgets').style.height = '0px';

    transitionendListenerFix(childGroup);

    if (!skipHeaderWrite) {
        updateHeader(layeredMenuIndex, childGroup);

        // setting attribute on menu, to it can open the desired layer
        layeredMenu.setAttribute(CONSTANT.LAYERED_MENU_INDEX_ATTRIBUTE, layeredMenuIndex);
    }

    const parentGroup = document.querySelector('li.category-navigation__item[data-category-id="' + categoryId + '"]');
    parentGroup = parentGroup ? (parentGroup.parentNode || parentGroup.parentElement) : null;

    if (parentGroup) {
        parentGroup.classList.add('js-burger-menu__controls__next--forward');
        return parentGroup.getAttribute('data-parent-id');
    }
}

/**
 * Update menu header by index
 *
 * @param {Number} layeredMenuIndex - index for updating the header
 * @param {HTMLElement} [childGroupCached] - group html element for avoiding extra selections
 */
function updateHeader(layeredMenuIndex, childGroupCached) {
    const childGroup = childGroupCached || document.querySelector('.category-navigation__group--level-' + layeredMenuIndex + '.visible');
    const headerElement = document.querySelector('div.burger-menu__controls .burger-menu__controls__category-label');
    if (childGroup) {
        headerElement.innerText = childGroup.getAttribute('data-parent-header');
    } else {
        headerElement.innerText = 'SHOP';
    }
}

/**
 * Add or remove class needed for IOS scrolling issue
 *
 * @param {element} categorylist - element of appearing category list
 */

function alterHeightIosDiv() {
    const iosFixDiv = document.querySelector('.js-burger-menu__IOS-scrolling-fix');
    const iosFixDivHeight = iosFixDiv.offsetHeight;

    if (iosFixDivHeight === 0) {
        iosFixDiv.style.height = '1px';
    } else {
        iosFixDiv.style.height = '0px';
    }
}

/**
 * Add transitionend listener and call alterHeight function
 *
 * @param {element} categorylist - element of appearing category list
 */

function transitionendListenerFix(categorylist) {
    const callback = function(e) {
        // Multiple transitions are listened to
        // We have to check the width because that transition has the longest duration
        if (e.propertyName !== 'width') {
            return;
        }
        alterHeightIosDiv();
        categorylist.removeEventListener(transitionend.addTransitionEndListener(categorylist, callback), callback);
    };

    // IOS DOM scrollheight scrolling issue fix
    transitionend.addTransitionEndListener(categorylist, callback);
}

/**
 * @module
 * @description module for burger menu (main site navigation)
 */
const burgerMenu = {
    init: function() {
        // events
        bindButtonToggle();
        bindWindowEventToggle();
        bindScrollPreventionEvents();
        removeIOSRubberEffect(); // Will not be triggered if touchStart stops propagation

        if (window.location.hash === '#menu') {
            this.toggleMenu(true);
        }
    },
    initLayeredMenuState: initLayeredMenuState,
    toggleMenu: toggleMenu,
    updateHeader: updateHeader,
    showMenuCategory: showMenuCategory,
    scrollToHeader: scrollToHeader,
    focusOnSimpleSearch: focusOnSimpleSearch,
    alterHeightIosDiv: alterHeightIosDiv,
    transitionendListenerFix: transitionendListenerFix
};

module.exports = burgerMenu;
