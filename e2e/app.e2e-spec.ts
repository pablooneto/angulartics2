import { AppPage } from './app.po';

describe('ngx-analytics App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display home page header', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('ngx-analytics');
  });
});
