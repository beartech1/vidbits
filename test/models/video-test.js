const Video = require('../../models/video');
const {assert} = require('chai');
const {mongoose, databaseUrl, options} = require('../../database');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe('model Video', () => {
	beforeEach(connectDatabase);

	afterEach(disconnectDatabase);

	describe('check properties', () => {
		it('are saved as strings', async () => {
			//setup
			const titleInt = 56;
			const descriptionInt = 33;
			const urlInt = 2;

			//exercise
			const video = new Video({
				title: titleInt,
				description: descriptionInt,
				url: urlInt
			});

			//assert
			assert.strictEqual(video.title, titleInt.toString());
			assert.strictEqual(video.description, descriptionInt.toString());
			assert.strictEqual(video.url, urlInt.toString());
		});

		it('url is required', async () => {
			//setup
			const title = 'title';
			const description = 'description';
			const expectedMessage = 'Path `url` is required.';

			//exercise
			const video = new Video({
				title: title,
				description: description
			});

			await video.validateSync();

			//assert
			assert.strictEqual(expectedMessage, video.errors.url.message);
		});
	});
});

module.exports = {
  connectDatabase,
  disconnectDatabase,
}
