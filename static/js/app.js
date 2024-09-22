document.addEventListener('DOMContentLoaded', function () {
    const audioPlayer = document.getElementById('audio-player');
    const songListElement = document.getElementById('song-list');
    const songTitle = document.getElementById('song-title');
    const albumImg = document.getElementById('album-img');
    const body = document.body;
    const progressBar = document.getElementById('progress-bar');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');

    let songs = [
        { title: "Title", file: "File" }
    ];

    let currentSongIndex = 0;
    const colorThief = new ColorThief();

    // Carica e riproduci la prima canzone al caricamento del sito
    renderSongList();
    playSong(0);

    function renderSongList() {
        songListElement.innerHTML = '';
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.textContent = song.title;
            li.draggable = true;
            li.onclick = () => playSong(index);
            songListElement.appendChild(li);
        });
    }

    async function playSong(index) {
        currentSongIndex = index;
        const song = songs[currentSongIndex];

        // Percorso corretto ai file locali
        audioPlayer.src = `/static/songs/${song.file}`;
        songTitle.textContent = song.title;

        // Percorso dell'immagine di copertura
        const coverImagePath = `/static/album-art/${song.file.replace('.mp3', '.jpg')}`;
        albumImg.src = coverImagePath;

        albumImg.onload = () => {
            if (albumImg.complete) {
                const colors = colorThief.getColor(albumImg);
                const backgroundColor = `rgb(${colors[0]}, ${colors[1]}, ${colors[2]})`;
                body.style.transition = 'background 0.5s ease';
                body.style.background = backgroundColor;
            }
        };

        audioPlayer.play();
        playPauseBtn.textContent = 'Pause';
    }

    // Aggiungi un evento per passare alla canzone successiva quando quella attuale finisce
    audioPlayer.onended = function () {
        if (currentSongIndex < songs.length - 1) {
            playSong(currentSongIndex + 1);
        } else {
            playSong(0); // Ritorna alla prima canzone
        }
    };

    nextBtn.onclick = function () {
        if (currentSongIndex < songs.length - 1) {
            playSong(currentSongIndex + 1);
        } else {
            playSong(0);
        }
    };

    prevBtn.onclick = function () {
        if (currentSongIndex > 0) {
            playSong(currentSongIndex - 1);
        } else {
            playSong(songs.length - 1);
        }
    };

    playPauseBtn.onclick = function () {
        if (audioPlayer.paused) {
            audioPlayer.play();
            this.textContent = 'Pause';
        } else {
            audioPlayer.pause();
            this.textContent = 'Play';
        }
    };

    audioPlayer.ontimeupdate = function () {
        progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    };

    progressBar.oninput = function () {
        audioPlayer.currentTime = (this.value / 100) * audioPlayer.duration;
    };
});
