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
        { title: "00", file: "00.mp3" },
        { title: "Baby Mama", file: "Baby Mama.mp3" },
        { title: "Bimbo in quartiere", file: "Bimbo in quartiere.mp3" },
        { title: "Bitch Affianco (feat. Il Ghost)", file: "Bitch Affianco (feat. Il Ghost).mp3" },
        { title: "Combattere", file: "Combattere.mp3" },
        { title: "Diversi", file: "Diversi.mp3" },
        { title: "Fratello mio (feat. Baby Gang & Simba La Rue)", file: "Fratello mio (feat. Baby Gang & Simba La Rue).mp3" },
        { title: "Gotham (feat. Kid Yugi)", file: "Gotham (feat. Kid Yugi).mp3" },
        { title: "Joti", file: "Joti.mp3" },
        { title: "Let's Go (feat. Paky & NLE Choppa)", file: "Let's Go (feat. Paky & NLE Choppa).mp3" },
        { title: "MAYBACH", file: "MAYBACH.mp3" },
        { title: "meet the grahams", file: "meet the grahams.mp3" },
        { title: "Milano Angels", file: "Milano Angels.mp3" },
        { title: "MOON (feat. Capo Plaza & Tony Boy)", file: "MOON (feat. Capo Plaza & Tony Boy).mp3" },
        { title: "MY BRUDDA (feat. Rondodasosa)", file: "MY BRUDDA (feat. Rondodasosa).mp3" },
        { title: "non odiare mai (feat. Coez, Gemitaiz, Noyz Narcos)", file: "non odiare mai (feat. Coez, Gemitaiz, Noyz Narcos).mp3" },
        { title: "Not Like Us", file: "Not Like Us.mp3" },
        { title: "Panamera", file: "Panamera.mp3" },
        { title: "Pasha Nanen", file: "Pasha Nanen.mp3" },
        { title: "Pluh", file: "Pluh.mp3" },
        { title: "SENZA TE", file: "SENZA TE.mp3" },
        { title: "Take 4", file: "Take 4.mp3" },
        { title: "Take 5", file: "Take 5.mp3" },
        { title: "Un milione di volte (feat. Sfera Ebbasta)", file: "Un milione di volte (feat. Sfera Ebbasta).mp3" },
        { title: "Visiera A Becco", file: "Visiera A Becco.mp3" }
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
