const songFolder = "/Spotify-clone/songs/";
const currSong = new Audio();

async function getSong(folder = songFolder) {
  let localHost = "http://127.0.0.1:3000";
  let response = await fetch(`${localHost}${folder}`);
  let data = await response.text();

  let dummyElement = document.createElement("div");
  dummyElement.innerHTML = data;
  let songLinks = dummyElement.getElementsByTagName("a");

  const songs = [];
  Array.from(songLinks).forEach((element) => {
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`${folder}`)[1]);
    }
  });

  return songs;
}

function playMusic(track) {
  console.log(songFolder + track);
  currSong.src = songFolder + track;
  currSong.play();
  document.querySelector(".play-bar #play img").src = "./image/pause.svg";
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

  // Setting default audio file
  currSong.src = songFolder + songs[0];

  // Attach event listener to each song
  Array.from(
    document.querySelector(".song-list").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      let song = e.querySelector(".song-info .name").innerHTML;
      playMusic(`${song.replaceAll(" ", "_")}.mp3`);
    });
  });

  // Attach event listener to play, skip next & previous buttons of play-bar
  document.querySelector("#play").addEventListener("click", () => {
    if (currSong.paused) {
      currSong.play();
      document.querySelector("#play img").src = "./image/pause.svg";
    } else {
      currSong.pause();
      document.querySelector("#play img").src = "./image/play.svg";
    }
  });
})();
