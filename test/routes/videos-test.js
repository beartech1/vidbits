/** /test/routes/index-test.js */

const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const app = require('../../app');
const Video = require('../../models/video');

const parseTextFromHTML = (htmlAsString, selector) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    return selectedElement.textContent;
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`);
  }
};

describe('user visits the landing page', () => {
  beforeEach(connectDatabase);

  afterEach(disconnectDatabase);

  describe('with an existing video', () => {
    it('renders it in the list', async () => {
        const videoToCreate = {
          title: 'see it in the list title',
          description: 'see it in the list description',
          url: 'see it in the list url'
        };

        const video = await Video.create(videoToCreate);

        const response = await request(app)
          .get('/');

        assert.include(parseTextFromHTML(response.text, '.video-title'), videoToCreate.title);
    });

    it('an iframe with a video\'s URL is present on your landing page', async () => {
      const videoToCreate = {
        title: 'does this have an iframe',
        description: 'does this have an iframe description',
        url: 'http://google.com'
      };

      const video = await Video.create(videoToCreate);

      const response = await request(app)
        .get('/');

      assert.include(response.text, videoToCreate.url);
    });

    it('/videos/:id updates an existing record', async () => {
      const createVideo = {
        title: 'this title will be updated',
        description: 'this description will be updated',
        url: 'http://woot.com'
      };

      const updateRecord = {
        title: 'updated title',
        description: 'updated description',
        url: 'http://updated-url.com'
      };

      const video = await Video.create(createVideo);

      const response = await request(app)
        .post('/videos/' + video._id)
        .type('form')
        .send(updateRecord);

        assert.include(response.text, updateRecord.title);
        assert.include(response.text, updateRecord.description);
        assert.equal(response.status, 302);
    });

    it('/videos/:id validates missing properties', async () => {
      const createVideo = {
        title: 'this title will not be updated',
        description: 'this description will not be updated',
        url: 'http://not-updated.com'
      };

      const video = await Video.create(createVideo);

      const willNotUpdate = {
        description: 'will not update'
      };

      const response = await request(app)
        .post('/videos/' + video._id)
        .type('form')
        .send(willNotUpdate);

      assert.equal(response.status, 400);
    });

    it('/videos/:id/delete', async () =>{
      const newVideo = {
        title: 'testTitle',
        description: 'testDescripton',
        url: 'http://url.com'
      };

      const video = await Video.create(newVideo);

      const response = await request(app)
        .post('/videos/' + video._id + '/delete')
        .type('form')
        .send();

      assert.equal(response.status, 204);
      assert.notInclude(response.text, video.title);
      assert.notInclude(response.text, video.description);
      assert.notInclude(response.text, video.url);
    });
  });
});
