console.log("Hello");

async function getsongs() {
    let a = await fetch("http://127.0.0.1:3000/Spotify%20Clone/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}

function formatTime(duration) {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}

async function main() {
    // Get all songs
    let songs = await getsongs();
    console.log(songs);

    // Play the first song
    let firstAudio = new Audio("http://127.0.0.1:3000/Spotify%20Clone/songs/" + songs[0]);
    // firstAudio.play();
    firstAudio.addEventListener("loadeddata", () => {
        console.log(firstAudio.duration, firstAudio.currentSrc, firstAudio.currentTime);
    });

    // Populate song list
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        const li = document.createElement("li");

        // Set initial content
        li.innerHTML = `
            <img class="invert" src="images/music.svg" alt="">
            <div class="info">
                <div class="song-name">${song.replaceAll("%20", " ").split("-")[0]}</div>
                <div class="artist-name">${song.replaceAll("%20", " ").split("-")[1].replace(".mp3", "")}</div>
            </div>
            <div class="duration">Loading...</div>
            <img class="invert" src="images/play.svg" alt="">
        `;

        songul.appendChild(li);

        // Load and update duration
        const audio = new Audio("http://127.0.0.1:3000/Spotify%20Clone/songs/" + song);
        audio.addEventListener("loadedmetadata", () => {
            const duration = formatTime(audio.duration);
            li.querySelector(".duration").innerText = duration;
        });
    }
}

main();
