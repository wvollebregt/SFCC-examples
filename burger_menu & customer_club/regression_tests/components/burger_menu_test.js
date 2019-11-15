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

describe('burger_menu #secondary', () => {
    // the category name of a category with 4 subcategories
    const BT_4_SUBCATEGORIES_CATEGORY_NAME = 'BestsellerTech 4 Subcategories';
    const burgerMenu = new BurgerMenu();
    const checkoutHelper = new CheckoutHelper(validFormValues.locale, validFormValues.checkoutPage.productBasket, validFormValues.testProducts);
    const shipping = new Shipping();

    testBase.setupCustomDimensionsBrowser({ width: 1400, height: 900 });

    describe('on BestsellerTech', () => {
        /**
         * This function sets up the suite of tests related to the Burger Menu.
         * Since these tests are identical for all pages, we define them inside this function,
         * and we call the function from within all the scopes (one scope per page type).
         */
        let commonTests = () => {
            it('should close by clicking the button twice', async () => {
                await burgerMenu.waitForNotVisibleWithinViewport();
                await burgerMenu.burgerButton().click();
                await burgerMenu.waitForVisibleWithinViewport();
                await burgerMenu.burgerButton().click();
                let isNotVisible = await burgerMenu.waitForNotVisibleWithinViewport();
                expect(isNotVisible).to.be.true;
            });

            it('should stay open when clicking on inner elements', async () => {
                await burgerMenu.expand();
                await burgerMenu.clickMenu();
                await burgerMenu.waitForVisibleWithinViewport();
                await burgerMenu.burgerButton().click();
                let isNotVisible = await burgerMenu.waitForNotVisibleWithinViewport();
                expect(isNotVisible).to.be.true;
            });

            it('should collapse when clicking on the overlay', async () => {
                await burgerMenu.waitForNotVisibleWithinViewport();
                await burgerMenu.burgerButton().click();
                await burgerMenu.waitForVisibleWithinViewport();
                await burgerMenu.curtainDivClick();
                let isNotVisible = await burgerMenu.waitForNotVisibleWithinViewport();
                expect(isNotVisible).to.be.true;
            });

            describe('when expanded', () => {
                before(() => burgerMenu.expand());

                after(async () => {
                    await burgerMenu.burgerButton().click();
                    await burgerMenu.waitForNotVisibleWithinViewport();
                });

                it('should link to a category page', () => {
                    // url is like http://host/country/language/BestsellerTech-no-products
                    var href = burgerMenu.categorySection('BestsellerTech no products').categoryLink().href();
                    return expect(href).to.eventually.endWith('-no-products/');
                });

                it('should not show the More button on the No Products category', () => {
                    let visible = burgerMenu.categorySection('BestsellerTech No Products').moreButton().isVisible();
                    return expect(visible).to.eventually.be.false;
                });

                it('should not show the Less button on the No Products category', () => {
                    let visible = burgerMenu.categorySection('BestsellerTech No Products').lessButton().isVisible();
                    return expect(visible).to.eventually.be.false;
                });

                it('should show the BestsellerTech 4 Subcategories category', () => {
                    let visible = burgerMenu.categorySection(BT_4_SUBCATEGORIES_CATEGORY_NAME).isVisible();
                    return expect(visible).to.eventually.be.true;
                });

                it('should show the More button on the 4-subcategories category', () => {
                    let visible = burgerMenu.categorySection(BT_4_SUBCATEGORIES_CATEGORY_NAME).moreButton().isVisible();
                    return expect(visible).to.eventually.be.true;
                });

                it('should not show the Less button on the 4-subcategories category', () => {
                    let visible = burgerMenu.categorySection(BT_4_SUBCATEGORIES_CATEGORY_NAME).lessButton().isVisible();
                    return expect(visible).to.eventually.be.false;
                });

                it('should not show the 4th item on the 4-subcategories category', () => {
                    let visible = burgerMenu.categorySection(BT_4_SUBCATEGORIES_CATEGORY_NAME).subCategoryLink(3).isVisible();
                    return expect(visible).to.eventually.be.false;
                });

                it('should display the Help service-page', () => {
                    return expect(burgerMenu.serviceNavigationHelpLink().href()).to.eventually.contain('zendesk.com');
                });

                it('should display the Find a retail store service-page', () => {
                    return expect(burgerMenu.serviceNavigationStorelocatorLink().href()).to.eventually.contain('stores');
                });

                it('should display the My Account service-page', () => {
                    return expect(burgerMenu.serviceNavigationAccountLink().href()).to.eventually.contain('/account?page=account');
                });

                it('should display the About Us page', () => {
                    return expect(burgerMenu.serviceNavigationAboutUsLink().href()).to.eventually.contain('//about.bestseller.com');
                });

                it('should display the Language and Country service-page', () => {
                    return expect(burgerMenu.serviceNavigationLocaleLink().href()).to.eventually.contain('?showCountrySelector=1');
                });

                it('should display the Bestseller.com home page', () => {
                    // we add firstResult, because there may be one or two A tags in the links
                    let promise = burgerMenu.shopMoreBrandsMarketingWidget().link().href().then(testBase.firstResult);
                    return expect(promise).to.eventually.contain('bestseller.com');
                });

                describe('when clicking on the More button', () => {
                    let categorySection;

                    before(async () => {
                        categorySection = burgerMenu.categorySection(BT_4_SUBCATEGORIES_CATEGORY_NAME);
                        await categorySection.moreButton().click();
                        return categorySection.waitUntilHeightIsStable();
                    });

                    it('should hide the More button', () => {
                        return expect(categorySection.moreButton().isVisible()).to.eventually.be.false;
                    });

                    it('should show the Less button', () => {
                        return expect(categorySection.lessButton().isVisible()).to.eventually.be.true;
                    });

                    it('should show the 4th item', () => {
                        return expect(categorySection.subCategoryLink(3).isVisible()).to.eventually.be.true;
                    });
                });

                describe('when clicking on the Less button', () => {
                    let categorySection;

                    before(async () => {
                        categorySection = burgerMenu.categorySection(BT_4_SUBCATEGORIES_CATEGORY_NAME);
                        await categorySection.lessButton().click();
                        return categorySection.waitUntilHeightIsStable();
                    });

                    it('should show the More button', () => {
                        return expect(categorySection.moreButton().isVisible()).to.eventually.be.true;
                    });

                    it('should hide the Less button', () => {
                        return expect(categorySection.lessButton().isVisible()).to.eventually.be.false;
                    });

                    it('should hide the 4th item', () => {
                        return expect(categorySection.subCategoryLink(3).isVisible()).to.eventually.be.false;
                    });
                });
            });
        };

        describe('on homepage Nordics', () => {
            describe('on SE locale', () => {
                before(async () => {
                    let home = new Home();
                    await home.url(getBaseUrl() + '/se/sv');
                    await burgerMenu.expand();
                });

                it('should not display BestsellerTech Outerwear on SE/EN', () => {
                    return expect(burgerMenu.categorySection('BestsellerTech outerwear').isVisible()).to.eventually.be.false;
                });

                it('should lead to the zendesk page defined in business manager when the callout from burger menu is clicked', () => {
                    return expect(burgerMenu.serviceNavigationHelpLink().href()).to.eventually.equal('https://bestseller.zendesk.com/');
                });
            });

            describe('on NO locale', () => {
                before(async () => {
                    let home = new Home();
                    await home.url(getBaseUrl() + '/no/no');
                    await burgerMenu.expand();
                });

                it('should display BestsellerTech Outerwear on NO/NO', () => {
                    return expect(burgerMenu.categorySection('BestsellerTech outerwear').isVisible()).to.eventually.be.true;
                });

                it('should lead to the zendesk page defined in business manager when the callout from burger menu is clicked', () => {
                    return expect(burgerMenu.serviceNavigationHelpLink().href()).to.eventually.equal('https://bestseller.zendesk.com/');
                });
            });
        });

        describe('on homepage', () => {
            before(() => {
                let home = new Home();
                return home.url(getBaseUrl() + '/nl/nl');
            });

            commonTests();
        });

        describe('on PLP', () => {
            before(() => {
                let plp = new PLP();
                return plp.url(getBaseUrl() + '/dk/da/search?cgid=bt-shirts');
            });

            commonTests();
        });

        describe('on PDP', () => {
            before(() => {
                let pdp = new PDP();
                return pdp.url(
                    getBaseUrl() + '/fi/fi/only/leggings/live-love-leggins-TSD5700347386250.html');
            });

            commonTests();

            describe('when expanded', () => {
                before(() => {
                    return burgerMenu.expand();
                });

                it('should show first level categories', () => {
                    return expect(burgerMenu.categoriesOfLevel(1).length()).to.eventually.be.above(0);
                });

                it('should show second level categories', () => {
                    return expect(burgerMenu.categoriesOfLevel(2).length()).to.eventually.be.above(0);
                });

                it('should show third level categories', () => {
                    return expect(burgerMenu.categoriesOfLevel(3).length()).to.eventually.be.above(0);
                });

                it('should not show fourth level categories', () => {
                    return expect(burgerMenu.categoriesOfLevel(4).length()).to.eventually.equal(0);
                });

                it('should go to the My Account service-page', async () => {
                    await burgerMenu.serviceNavigationAccountLink().click();
                    return expect(burgerMenu.getCurrentUrl()).to.eventually.contain('Login-Show');
                });
            });
        });

        describe('on MyAccount page', () => {
            before(() => {
                let home = new Home();
                return home.url(getBaseUrl() + '/dk/da/account');
            });

            commonTests();
        });

        describe('on Error page', () => {
            before(() => {
                let home = new Home();
                return home.url(getBaseUrl() + '/nl/nl/language');
            });

            commonTests();
        });

        describe('on cart page', () => {
            before(() => {
                let cart = new Cart();
                return cart.url(getBaseUrl() + '/nl/nl/cart');
            });

            commonTests();
        });

        describe('on 404 page', () => {
            before(() => {
                let home = new Home();
                return home.url(getBaseUrl() + '/dk/da/404');
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

    describe('on Bestseller.com', () => {
        /**
         * Tests that run on every page of bestseller.com
         */
        let commonTests = () => {
            describe('when expanded', () => {
                before(() => burgerMenu.expand());

                it('should hide the Shop More Brands Marketing widget', () => {
                    return expect(burgerMenu.shopMoreBrandsMarketingWidget().isVisible()).to.eventually.be.false;
                });
            });
        };

        describe('on homepage', () => {
            before(() => {
                let home = new Home();
                return home.url(getBaseUrl('bc') + '/nl/nl/');
            });

            commonTests();
        });

        describe('on PLP', () => {
            before(() => {
                let plp = new PLP();
                return plp.url(getBaseUrl('bc') + '/nl/nl/search?cgid=bc-root');
            });

            commonTests();
        });

        describe('on PDP', () => {
            before(() => {
                let pdp = new PDP();
                return pdp.url(
                    getBaseUrl('bc') + '/nl/nl/category/something-TSD12020857.html');
            });

            commonTests();
        });
    });

    describe('on Veromoda', () => {
        before(() => {
            let home = new Home();
            return home.url(getBaseUrl('vm') + '/dk/en');
        });

        it('should not display the Find a Store link', () => {
            return expect(burgerMenu.serviceNavigationStorelocatorLink().isExisting()).to.eventually.be.false;
        });
    });
});
