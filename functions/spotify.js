const fetch = require("node-fetch");
const dotenv = require("dotenv");
dotenv.config();

exports.handler = async (event, context) => {
    const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
    const auth = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64");
    const tokenEndpoint = `https://accounts.spotify.com/api/token`;

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

    const accessToken = await fetch(tokenEndpoint, options)
        .then((res) => res.json())
        .then((json) => {
            return json.access_token;
        })
        .catch((err) => {
            console.error(err);
            return null;
        });

    if (!accessToken) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to obtain access token." }),
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        };
    }

    const playerEndpoint = `https://api.spotify.com/v1/me/player/currently-playing`;

    return fetch(`${playerEndpoint}?limit=1`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    .then((res) => res.json())
    .then((json) => {
        // Check the origin of the request
        const origin = event.headers.origin;
        const allowedOrigins = [
            'https://aron-staging.webflow.io/',
            'https://aronmoll.nl'
        ];
        
        // Set headers to allow CORS if the origin is in the allowed list
        const headers = {
            "Content-Type": "application/json",
        };
        
        if (allowedOrigins.includes(origin)) {
            headers["Access-Control-Allow-Origin"] = origin;
            headers["Vary"] = "Origin"; // Ensures the cache varies based on the Origin header
        }

        return {
            statusCode: 200,
            body: JSON.stringify(json),
            headers: headers,
        };
    })
    .catch((err) => {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "An error occurred while fetching data from Spotify." }),
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        };
    });
};
