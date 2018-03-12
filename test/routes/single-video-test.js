/** /test/routes/single-video-test.js */

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

describe('Server path: /videos/:id', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('GET', () => {
    it('renders the Video', async () => {
      //setup
      const video = await Video.create({
        title: 'here is the title',
        description: 'here is the description',
        url: 'http://google.com'
      });

      //exercise
      const response = await request(app)
        .get('/videos/' + video._id);

      //assert
      assert.include(response.text, video.title);
      assert.include(response.text, video.url);
    });

    it('renders a form for the video edit', async () => {
      //setup
      const videoToEdit = await Video.create({
        title: 'edit this title',
        description: 'edit this description',
        url: 'edit this url'
      });

      //exercise
      const response = await request(app)
        .get('/videos/' + videoToEdit._id + '/edit');

      //assert
      assert.include(response.text, videoToEdit.title);
      assert.include(response.text, videoToEdit.description);
      assert.include(response.text, videoToEdit.url);
    });
  });
});
