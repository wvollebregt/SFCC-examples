const chai = require('chai');
const testBase = require('../../test_base');
const getBaseUrl = testBase.getBaseUrl;
const BurgerMenu = require('../../page_objects/components/BurgerMenu');
const PDP = require('../../page_objects/pages/PDP');
const PLP = require('../../page_objects/pages/PLP');
const Cart = require('../../page_objects/pages/Cart');
const Home = require('../../page_objects/pages/Home');
const Shipping = require('../../page_objects/pages/Shipping');
const CheckoutHelper = require('../../util/checkout_helper');
const expect = chai.expect;
const validFormValues = require('../../../test_resources/checkout/dk.json');

describe('burger_menu_layered #secondary', () => {
    // the category name of a category with 4 subcategories
    const BT_4_SUBCATEGORIES_CATEGORY_NAME = 'ONLY jackets';
    const BT_LAYERED_MENU_PARENT_LABEL = 'SHOP';
    const BURGER_MENU_TYPE = 'layered';
    const burgerMenu = new BurgerMenu();
    const checkoutHelper = new CheckoutHelper(validFormValues.locale, validFormValues.checkoutPage.productBasket, validFormValues.testProducts);
    const shipping = new Shipping();

    testBase.setupCustomDimensionsBrowser({ width: 1400, height: 900 });

    describe('on Bestseller', () => {
        /**
         * This function sets up the suite of tests related to the Burger Menu.
         * Since these tests are identical for all pages, we define them inside this function,
         * and we call the function from within all the scopes (one scope per page type).
         */
        let commonTests = () => {
            it('should stay open when clicking on inner elements', async () => {
                await burgerMenu.waitForNotVisibleWithinViewport();
                await burgerMenu.burgerButton().click();
                await burgerMenu.waitForVisibleWithinViewport();
                await burgerMenu.clickMenu();
                await burgerMenu.waitForVisibleWithinViewport();
                await burgerMenu.burgerLayeredButtonClose().click();
                let isNotVisible = await burgerMenu.waitForNotVisibleWithinViewport();
                return expect(isNotVisible).to.be.true;
            });

            it('should close when clicking on the layered close button', async () => {
                await burgerMenu.waitForNotVisibleWithinViewport();
                await burgerMenu.burgerButton().click();
                await burgerMenu.waitForVisibleWithinViewport();
                await burgerMenu.burgerLayeredButtonClose().click();
                let isNotVisible = await burgerMenu.waitForNotVisibleWithinViewport();
                return expect(isNotVisible).to.be.true;
            });

            it('should collapse when clicking on the overlay', async () => {
                await burgerMenu.waitForNotVisibleWithinViewport();
                await burgerMenu.burgerButton().click();
                await burgerMenu.waitForVisibleWithinViewport();
                await burgerMenu.curtainDivClick();
                let isNotVisible = await burgerMenu.waitForNotVisibleWithinViewport();
                return expect(isNotVisible).to.be.true;
            });

            describe('when expanded', () => {
                before(() => burgerMenu.expand());

                after(async () => {
                    await burgerMenu.burgerLayeredButtonClose().click();
                    await burgerMenu.waitForNotVisibleWithinViewport();
                });

                it('should show the default category-label ' + BT_LAYERED_MENU_PARENT_LABEL, () => {
                    let text = burgerMenu.burgerLayeredCategoryParentLabel().getText();
                    return expect(text).to.eventually.equal(BT_LAYERED_MENU_PARENT_LABEL);
                });

                it('should show the Search Bar', () => {
                    let visible = burgerMenu.search().isVisible();
                    return expect(visible).to.eventually.be.true;
                });

                it('should show first level categories', () => {
                    return expect(burgerMenu.burgerLayeredCategoriesOfLevel(1).length()).to.eventually.be.above(1);
                });

                describe('when on menu second level', ()=> {
                    before(async () => {
                        const isLayeredMenu = true;
                        await burgerMenu.categorySection(BT_4_SUBCATEGORIES_CATEGORY_NAME, BURGER_MENU_TYPE).parentLink(isLayeredMenu).click();
                    });

                    it('should update the category-label to ' + BT_4_SUBCATEGORIES_CATEGORY_NAME + ' when navigating to level 2', () => {
                        let text = burgerMenu.burgerLayeredCategoryParentLabel().getText();
                        return expect(text).to.eventually.equal(BT_4_SUBCATEGORIES_CATEGORY_NAME.toUpperCase());
                    });

                    it('should show the Search Bar', () => {
                        let visible = burgerMenu.search().isVisible();
                        return expect(visible).to.eventually.be.true;
                    });

                    it('should show second level categories', () => {
                        return expect(burgerMenu.burgerLayeredCategoriesOfLevel(2).length()).to.eventually.be.above(1);
                    });
                });

                describe('back to menu first level', ()=> {
                    before(async () => {
                        await burgerMenu.burgerLayeredButtonBack().click();
                    });

                    it('should show the default category-label ' + BT_LAYERED_MENU_PARENT_LABEL, () => {
                        let text = burgerMenu.burgerLayeredCategoryParentLabel().getText();
                        return expect(text).to.eventually.equal(BT_LAYERED_MENU_PARENT_LABEL);
                    });
                });
            });
        };

        describe('on brand that is configured to use headlines', () => {
            before(() => {
                let home = new Home();
                return home.url(getBaseUrl('jj') + '/nl/nl');
            });

            it('should render headlines', async () => {
                const result = await burgerMenu.categorySection('jj-brands', BURGER_MENU_TYPE).headlines();
                const expectedResult = [
                    {
                        headline: 'JACK & JONES Jeans Intelligence Brands',
                        isLink: false
                    },
                    {
                        headline: 'JACK & JONES Remarkable',
                        isLink: true,
                        href: 'https://www.jackjones.com',
                        target: '_blank'
                    },
                    {
                        headline: 'JACK & JONES Test',
                        isLink: false
                    },
                    {
                        headline: 'JACK & JONES Test',
                        isLink: false
                    },
                    {
                        headline: 'JACK & JENNI',
                        isLink: true,
                        href: '/nl/nl/jj/brands/sayid-khan-shop/',
                        target: '_self'
                    }
                ];
                expect(result).to.deep.equal(expectedResult);
            });
        });

        describe('on brand that is configured NOT to use headlines', () => {
            before(() => {
                let home = new Home();
                return home.url(getBaseUrl('sl') + '/nl/nl');
            });

            it('should NOT render headlines', async () => {
                const result = await burgerMenu.categorySection('sl-outerwear', BURGER_MENU_TYPE).headlines();
                expect(result).to.deep.equal([]);
            });
        });

        describe('on homepage', () => {
            before(() => {
                let home = new Home();
                return home.url(getBaseUrl('on') + '/nl/nl');
            });

            commonTests();
        });

        describe('on PLP', () => {
            before(() => {
                let plp = new PLP();
                return plp.url(getBaseUrl('on') + '/dk/da/search?cgid=on-leggings');
            });

            commonTests();
        });

        describe('on PDP', () => {
            before(() => {
                let pdp = new PDP();
                return pdp.url(
                    getBaseUrl('on') + '/fi/fi/on/only-leggings/basic-leggings-TSD15038335.html');
            });

            commonTests();
        });

        describe('on MyAccount page', () => {
            before(() => {
                let home = new Home();
                return home.url(getBaseUrl('on') + '/dk/da/account');
            });

            commonTests();
        });

        describe('on Error page', () => {
            before(() => {
                let home = new Home();
                return home.url(getBaseUrl('on') + '/nl/nl/language');
            });

            commonTests();
        });

        describe('on cart page', () => {
            before(() => {
                let cart = new Cart();
                return cart.url(getBaseUrl('on') + '/nl/nl/cart');
            });

            commonTests();
        });

        describe('on 404 page', () => {
            before(() => {
                let home = new Home();
                return home.url(getBaseUrl('on') + '/dk/da/404');
            });

            commonTests();
        });

        describe('on checkout page', () => {
            before(() => checkoutHelper.goToShippingPageAsGuest());

            it('should hide the burger menu', () => {
                return expect(burgerMenu.burgerButton().isVisible()).to.eventually.be.false;
            });

            describe('go to billing step', () => {
                before(async () => {
                    await shipping.setShippingMethod(validFormValues.shippingMethods.standardPost.ID);
                    await shipping.shippingAddress().fill(validFormValues.common);
                    await shipping.shippingAddress().useAsBillingAddressLabel().click();
                    await checkoutHelper.goToBillingPage();
                });

                it('should hide the burger menu', () => {
                    return expect(burgerMenu.burgerButton().isVisible()).to.eventually.be.false;
                });

                describe('go to review order step', () => {
                    before(() => {
                        return checkoutHelper.fillBillingForm(validFormValues, { navigateToSummary: true });
                    });

                    it('should hide the burger menu', () => {
                        return expect(burgerMenu.burgerButton().isVisible()).to.eventually.be.false;
                    });
                });
            });
        });
    });
});
