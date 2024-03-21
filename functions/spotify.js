const fetch = require("node-fetch");
const dotenv = require("dotenv");
dotenv.config();

exports.handler = async (event, context) => {
    // Get the refresh token we stored as an environment variable
    const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

    // Do the base64 encoding with Node tools
    const auth = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64");

    // Store the Spotify API endpoint for readability
    const tokenEndpoint = `https://accounts.spotify.com/api/token`;

    // Options for the token request
    const options = {
        method: "POST",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=refresh_token&refresh_token=${refreshToken}&redirect_uri=${encodeURI(
          process.env.URL + "/.netlify/functions/callback"
        )}`,
    };

    // Fetch the access token from Spotify
    const accessToken = await fetch(tokenEndpoint, options)
        .then((res) => res.json())
        .then((json) => {
            return json.access_token;
        })
        .catch((err) => {
            console.error(err);
            // It's important to handle errors properly
            return null; // Return null to indicate failure
        });

    // Early exit if there was an error getting the access token
    if (!accessToken) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to obtain access token." }),
        };
    }

    // Spotify endpoint for fetching recently played tracks
    const playerEndpoint = `https://api.spotify.com/v1/me/player/recently-played`;

    // Fetch the recently played track
    return fetch(`${playerEndpoint}?limit=1`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    .then((res) => res.json())
    .then((json) => {
        // Optionally, transform the results here
        console.log(json);

        // Return the results
        return {
            statusCode: 200,
            body: JSON.stringify(json),
        };
    })
    .catch((err) => {
        console.error(err);
        // Handle errors from the second fetch
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "An error occurred while fetching data from Spotify." }),
        };
    });
};
