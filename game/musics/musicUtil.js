function musicUtil_initBackgroundSong(game) {
  game[GAME_MUSIC_AUDIO_CONTEXT] = new (window.AudioContext ||
    window.webkitAudioContext)()
  sonantxr_generate_song(
    game[GAME_MUSIC_AUDIO_CONTEXT],
    BACKGROUND_SONG,
    buffer => {
      game[GAME_MUSIC_BACKGROUND_BUFFER] = buffer
      game[GAME_MUSIC_BACKGROUND_READY] = true
    }
  )
}

function musicUtil_playBackgroundSong(game) {
  const audioContext = game[GAME_MUSIC_AUDIO_CONTEXT]
  const source = audioContext.createBufferSource()
  source.buffer = game[GAME_MUSIC_BACKGROUND_BUFFER]
  source.loop = true
  source.connect(audioContext.destination)
  source.start()
}
