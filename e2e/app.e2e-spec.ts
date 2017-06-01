import { BachelorFrontendPage } from './app.po';

describe('bachelor-frontend App', () => {
  let page: BachelorFrontendPage;

  beforeEach(() => {
    page = new BachelorFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
