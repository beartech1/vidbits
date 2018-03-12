/** /test/routes/create-test.js */

const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const Video = require('../../models/video');

const app = require('../../app');

const parseTextFromHTML = (htmlAsString, selector) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    return selectedElement.textContent;
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`);
  }
};

describe('Server path: /videos', () => {
	beforeEach(connectDatabase);

	afterEach(disconnectDatabase);

	describe('POST', () => {
		it('creates and saves a new video', async () => {
			//setup
			const videoToCreate = {
				title: 'title here',
				description: 'description here',
        url: 'url'
			};

			//exercise
			const response = await request(app)
				.post('/videos')
				.type('form')
				.send(videoToCreate);

			//assert
			assert.equal(response.status, 302);
		});
	});

	describe('POST', () => {

		it('actually saves a video', async () => {
			//setup
			const videoToCreate = {
				title: 'new video',
				description: 'new description',
        url: 'http://example.com'
			};

			//exercise
			const response = await request(app)
				.post('/videos')
				.type('form')
				.send(videoToCreate);

			const videoFromDb = await Video.findOne({});

			//assert
			assert.equal(videoFromDb.title, videoToCreate.title);
			assert.equal(videoFromDb.description, videoToCreate.description);
      assert.equal(videoFromDb.url, videoToCreate.url);
      assert.equal(response.status, 302);
		});

		it('missing title does not save the Video', async () => {
			//setup
			const missingTitle = {
				description: 'description',
        url: 'url'
			};

			//exercise
			const response = await request(app)
				.post('/videos')
				.type('form')
				.send(missingTitle);

				const allItems = await Video.find({});

			//assert
			assert.equal(allItems.length, 0);
			assert.equal(response.status, 400);
		});

		it('missing title renders the video form', async () => {
			//setup
			const missingTitle = {
				description: 'description',
        url: 'url'
			};

			//exercise
			const response = await request(app)
				.post('/videos')
				.type('form')
				.send(missingTitle);

			//assert
			assert.include(parseTextFromHTML(response.text, 'form'), 'Create new');
      assert.include(parseTextFromHTML(response.text, 'body'), missingTitle.description);
      assert.include(response.text, missingTitle.url);
		});

    it('missing title gets error', async () => {
      //setup
			const missingTitle = {
				description: 'description',
        url: 'url'
			};

			//exercise
			const response = await request(app)
				.post('/videos')
				.type('form')
				.send(missingTitle);

      //assert
      assert.include(response.text, '&#x60;title&#x60; is required.');
    });

    it('missing url gets error', async () => {
      //setup
      const missingUrl = {
        title: 'title',
        description: 'description'
      };

      //exercise
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(missingUrl);

        //assert
        assert.include(response.text, '&#x60;url&#x60; is required.');
    });
	});
});
