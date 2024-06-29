async function getSong(folder = "songs") {
  let localHost = "http://127.0.0.1:3000/Spotify-clone/";
  let response = await fetch(`${localHost}${folder}/`);
  let data = await response.text();

  let dummyElement = document.createElement("div");
  dummyElement.innerHTML = data;
  let songLinks = dummyElement.getElementsByTagName("a");

  const songs = [];
  Array.from(songLinks).forEach((element) => {
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`${folder}/`)[1]);
    }
  });

  return songs;
}

(async function () {
  const songs = await getSong();

  // Add songs to library
  let songUL = document.querySelector(".library .song-list ul");
  songUL.innerHTML = "";
  songs.forEach((song) => {
    console.log(song.replace(".mp3", ""));
    let songName = song.replace(".mp3", "").replaceAll("_", " ");
    songUL.innerHTML += `<li>
      <img
        class="fill-invert"
        width="20"
        src="./image/music.svg"
        alt="Music"
      />
      <div class="song-info">
        <div class="name">${songName}</div>
        <div class="author">Singer</div>
      </div>
      <img
        src="./image/play_now.svg"
        class="fill-invert play-now"
        alt="Play Now"
      />
    </li>`;
  });
})();
