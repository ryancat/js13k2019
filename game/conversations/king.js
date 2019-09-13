function conv_king(kingSprite, playerSprite) {
  const kingSpriteId = kingSprite[SPRITE_ID]
  const playerSpriteId = playerSprite[SPRITE_ID]

  if (playerSprite[SPRITE_STATE][SPRITE_HP] <= 0) {
    // save player first
    const luckyRate = Math.random()
    let kingWords = 'Let me help you, my friend!'
    let kingWordsColor
    if (luckyRate > 0.7) {
      // Chance to gain extra damage
      playerSprite[SPRITE_STATE][SPRITE_DAMAGE]++
      kingWords = "Don't worry, I will make you stronger!"
      kingWordsColor = PALETTE_GREEN[4]
    }

    if (luckyRate < 0.3 && playerSprite[SPRITE_STATE][SPRITE_DAMAGE] > 1) {
      // Chance to lose damage
      playerSprite[SPRITE_STATE][SPRITE_DAMAGE]--
      kingWords = 'Too much damange... Be careful, you are weaker now!'
      kingWordsColor = PALETTE_RED[4]
    }

    return [dialogContent_factory([kingSpriteId, kingWords, kingWordsColor])]
  }

  if (!kingSprite[SPRITE_CONVERSATION_STATES][0]) {
    kingSprite[SPRITE_CONVERSATION_STATES][0] = true
    return [
      [kingSpriteId, 'Hello warrior, welcome to the land of real gems!'],
      [kingSpriteId, 'I am the real king. You know, I run this place.'],
      [
        kingSpriteId,
        "However, that's until 5 years ago, when the dragons took our gems!",
      ],
      [kingSpriteId, 'The world is suffering in fear...'],
      [kingSpriteId, 'Please bring back the gems and restore the world peace!'],
      [
        playerSpriteId,
        "That sounds great! Kill the dragons and take the gems, that's what I do for a living!",
      ],
      [
        kingSpriteId,
        'Thank you for your help! Remember, you can always come back and restore your health!',
      ],
      [playerSpriteId, 'Wow!'],
      [kingSpriteId, 'You are welcome! Now, the doors are open for you!'],
      [kingSpriteId, 'Please bring back our gems!', PALETTE_RED[3]],
    ].map(dialogContent_factory)
  } else {
    return [
      dialogContent_factory([
        kingSpriteId,
        'Please bring back our gems!',
        PALETTE_RED[3],
      ]),
    ]
  }
}
