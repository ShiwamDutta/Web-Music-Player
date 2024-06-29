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
