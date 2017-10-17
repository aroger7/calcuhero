import { CalcuheroPage } from './app.po';

describe('calcuhero App', () => {
  let page: CalcuheroPage;

  beforeEach(() => {
    page = new CalcuheroPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
