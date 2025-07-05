console.log("Hello");

let currentsong = new Audio();
let songs

function formatTime(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    // Add leading zeros if needed
    mins = mins < 10 ? "0" + mins : mins;
    secs = secs < 10 ? "0" + secs : secs;

    return `${mins}:${secs}`;
}


async function getsongs() {
    let a = await fetch("http://127.0.0.1:3000/Spotify%20Clone/songs/");
    let response = await a.text();
    console.log(response);
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

const playmusic = (track) => {
    currentsong.src = "/Spotify%20Clone/songs/" + track;
    currentsong.play();

    // Update icon to pause
    play.innerHTML = `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.163 3.819C5 4.139 5 4.559 5 5.4v13.2c0 .84 0 1.26.163 1.581a1.5 1.5 0 0 0 .656.655c.32.164.74.164 1.581.164h.2c.84 0 1.26 0 1.581-.163a1.5 1.5 0 0 0 .656-.656c.163-.32.163-.74.163-1.581V5.4c0-.84 0-1.26-.163-1.581a1.5 1.5 0 0 0-.656-.656C8.861 3 8.441 3 7.6 3h-.2c-.84 0-1.26 0-1.581.163a1.5 1.5 0 0 0-.656.656zm9 0C14 4.139 14 4.559 14 5.4v13.2c0 .84 0 1.26.164 1.581a1.5 1.5 0 0 0 .655.655c.32.164.74.164 1.581.164h.2c.84 0 1.26 0 1.581-.163a1.5 1.5 0 0 0 .655-.656c.164-.32.164-.74.164-1.581V5.4c0-.84 0-1.26-.163-1.581a1.5 1.5 0 0 0-.656-.656C17.861 3 17.441 3 16.6 3h-.2c-.84 0-1.26 0-1.581.163a1.5 1.5 0 0 0-.655.656z" fill="#000000"></path></svg>`;

    // Reset icon to play after song ends
    currentsong.onended = () => {
        play.innerHTML = `<svg id="play" width="24px" height="24px" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5v14l11-7z" />
        </svg>`;
    };

    document.querySelector(".songinfo").innerHTML = decodeURIComponent(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
};


async function main() {


    // Getting all songs
    songs = await getsongs();
    console.log(songs);

    // Showing all the songs in the playlist
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songul.innerHTML += `<li data-song="${song}">
            <img class="invert" src="images/music.svg" alt="">
            <div class="info">
                <div class="song-name">${song.replaceAll("%20", " ").split("-")[0]}</div>
                <div class="artist-name">${song.replaceAll("%20", " ").split("-")[1].replace(".mp3", "")}</div>
            </div>
            <div class="duration" data-src="${song}">Loading...</div>
            <img class="invert" src="images/play.svg" alt="">
        </li>`;
    }

    document.querySelectorAll(".duration").forEach(el => {
        let audio = new Audio(`/Spotify%20Clone/songs/${el.dataset.src}`);
        audio.addEventListener("loadedmetadata", () => {
            el.innerText = formatTime(audio.duration);
        });
    });

    // Adding click listeners to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            const filename = e.getAttribute("data-song");
            playmusic(decodeURIComponent(filename));
        });
    });

    // Adding event listener for play buttons
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.innerHTML = `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.163 3.819C5 4.139 5 4.559 5 5.4v13.2c0 .84 0 1.26.163 1.581a1.5 1.5 0 0 0 .656.655c.32.164.74.164 1.581.164h.2c.84 0 1.26 0 1.581-.163a1.5 1.5 0 0 0 .656-.656c.163-.32.163-.74.163-1.581V5.4c0-.84 0-1.26-.163-1.581a1.5 1.5 0 0 0-.656-.656zm9 0C14 4.139 14 4.559 14 5.4v13.2c0 .84 0 1.26.164 1.581a1.5 1.5 0 0 0 .655.655c.32.164.74.164 1.581.164h.2c.84 0 1.26 0 1.581-.163a1.5 1.5 0 0 0 .655-.656c.164-.32.164-.74.164-1.581V5.4c0-.84 0-1.26-.163-1.581a1.5 1.5 0 0 0-.656-.656C17.861 3 17.441 3 16.6 3h-.2c-.84 0-1.26 0-1.581.163a1.5 1.5 0 0 0-.655.656z" fill="#000000"></path>
        </svg>`;
        } else {
            currentsong.pause();
            play.innerHTML = `<svg width="24px" height="24px" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5v14l11-7z" />
        </svg>`;
        }
    });

    //time update 
    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
        document.querySelector(".progressbar").style.width = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })

    //adding event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.currentTarget.getBoundingClientRect().width * 100)
        document.querySelector(".circle").style.left = percent + "%";
        document.querySelector(".progressbar").style.width = percent + "%";
        currentsong.currentTime = (currentsong.duration) * percent / 100
    })

    //adding event listener for hamburger 
    document.querySelector(".ham").addEventListener("click", e => {
        document.querySelector(".left").style.left = "0"
    })

    //adding event listener for close 
    document.querySelector(".close").addEventListener("click", e => {
        document.querySelector(".left").style.left = "-100%"
    })

    //adding event listener to next prev 
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log(songs, index);
        if (index - 1 < 0) {
            playmusic(songs[songs.length - 1])
        }
        else {
            playmusic(songs[index - 1])
        }
    })
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log(songs, index);
        if (index + 1 >= songs.length) {
            playmusic(songs[0])
        }
        else {
            playmusic(songs[index + 1])
        }
    })

    //adding event listener to volume 
    document.getElementById("volume-seekbar").addEventListener("input", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100
    })

    //volume slider gradient
    const volumeSlider = document.getElementById("volume-seekbar");
    volumeSlider.addEventListener("input", (e) => {
        const val = e.target.value;
        currentsong.volume = parseInt(val) / 100;
        // Dynamically update background gradient to show progress
        e.target.style.background = `linear-gradient(to right, #1ed760 ${val}%, #ccc ${val}%)`;
    });

    //mute unmute
    let isMuted = false;

document.getElementById("volume-icon").addEventListener("click", () => {
    isMuted = !isMuted;
    currentsong.muted = isMuted;

    const icon = document.getElementById("volume-icon");
    if (isMuted) {
        icon.src = "images/mute.svg"; 
    } else {
        icon.src = "images/volume.svg"; 
    }
});

}

main();
