const express = require('express');
const router = express.Router();
const userRoute = require('./user');
const postRoutes = require('./posts');

router.use('/api', userRoute);
router.use('/api', postRoutes);

module.exports = router;
