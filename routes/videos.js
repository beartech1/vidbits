const router = require('express').Router();

const Video = require('../models/video');

router.post('/videos', async(req, res, next) => {
	const {title, description, url} = req.body;
	const newVideo = new Video({title, description, url});
	newVideo.validateSync();
	if (newVideo.errors) {
		res.status(400).render('videos/create', {video: newVideo});
	} else {
		await newVideo.save();
		res.status(302).render('videos/show', {video: newVideo});
	}
});

router.get('/', async(req, res, next) => {
	const videos = await Video.find({});
	res.render('videos/index', {videos});
});

router.get('/videos/create', async(req, res, next) => {
	res.render('videos/create');
});

router.get('/videos/:videoId/edit', async (req, res, next) => {
	const _id = req.params.videoId;

	const video = await Video.findById(_id);
	res.render('videos/create', {video: video});
});

router.get('/videos/:videoId', async (req, res, next) => {
	const _id = req.params.videoId;

	const video = await Video.findById(_id);
	res.render('videos/show', {video: video});
});

router.post('/videos/:videoId', async (req, res, next) => {
	const _id = req.params.videoId;

	const existing = await Video.findById(_id);

	existing.title = req.body.title;
	existing.description = req.body.description;
	existing.url = req.body.url;

	existing.validateSync();
	if (existing.errors) {
		res.status(400).render('videos/create', {video: existing});
	} else {
		await existing.save();
		res.status(302).render('videos/show', {video: existing});
	}
});

router.post('/videos/:videoId/delete', async (req, res, next) => {
	const _id = req.params.videoId;

	const existing = await Video.findById(_id);

	existing.remove();

	const videos = await Video.find({});

	res.status(204).render('videos/index', {videos})
});

module.exports = router;
