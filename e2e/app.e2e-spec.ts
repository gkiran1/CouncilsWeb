import { FirebasesamplePage } from './app.po';

describe('firebasesample App', function() {
  let page: FirebasesamplePage;

  beforeEach(() => {
    page = new FirebasesamplePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
