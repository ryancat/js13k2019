function conv_king(kingSprite, playerSprite) {
  const kingSpriteId = kingSprite[SPRITE_ID]
  const playerSpriteId = playerSprite[SPRITE_ID]
  if (!kingSprite[SPRITE_CONVERSATION_STATES][0]) {
    kingSprite[SPRITE_CONVERSATION_STATES][0] = true
    return [
      [kingSpriteId, 'Hello warrior, welcome to the land of three gems!'],
      [kingSpriteId, 'I am the real king. You know, I run this place.'],
      [
        kingSpriteId,
        "However, that's until 5 years ago, when the dragons took our gems!",
      ],
      [kingSpriteId, 'The world is suffering in fear...'],
      [kingSpriteId, 'Please bring back the gems and restore the world peace!'],
      [
        playerSpriteId,
        "That sounds great! Kill the dragons and get the gems, that's what I do for a living!",
      ],
      [
        kingSpriteId,
        'Well, the dragon king is too powerful for you at this moment, I am afraid.',
      ],
      [playerSpriteId, '...Excuse me?'],
      [
        kingSpriteId,
        'No offense! I am sure you will be stronger with the gem of fire.',
      ],
      [kingSpriteId, 'Please find the gem of fire first!', PALETTE_RED[3]],
    ].map(dialogContent_factory)
  } else {
    return [
      dialogContent_factory([
        kingSpriteId,
        'Please find the gem of fire first!',
        PALETTE_RED[3],
      ]),
    ]
  }
}
