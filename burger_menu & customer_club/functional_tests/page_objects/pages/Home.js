'use strict';

const BasePage = require('./BasePage');
const Anchor = require('./../elements/Anchor');
const CustomerServiceWidget = require('../components/widgets/CustomerService');
const FullWidthTextWidget = require('../components/widgets/FullWidthText');
const PromotionWidget = require('../components/widgets/PromotionWidget');
const HeroComponent = require('./../components/widgets/Hero');
const LinkboxComponent = require('./../components/widgets/Linkbox');
const VictorinoxComponent = require('./../components/widgets/Victorinox');
const VictorinoxMultiBackgroundsComponent = require('./../components/widgets/VictorinoxMultiBackgrounds');
const SmartComponent = require('./../components/widgets/SmartWidget');
const SearchComponent = require('./../components/Search');
const SwiperComponent = require('../components/Swiper');
const WidgetRow = require('./../components/widgets/Row');
const EditorialWidgetRow = require('./../components/widgets/EditorialRow');
const SplashScreen = require('../components/widgets/SplashScreen');
const SplitterWidget = require('../components/widgets/Splitter');
const BrandLogoWidget = require('../components/widgets/BrandLogoWidget');
const TopNavigation = require('../components/TopNavigation');
const CustomerClubSignUp = require('../components/CustomerClubSignUp');
const CustomerClubPopup = require('../components/CustomerClubPopup');
const CustomerGlobalInfo = require('../components/CustomerGlobalInfo');
const SmartWidget = require('../components/widgets/SmartWidget');
const CustomerClubOverlay = require('../components/CustomerClubOverlay');
const CustomerClubWidget = require('../components/CustomerClubWidget');
const FooterComponent = require('../components/Footer');
const VideoWidget = require('../components/widgets/VideoWidget');
const TileWidget = require('../components/widgets/TileWidget');
const ErrorPageTextWidget = require('../components/widgets/ErrorPageTextWidget');
const SocialShareWidget = require('../components/widgets/SocialShareWidget');
const EditorialMultiBackgrounds = require('../components/widgets/EditorialMultiBackgrounds');
const EditorialText = require('../components/widgets/EditorialText');
const InstagramFeedWidget = require('../components/widgets/InstagramFeedWidget');
const RowType4Dynamic = require('../components/widgets/RowType4Dynamic');
const MenuStyling = require('../components/MenuStyling');
const BlogNavigationWidget = require('./../components/widgets/BlogNavigationWidget');
const IframeWidget = require('./../components/widgets/IframeWidget');

/**
 * Home Page Object
 * @constructor
 */

class Home extends BasePage {
    constructor(selector) {
        super(selector);
    }

    /**
     * Checks if the main block is visible
     * @returns {Promise} A promise that resolves when the main block is visible.
     */
    isMainVisible() {
        return this.getBrowser().isVisible('.js-homepage');
    }

    headerSearch() {
        return new SearchComponent('.js-homepage .search__control');
    }

    quickSearch() {
        return new SearchComponent('.servicebar__quick-search');
    }

    homepageSearch() {
        return new SearchComponent('.homepage-content__search');
    }

    topNavigationSearch() {
        return new SearchComponent('.top-navigation-search');
    }

    row(rowType) {
        var localType = rowType || '.row-type1';
        return new WidgetRow(localType);
    }

    /**
     * Selects the editorial row
     *
     * @param {String} rowType - row type to select
     * @returns {EditorialRow} - row page object
     */
    editorialRow(rowType) {
        return new EditorialWidgetRow(rowType);
    }

    /**
     * Selects EditorialMultiBackgrounds element from slot
     *
     * @param {String} slot - slot selector
     * @returns {EditorialMultiBackgrounds} - EditorialMultiBackgrounds element
     */
    editorialMultiBackgroundsWidgetInSlot(slot) {
        return new EditorialMultiBackgrounds(slot + ' .widget-editorial--multi-backgrounds');
    }

