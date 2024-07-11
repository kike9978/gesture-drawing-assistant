const axios = require('axios');

exports.handler = async function (event, context) {
    const { query } = JSON.parse(event.body);
    const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

    try {
        const response = await axios.get(`https://youtube.googleapis.com/youtube/v3/search`, {
            params: {
                part: 'snippet',
                q: query,
                key: API_KEY,
                maxResults: 10
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify(response.data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch videos' })
        };
    }
};