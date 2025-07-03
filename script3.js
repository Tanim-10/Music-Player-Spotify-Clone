console.log("Hello");


async function getsongs() {
    let a = await fetch("http://127.0.0.1:3000/Spotify%20Clone/songs/")
    let response = await a.text()
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    // console.log(as);
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}

const playmusic = (track) => {
    let audio = new Audio("/songs/" + track)
    audio.play()
}


async function main() {

    let currentsong
    //getting all songs
    let songs = await getsongs()
    console.log(songs);

    //showing all the song in the playlist

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
                            <img class="invert" src="images/music.svg" alt="">
                            <div class="info">
                                <div class="song-name">${song.replaceAll("%20", " ").split("-")[0]}</div>
                                <div class="artist-name">${song.replaceAll("%20", " ").split("-")[1].replace(".mp3", "")}</div>
                            </div>
                            <div class="duration">00:00</div>
                            <img class="invert" src="images/play.svg" alt="">
                            </li>`
    }


    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element =>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    });
}

main()

