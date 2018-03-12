const {assert} = require('chai');

describe('User visits update', () => {
  describe('updates video', () => {
    it('and changes the values', async () => {
      //setup
			const newItem = {
				title: 'user visiting title',
				description: 'user visiting description',
				url: 'user visiting url'
			};

			//exercise
			browser.url('videos/create');

			browser.setValue('#title-input', newItem.title);
			browser.setValue('#description-input', newItem.description);
			browser.setValue('#url-input', newItem.url);

			browser.click('#submit-button');

      browser.click('#edit-button');

      const updatedValue = 'another value';
      browser.setValue('#title-input', updatedValue);

      browser.click('#submit-button');

      //assert
      assert.include(browser.getText('body'), updatedValue);
    });

    it('doesn\'t create a new record', async () => {
      //setup
      const videoToUpdate = {
        title: 'this title will update',
        description: 'we\'ll leave this one alone',
        url: 'http://example.com'
      };

      //exercise
      browser.url('videos/create');

      browser.setValue('#title-input', videoToUpdate.title);
      browser.setValue('#description-input', videoToUpdate.description);
      browser.setValue('#url-input', videoToUpdate.url);

      browser.click('#submit-button');

      browser.click('#edit-button');

      const updateTitle = 'updated title';
      browser.setValue('#title-input', updateTitle);

      browser.click('#submit-button');

      //assert
      assert.include(browser.getText('body'), updateTitle);
      assert.include(browser.getText('body'), videoToUpdate.description);

      assert.notInclude(browser.getText('body'), videoToUpdate.title);
    });
  });
});