    /**
     * Selects EditorialText element from slot
     *
     * @param {String} slot - slot selector
     * @returns {EditorialText} - EditorialText element
     */
    editorialTextWidgetInSlot(slot) {
        return new EditorialText(slot + ' .widget-editorial');
    }

    /**
     * Selects the link of the text widget from slot
     * @param {string} slot - slot id
     * @returns {EditorialText} - editorial text widget item
     */
    editorialTextWidgetInSlotLink(slot) {
        return new Anchor(slot + ' .widget-editorial .widget-editorial__link');
    }

    heroWidgetByIndex(index, heroType, skipNthSelector) {
        var heroClassModifier = heroType ? '--type' + heroType : '';

        return new HeroComponent(`article.widget-hero${heroClassModifier}${skipNthSelector ? '' : `:nth-of-type(${index + 1})`}`);
    }

    brandLogoWidget() {
        return new BrandLogoWidget('.brand-logo__container');
    }

    slimFitWidget() {
        return new Anchor('.js-slim-fit-widget__link');
    }

    victorinoxWidgetInSlot(slot) {
        return new VictorinoxComponent(slot + ' .widget-victorinox');
    }

    victorinoxMultiBackgroundsWidgetInSlot(slot) {
        return new VictorinoxMultiBackgroundsComponent(slot + ' .widget-victorinox--multi-backgrounds');
    }

    victorinoxWidgetInSlotLink(slot) {
        return new VictorinoxComponent(slot + ' .widget-victorinox__link');
    }

    smartWidgetInSlot(slot) {
        return new SmartComponent(slot + ':nth-of-type(1) .widget-smart');
    }

    /**
     * Selects a test instance for customer service widget inside provided slot. If slot is not provided it will return
     * all of customer service widgets on the page
     *
     * @param {String} [slot] - slot selector for customer service widget
     * @returns {CustomerServiceWidget} A page object.
     */
    customerServiceWidget(slot) {
        var selector = slot || '';

        return new CustomerServiceWidget('.js-homepage ' + selector + ' .customer-service-widget');
    }

    /**
     * Return the customer global info bar component
     * @param {Boolean} [plain] - If true, target the plain version.
     * @returns {CustomerGlobalInfo} A page object.
     */
    customerGlobalInfo(plain) {
        return new CustomerGlobalInfo('.customer-global__container' + (plain ? '--plain' : ''));
    }

    /**
     * Return the customer club signup component
     * @returns {CustomerClubSignUp} A page object.
     */
    customerClubSignUp() {
        return new CustomerClubSignUp('.customer-club-signup');
    }

    /**
     * Return the customer club popup component
     * @returns {CustomerClubPopup} A page object.
     */
    customerClubPopup() {
        return new CustomerClubPopup('.customer-club-popup');
    }

    /**
     * Return the customer club overlay component
     * @returns {CustomerClubOverlay} A page object.
     */
    customerClubOverlay() {
        return new CustomerClubOverlay('.customer-club-overlay');
    }

    /**
     * Return the customer club widget component
     * @returns {CustomerClubWidget} A page object.
     */
    customerClubWidget() {
        return new CustomerClubWidget('.customer-club-widget');
    }

    /**
     * Returns a Linkbox component (all instances or by index)
     * @param {Number} [optionalIndex] - An optional index to pinpoint a certain index.
     * @returns {LinkboxComponent} A page object.
     */
    linkboxWidget(optionalIndex) {
        return new LinkboxComponent('.widget-linkbox', optionalIndex);
    }

    /**
     * Returns a full width text component
     * @returns {FullWidthTextWidget} A page object.
     */
    fullWidthTextWidget() {
        return new FullWidthTextWidget('.widget__full-width-text');
    }

    /**
     * Returns a promotion component
     * @returns {PromotionWidget} A page object.
     */
    promotionWidget() {
        return new PromotionWidget('.widget__promotion');
    }

    /**
     * Returns the splash screen
     * @returns {SplashScreen} A page object.
     */
    splashScreen() {
        return new SplashScreen('.splash-screen');
    }

