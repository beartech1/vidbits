/** /test/features/user-visiting-create-page-test.js */
//fill out a form with title and description the application should return the user to the landing page w/ the newly created item
//post navigates to /videos ?

const {assert} = require('chai');

describe('User visits the create page', () => {
	describe('posts a new item', () => {
		it('and it is rendered', async () => {
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

			//assert
			assert.include(browser.getText('body'), newItem.title);
			assert.include(browser.getText('body'), newItem.description);
		});
	});
});
