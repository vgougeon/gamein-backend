const pool = require('../database/db')
const axios = require('axios');
require('../services/validation')();

const addOstsToMedia = async function(req, res){
	const user = validation(req)
	// if(!user){ return res.status(500).send('not-logged-in')}
	if(!req.query.playlistId){ return res.status(500).send('no playlistId specified')}
	if(!req.query.game){ return res.status(500).send('no game specified')}

	const APIkey = 'AIzaSyD0k-fh1fizWSyODmBMsBJ-kmtOu9BrAPA';
	const data = []
	let response;
	let page = '';
	let end = false
	while(end === false){
		response = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2C+id&maxResults=50' + page + '&playlistId=' + req.query.playlistId + '&key=' + APIkey)
		for (const item of response.data.items) {
			data.push([
				parseInt(req.query.game),
				item.snippet.title,
				item.snippet.resourceId.videoId
			])
		}
		if(response.data.nextPageToken !== undefined){
			page = '&pageToken=' + response.data.nextPageToken
		}
		else {
			end = true
		}
	}
	pool.query(`
	INSERT INTO ost (media_id, name, video_id) VALUES ?
	`,
	[data])

	res.status(200).send('success')
}
module.exports = addOstsToMedia