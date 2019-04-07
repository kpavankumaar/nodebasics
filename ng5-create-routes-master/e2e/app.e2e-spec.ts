import { AppPage } from './app.po';
import { browser, by , element } from 'protractor';
describe('ng5-create-routes App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    browser.pause();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
