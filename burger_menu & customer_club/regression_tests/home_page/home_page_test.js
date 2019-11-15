const testBase = require('../../test_base');
const chai = require('chai');
const expect = chai.expect;
const HomePage = require('../../page_objects/pages/Home');
const brands = require('../../../test_resources/brands.json');
const bestsellerTechHomePageUrl = testBase.getHttpsBaseUrl() + '/se/en/homepage';

describe('home_page #secondary', () => {
    const homePage = new HomePage();

    testBase.setupDesktopBrowser();

    brands.forEach(brand => {
        describe(`when the brand is: ${brand.shortCode}`, () => {
            const homePageUrl = `${testBase.getHttpsBaseUrl(brand.shortCode)}/se/en/homepage`;
            const expectedLogoSrc = `/${brand.shortCode}/images/logo.svg`;
            const expectedCssSrc = `/${brand.shortCode}/css/style.css`;
            const brandGtmId = brand.gtmId;
            const homepageTitle = brand.homepage.meta.title;
            const homepageDescription = brand.homepage.meta.description;
            const homepageKeywords = brand.homepage.meta.keywords;

            before(() => homePage.url(homePageUrl));

            it('should verify that title is correct', () => expect(homePage.title()).to.eventually.equalIgnoreCase(homepageTitle, 'should have branded page title'));

            it('should verify that page description is correct', () => expect(homePage.meta('description')).to.eventually.equal(homepageDescription, 'should have branded page meta description'));

            it('should verify that page keywords are correct', () => expect(homePage.meta('keywords')).to.eventually.equal(homepageKeywords, 'should have branded page meta keywords'));

            it('should render the branded logo in the header', () => expect(homePage.header().logo().src()).to.eventually.contain(expectedLogoSrc, 'should have branded logo'));

            it('should use branded css', () => expect(homePage.css()).to.eventually.contain(expectedCssSrc, 'should have branded css'));

            it('should not have empty guest user id in data layer', () => homePage.getDataLayerProperty('user', brandGtmId)
                .then(datalayer => expect(datalayer.value.id).to.not.be.empty));

            it('should contain guest user status in data layer', () => homePage.getDataLayerProperty('user', brandGtmId)
                .then(datalayer => expect(datalayer.value.status).to.deep.equal('guest', 'should contain guest user status in data layer')));

            it('should contain brand shortcode in page properties in data layer', () => homePage.getDataLayerProperty('page', brandGtmId)
                .then(datalayer => expect(datalayer.value.brand).to.deep.equal(brand.shortCode, 'should contain brand shortcode in page properties in data layer')));

            it('should contain homepage type in page properties in data layer', () => homePage.getDataLayerProperty('page', brandGtmId)
                .then(datalayer => expect(datalayer.value.type).to.deep.equal('homepage', 'should contain homepage type in page properties in data layer')));

            it('should contain market in page properties in data layer', () => homePage.getDataLayerProperty('page', brandGtmId)
                .then(datalayer => expect(datalayer.value.market).to.deep.equal('SE', 'should contain market  SE in page properties in data layer for Sweden')));

            it('should contain lang in page properties in data layer', () => homePage.getDataLayerProperty('page', brandGtmId)
                .then(datalayer => expect(datalayer.value.lang).to.equal('en')));

            it('should contain main div', () => expect(homePage.isMainVisible()).to.eventually.be.true);
        });
    });

    describe('for BestsellerTech brand', () => {
        before(() => homePage.url(bestsellerTechHomePageUrl));

        it('should verify that page description is correct', () => expect(homePage.meta('description')).to.eventually.equal('This is a testing Bestsellertech brand'));

        it('should verify that page keywords are correct', () => expect(homePage.meta('keywords')).to.eventually.equal('testing, test brand'));

        it('should render the branded logo in the header', () => expect(homePage.header().logo().src()).to.eventually.contain('/bt/images/logo.svg', 'should have BestsellerTech logo'));

        it('should use branded css', () => expect(homePage.css()).to.eventually.contain('/bt/css/style.css', 'should have BestsellerTech style'));

        it('should render the branded css in the header', async () => {
            let cssProperty = await homePage.header().cssProperty('background-color');
            return expect(cssProperty.parsed.hex).to.equal('#000000', `should render branded css: ${cssProperty}`);
        });

        it('should render the branded css in the header', () => homePage.header().cssProperty('color').then(cssProperty => expect(cssProperty.parsed.hex).to.equal('#6dcff6', `should render branded css: ${cssProperty}`)));

        it('should not have top navigation', () => expect(homePage.menuTopNavigation().isVisible()).to.eventually.be.false);
    });
});
