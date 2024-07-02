const songFolder = "songs/";
const currSong = new Audio();

// toggle hamburger menu for small screen
toggleSideMenu();

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

function toggleSideMenu() {
  const leftPanel = document.querySelector(".left-sidebar");

  document.querySelector("#hamburger").addEventListener("click", () => {
    leftPanel.style.transform = "none";
  });

  document.querySelector("#cross").addEventListener("click", () => {
    leftPanel.style.transform = "translateX(-200%)";
  });
}

async function getSong(folder = songFolder) {
  const response = await fetch(`./${folder}details.txt`);
  // console.log(response.headers.get('content-type')) // --> text/plain
  const data = await response.text();
  return data.split("\n");
}

function libraryEventListener(songList) {
  Array.from(
    document.querySelector(".song-list").getElementsByTagName("li")
  ).forEach((item, index) => {
    item.addEventListener("click", () => playMusic(songList[index]));
  });
}

function updateCurrentSong(track) {
  console.log(`${songFolder}${track}`);
  currSong.src = `${songFolder}${track}`;
  document.querySelector(".play-bar #song-name").innerHTML = track
    .replace(".mp3", "")
    .replaceAll("_", " ");
  document.querySelector(".play-bar #song-time").innerHTML = "00:00 / 00:00";
}

function playMusic(track) {
  updateCurrentSong(track);
  currSong.play();
  document.querySelector(".play-bar #play img").src = "./image/pause.svg";
}

function currentSongTimeUpdate() {
  currSong.addEventListener("timeupdate", () => {
    document.querySelector(
      ".play-bar #song-time"
    ).innerHTML = `${secondsToMinutesSeconds(currSong.currentTime)} /
      ${secondsToMinutesSeconds(currSong.duration)}`;
    document.querySelector(".seek-bar .seek-complete").style.width = `${
      (currSong.currentTime / currSong.duration) * 100
    }%`;
  });
}

function controlButtonActionListener(songList) {
  document.querySelector("#play").addEventListener("click", () => {
    if (currSong.paused) {
      currSong.play();
      document.querySelector("#play img").src = "./image/pause.svg";
    } else {
      currSong.pause();
      document.querySelector("#play img").src = "./image/play.svg";
    }
  });

  document.querySelector("#previous").addEventListener("click", () => {
    let previousTrack =
      songList[songList.indexOf(currSong.src.split(`${songFolder}`)[1]) - 1];
    if (previousTrack != undefined) {
      playMusic(previousTrack);
    }
  });

  document.querySelector("#next").addEventListener("click", () => {
    let nextTrack =
      songList[songList.indexOf(currSong.src.split(`${songFolder}`)[1]) + 1];
    if (nextTrack != undefined) {
      playMusic(nextTrack);
    }
  });
}

function seekActionListener() {
  document.querySelector(".seek").addEventListener("click", (event) => {
    const seekBarRect = document
      .querySelector(".seek-bar")
      .getBoundingClientRect();
    const offsetX = event.pageX - seekBarRect.left;
    const seekBarWidth = seekBarRect.width;
    const percent = (offsetX / seekBarWidth) * 100;
    document.querySelector(".seek-complete").style.width = percent + "%";
    currSong.currentTime = (currSong.duration * percent) / 100;
  });
}

(async function () {
  const songs = await getSong();

  // Add songs to library
  const songUL = document.querySelector(".library .song-list ul");
  songUL.innerHTML = "";
  songs.forEach((song) => {
    console.log(song);
    let songName = song.replace(".mp3", "").replaceAll("_", " ");
    songUL.innerHTML += `<li>
      <img class="fill-invert" width="20" src="./image/music.svg" alt="Music" />
      <div class="song-info">
        <div class="name">${songName}</div>
        <div class="author">Singer</div>
      </div>
      <img src="./image/play_now.svg" class="fill-invert play-now" alt="Play Now" />
    </li>`;
  });

  // Setting default audio file
  updateCurrentSong(songs[0]);

  // Attach event listener to each song in playlist
  libraryEventListener(songs);

  // Attach event listener to play, skip next & previous buttons of play-bar
  controlButtonActionListener(songs);

  // Add an event listener to seek-bar
  seekActionListener();

  // Listen to time-update event
  currentSongTimeUpdate();
})();
