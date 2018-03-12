const {assert} = require('chai');

describe('User visiting landing page', () => {
  describe('deleting a video', () => {
    it('removes a video from the list', async () => {
      const newItem = {
        title: 'newTitle',
        description: 'newDescription',
        url: 'newUrl'
      };

      browser.url('videos/create');

      browser.setValue('#title-input', newItem.title);
      browser.setValue('#description-input', newItem.description);
      browser.setValue('#url-input', newItem.url);

      browser.click('#submit-button');

      browser.click('#delete-button');

      assert.notInclude(browser.getText('body'), newItem.title);
      assert.notInclude(browser.getText('body'), newItem.description);
      assert.notInclude(browser.getText('body'), newItem.url);
    });
  });
});
