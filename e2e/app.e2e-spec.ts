import { ExpirePage } from './app.po';

describe('expire App', () => {
  let page: ExpirePage;

  beforeEach(() => {
    page = new ExpirePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