    /**
     * Returns a unisex splitter widget
     * @returns {SplitterWidget} A page object.
     */
    unisexSplitterWidget() {
        return new SplitterWidget('.splitter-container');
    }

    /**
     * Returns the top navigation
     * @returns {TopNavigation} A page object.
     */
    menuTopNavigation() {
        return new TopNavigation();
    }

    /**
     * Returns the menu styling
     * @param {String} id - Top or burger.
     * @returns {MenuStyling} A page object.
     */
    menuStyling(id) {
        const selector = id === 'top' ? '.js-menu-top-navigation' : '.js-burger-menu';
        return new MenuStyling(selector);
    }

    /**
     * Returns the footer container
     * @returns {FooterComponent} A page object.
     */
    footerContainer() {
        return new FooterComponent('.footer-container');
    }

    /**
     * Returns the footer widgets
     * @returns {FooterComponent} A page object.
     */
    footerWidgets() {
        return new FooterComponent('.footer-widgets');
    }

    /**
     * Returns the footer carriers list
     * @returns {FooterComponent} A page object.
     */
    footerCarrierLogosWrapper() {
        return new FooterComponent('.trusted-carriers');
    }

    /**
     * Returns the footer payments list
     * @returns {FooterComponent} A page object.
     */
    footerPaymentLogosWrapper() {
        return new FooterComponent('.trusted-payments');
    }

    /**
     * Returns a swiper by row
     * @param {Number} [rowNumber] - An optional row number to pinpoint a certain row.
     * @returns {SwiperComponent} A page object.
     */
    swiperByRow(rowNumber) {
        return new SwiperComponent('.js-homepage .swiper-container#home-page-row-' + ('0' + rowNumber).slice(-2) + '-widget-swiper');
    }

    /**
     * Returns a smart widgets
     * @param {String} [selector='.widget-smart'] Smart widget selector
     * @returns {SmartWidget} A page object.
     */
    smartWidget(selector = '.widget-smart') {
        return new SmartWidget(selector);
    }

    /**
     * Returns a single smart widget
     * @param {Integer} [child=1] child selector
     * @param {String} [selector='.widget-smart'] Smart widget selector
     * @returns {SmartWidget} A page object.
     */
    singleSmartWidget(child = 1, selector = '.widget-smart') {
        return new SmartWidget(`ol li:nth-child(${child}) ` + selector);
    }

    /**
     * Returns a video hero widget
     * @returns {VideoWidget} A page object.
     */
    videoHeroWidget() {
        return new VideoWidget('.widget-video--hero');
    }

    /**
     * Returns a video square widget
     * @returns {VideoWidget} A page object.
     */
    videoSquareWidget() {
        return new VideoWidget('.widget-video--square');
    }

    /**
     * Returns a tile widget
     * @returns {TileWidget} A page object.
     */
    tileWidget() {
        return new TileWidget('.widget-tile');
    }

    /**
     * Returns a error page text widget
     * @returns {ErrorPageTextWidget} A page object.
     */
    errorPageTextWidget() {
        return new ErrorPageTextWidget('.error-page-text-widget');
    }

    /**
     * Returns a social share widget
     * @returns {SocialShareWidget} A page object.
     */
    socialShareWidget() {
        return new SocialShareWidget('.social-share-widget');
    }

    /**
     * Returns an instagram feed widget
     * @returns {InstaGramFeedWidget} A page object.
     */
    instagramFeedWidget() {
        return new InstagramFeedWidget('.instagram-feed');
    }

    /**
     * Returns a social share widget
     * @returns {SocialShareWidget} A page object.
     */
    rowType4Dynamic() {
        return new RowType4Dynamic('.row-type-4-dynamic');
    }

    /**
     * Returns a blog navigation widget component
     * @returns {BlogNavigationWidget} A page object.
     */
    BlogNavigationWidget() {
        return new BlogNavigationWidget('.blog-navigation');
    }

    /**
     * Returns an iframe widget widget component
     * @returns {IframeWidget} A page object.
     */
    IframeWidget() {
        return new IframeWidget('.iframe-widget');
    }
}

module.exports = Home;
