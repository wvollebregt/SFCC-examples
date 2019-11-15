'use strict';

var BaseComponent = require('./BaseComponent');
var SearchComponent = require('./Search');
var BurgerMenuCategorySection = require('./BurgerMenuCategorySection');
var ShopMoreBrandsComponent = require('../components/widgets/ShopMoreBrands');
var ButtonElement = require('../elements/Button');
var AnchorElement = require('../elements/Anchor');
var TextElement = require('../elements/Text');
var List = require('../elements/List');

/**
 * Burger Menu object.
 */
class BurgerMenu extends BaseComponent {

    /**
     * Burger Menu object.
     * @constructor
     * @extends BaseComponent
     */
    constructor() {
        super('.js-burger-menu');
    }

    /**
     * Search component of the burger menu.
     * @returns {SearchComponent} A page object.
     */
    search() {
        return new SearchComponent(this.selector + ' .search__control');
    }

    /**
     * Returns the button element that represents the burger the user actually clicks.
     * @returns {ButtonElement} A page object.
     */
    burgerButton() {
        return new ButtonElement('.js-burger-menu-button');
    }

    /**
     * Gets layered burger menu active level
     *
     * @returns {Promise} - promise with menu active level as result
     */
    layeredBurgerMenuLevel() {
        return this.getBrowser()
            .waitForVisible('.js-content-wrapper.nav-is-open')
            .waitForVisible('.js-burger-menu-layered')
            .getAttribute('.js-burger-menu-layered', 'data-active-menu-layer');
    }

    /**
     * Gets layered burger menu last visible group's parent id
     *
     * @returns {Promise} - promise with last visible group's parent id
     */
    selectedLayeredMenuGroupParentCategoryId() {
        return this.getBrowser()
            .waitForVisible('.js-content-wrapper.nav-is-open')
            .waitForVisible('.js-burger-menu-layered')
            .getAttribute('.burger-menu__layers .category-navigation__group.visible:last-child', 'data-parent-id');
    }

    /**
     * Clicks inside the menu area.
     * This is used to prove that clicking inside the menu area does not collapse the menu.
     * @returns {Promise} A promise that resolves by clicking in the menu.
     */
    clickMenu() {
        return this.getBrowser().execute(() => {
            document.querySelector('.js-category-navigation').click();
        });
    }

    /**
     * Clicks on the burger menu button to expand it.
     * This method waits until the animation is complete.
     * @returns {Promise} A promise that resolves by expanding the burger menu.
     */
    expand() {
        var _this = this;
        return this.burgerButton().click().then(function() {
            return _this.waitForVisibleWithinViewport();
        });
    }

    /**
     * Gets the html contents of the categories shown in the menu.
     * @returns {Promise} A promise that resolves into the names of the categories.
     */
    categoryNames() {
        return this.getBrowser()
            .getHTML(this.selector + ' .category-navigation__item:not(.js-hide__display) > .category-navigation__link');
    }

    /**
     * Gets the html contents of the main category links shown in the menu.
     * @returns {Promise} A promise that resolves into the names of the main category links.
     */
    mainCategoryLinks() {
        return this.getBrowser()
            .getHTML(this.selector + ' .category-navigation__group--level-1 > .category-navigation__item > .category-navigation__link');
    }

    /**
     * Gets the categories by a given level.
     * @param {Number} level - The level of categories.
     * @returns {ListElement} An element page object.
     */
    categoriesOfLevel(level) {
        return new List(this.selector + ' .category-navigation__section .category-navigation__group--level-' + level);
    }

    /**
     * Gets the category link of certain level by index.
     * @param {Number} level - The level of categories.
     * @param {Number} index - The index of category.
     * @returns {AnchorElement} An element page object.
     */
    categoryLinkOfLevelByIndex(level, index) {
        return new AnchorElement(this.selector + ' .category-navigation__section .category-navigation__group--level-' + level
            + ' li:nth-child(' + (index + 1) + ') a');
    }

    /**
     * Gets a menu item from the burger menu based on the category name.
     * @param {String} categoryName - The name of the category.
     * @param {String} menuType - The type of menu, default 'standard'.
     * @returns {BurgerMenuCategorySection} A page object.
     */
    categorySection(categoryName, menuType) {
        return new BurgerMenuCategorySection(categoryName, menuType);
    }

    /**
     * Gets the service navigation link for Help (Customer Service)
     * @returns {AnchorElement} A page object.
     */
    serviceNavigationHelpLink() {
        return new AnchorElement(this.selector + ' .service-navigation__icon--help');
    }

    /**
     * Gets the service navigation link for Storelocator (Find a retail store)
     * @returns {AnchorElement} A page object.
     */
    serviceNavigationStorelocatorLink() {
        return new AnchorElement(this.selector + ' .service-navigation__icon--location');
    }

    /**
     * Gets the service navigation link for Account (My Account).
     * @returns {AnchorElement} A page object.
     */
    serviceNavigationAccountLink() {
        return new AnchorElement(this.selector + ' .service-navigation__icon--user');
    }

    /**
     * Gets the "About Us" link from the service navigation.
     * @returns {AnchorElement} A page object.
     */
    serviceNavigationAboutUsLink() {
        return new AnchorElement(this.selector + ' .service-navigation__icon--info');
    }

    /**
     * Gets the service navigation button for Locale (Language & Country)
     * @returns {AnchorElement} A page object.
     */
    serviceNavigationLocaleLink() {
        return new AnchorElement(this.selector + ' .service-navigation__icon--geography');
    };

    /**
     * It returns you the Shop More Brands marketing widget.
     * @returns {ShopMoreBrandsComponent} A page object.
     */
    shopMoreBrandsMarketingWidget() {
        return new ShopMoreBrandsComponent('.burger-menu-marketing-widget');
    }

    /**
     * It will return the div where the curtain is over
     * @returns {BaseComponent} A page object.
     */
    curtainDivClick() {
        return this.getBrowser()
            .execute(() => {
                document.querySelector('.js-curtain').click();
            });
    }

    /**
     * It will return the button tag that closes the layered menu
     * @returns {ButtonElement} A page object.
     */
    burgerLayeredButtonClose() {
        return new ButtonElement('.js-burger-menu-layered-close');
    }

    /**
     * It will return the button tag that backs the layered menu 1 level
     * @returns {ButtonElement} A page object.
     */
    burgerLayeredButtonBack() {
        return new ButtonElement('.js-burger-menu-layered-back');
    }

    /**
     * It will return the div where the curtain is over
     * @returns {TextElement} A page object.
     */
    burgerLayeredCategoryParentLabel() {
        return new TextElement('.js-burger-menu-parent');
    }

    /**
     * Gets the categories by a given level of the layered menu.
     * @param {Number} level - The level of categories.
     * @returns {ListElement} An element page object.
     */
    burgerLayeredCategoriesOfLevel(level) {
        return new List(this.selector + ' .category-navigation__group--level-' + level + ' .category-navigation__item');
    }
}

module.exports = BurgerMenu;
