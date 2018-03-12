const {assert} = require('chai');

const generateRandomUrl = (domain) => {
  return `http://${domain}/${Math.random()}`;
};

describe('User visiting landing page', () => {
	describe('with no existing videos', () => {
		it('shows no videos', async () => {
			 browser.url('/');

			 assert.equal(browser.getText('#videos-container'), '');
		});
	});

	describe('navigates to videos/create', () => {
		it('can view a page containing "Save a video"', async () => {
			browser.url('/');

			browser.click('a[href="/videos/create"]');

			assert.include(browser.getText('body'), 'Save a video');
		});
	});

	describe('with an existing video', () => {
		it('renders it in the list', async () => {
			const knownTitle = 'I know this title';
      const knownUrl = 'I know this URL';

			browser.url('/videos/create');
			browser.setValue('#title-input', knownTitle);
      browser.setValue('#url-input', knownUrl);

			browser.click('#submit-button');

			browser.url('/');

			assert.include(browser.getText('#videos-container'), knownTitle);
		});

		it('can naviate to a video', async () => {
			const title = 'a title';
			const description = 'a description';
			const url = 'a url';

			browser.url('/videos/create');
			browser.setValue('#title-input', title);
			browser.setValue('#description-input', description);
			browser.setValue('#url-input', url);

			browser.click('#submit-button');

			browser.url('/');

			browser.click('.video-title');
		});
	});
});
