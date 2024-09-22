from flask import Flask, render_template, send_from_directory, jsonify, Response
from mutagen.mp3 import MP3
from mutagen.id3 import ID3, APIC
import os
import base64

app = Flask(__name__)

SONGS_FOLDER = os.path.join(os.getcwd(), 'static', 'songs')

@app.route('/')
def index():
    return render_template('index.html')

# Serve the song files
@app.route('/songs/<filename>')
def serve_song(filename):
    return send_from_directory(SONGS_FOLDER, filename)

# Extract album art from the song file
@app.route('/album-art/<filename>')
def get_album_art(filename):
    song_path = os.path.join(SONGS_FOLDER, filename)
    audio = MP3(song_path, ID3=ID3)
    
    # Extract album cover
    for tag in audio.tags.values():
        if isinstance(tag, APIC):  # APIC tag is for album art
            album_art = tag.data
            return Response(album_art, mimetype='image/jpeg')
    
    # Return default image if no album art is found
    return send_from_directory('static', 'images/default.jpg')

# Get the list of available songs and their metadata
@app.route('/songs')
def get_songs():
    songs = [
        {
            'title': f.replace('.mp3', ''),
            'file': f
        } for f in os.listdir(SONGS_FOLDER) if f.endswith('.mp3')
    ]
    return jsonify(songs)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)

