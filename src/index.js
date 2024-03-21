const spotifyWrapper = document.querySelector(".spotify");

// Template function for artist links
const artistTemplate = (artist) =>
  `<a href="${artist.external_urls.spotify}">${artist.name}</a>`;

// Fetch the currently playing track information
fetch("/.netlify/functions/spotify")
  .then((res) => res.json())
  .then((data) => {
    const { item: track, context } = data; // Extract the track and context objects
    const trackUrl = track.external_urls.spotify; // URL to the track on Spotify
    const name = track.name; // Track name
    const artists = track.artists; // Array of artists
    const artworkUrl = track.album.images[0].url; // URL of the track's album cover image

    // Update the HTML content
    spotifyWrapper.innerHTML = `
      <div class="song">
        <a href="${trackUrl}">${name}</a>
      </div>
      <div class="artists">${artists.map(artist => artistTemplate(artist)).join(", ")}</div>
      <img class="artwork" src="${artworkUrl}"/>
    `;
  })
  .catch((err) => console.error(err));
