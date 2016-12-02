describe('App', () => {

  beforeEach(() => {
    // change hash depending on router LocationStrategy
    browser.get('/#/home');
  });


  it('should have a title', () => {
    let subject = browser.getTitle();
    let result  = 'SAM Client Starter';
    expect(subject).toEqual(result);
  });

  it('should have `your content here` x-large', () => {
    let subject = element(by.css('[x-large]')).getText();
    let result  = 'SAM CLIENT IMPLEMENTATION';
    expect(subject).toEqual(result);
  });


});
