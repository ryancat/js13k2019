function conv_john(johnSprite, playerSprite) {
  const johnSpriteId = johnSprite[SPRITE_ID]
  const playerSpriteId = playerSprite[SPRITE_ID]
  if (!johnSprite[SPRITE_CONVERSATION_STATES][0]) {
    johnSprite[SPRITE_CONVERSATION_STATES][0] = true
    return [
      [johnSpriteId, 'Hello warrior, welcome to the land of three gems!'],
      [johnSpriteId, 'I am the real king. You know, I run this place.'],
      [
        johnSpriteId,
        "However, that's until 5 years ago, when the dragons took our gems!",
      ],
      [johnSpriteId, 'The world is suffering in fear...'],
      [johnSpriteId, 'Please bring back the gems and restore the world peace!'],
      [
        playerSpriteId,
        "That sounds great! Kill the dragons and get the gems, that's what I do for a living!",
      ],
      [
        johnSpriteId,
        'Well, the dragon king is too powerful for you at this moment, I am afraid.',
      ],
      [playerSpriteId, '...Excuse me?'],
      [
        johnSpriteId,
        'No offense! I am sure you will be stronger with the gem of fire.',
      ],
      [johnSpriteId, 'Please find the gem of fire first!', PALETTE_RED[3]],
    ].map(dialogContent_factory)
  } else {
    return [
      dialogContent_factory([
        johnSpriteId,
        'Please find the gem of fire first!',
        PALETTE_RED[3],
      ]),
    ]
  }
}
