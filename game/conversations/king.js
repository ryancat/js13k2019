function conv_king(kingSprite, playerSprite) {
  if (
    playerSprite[SPRITE_STATE][SPRITE_HP] <
    playerSprite[SPRITE_STATE][SPRITE_HP_MAX]
  ) {
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

    return [dialogContent_factory([kingSprite, kingWords, kingWordsColor])]
  }

  if (!kingSprite[SPRITE_CONVERSATION_STATES][0]) {
    kingSprite[SPRITE_CONVERSATION_STATES][0] = true
    return [
      [kingSprite, 'Hello warrior, welcome to the land of real gems!'],
      [kingSprite, 'I am the real king. You know, I run this place.'],
      [
        kingSprite,
        "However, that's until 5 years ago, when the dragons took our gems!",
      ],
      [kingSprite, 'The world is suffering in fear...'],
      [kingSprite, 'Please bring back the gems and restore the world peace!'],
      [
        playerSprite,
        "That sounds great! Kill the dragons and take the gems, that's what I do for a living!",
      ],
      [
        kingSprite,
        'Thank you for your help! Remember, you can always come back and restore your health!',
      ],
      [playerSprite, 'Wow!'],
      [kingSprite, 'You are welcome! Now, the doors are open for you!'],
      [kingSprite, 'Please bring back our gems!', PALETTE_RED[3]],
    ].map(dialogContent_factory)
  } else {
    return [
      dialogContent_factory([
        kingSprite,
        'Please bring back our gems!',
        PALETTE_RED[3],
      ]),
    ]
  }
}
