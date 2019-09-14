function conv_king(kingSprite, playerSprite, incident) {
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
      kingWords = "Don't worry, I will make you stronger! (Attack + 1)"
      kingWordsColor = PALETTE_GREEN[4]
    }

    if (luckyRate < 0.3 && playerSprite[SPRITE_STATE][SPRITE_DAMAGE] > 1) {
      // Chance to lose damage
      playerSprite[SPRITE_STATE][SPRITE_DAMAGE]--
      kingWords =
        'Too much damange... Be careful, you are weaker now! (Attack - 1)'
      kingWordsColor = PALETTE_RED[4]
    }

    return [dialogContent_factory([kingSprite, kingWords, kingWordsColor])]
  }

  if (!kingSprite[SPRITE_CONVERSATION_STATES][0]) {
    kingSprite[SPRITE_CONVERSATION_STATES][0] = true
    return [
      [
        kingSprite,
        'Hello warrior, welcome to the land of real gems! (Enter key to next...)',
      ],
      [kingSprite, 'I am the real king. You know, I run this place.'],
      [
        kingSprite,
        "However, that's until 5 years ago, when the monsters took our magic gems!",
      ],
      [kingSprite, 'The world is suffering in fear...'],
      [kingSprite, 'Please bring back the gems!'],
      [playerSprite, 'I guess I can lend a hand!'],
      [
        kingSprite,
        'Thank you for your help! Remember, you can always come back and restore your health!',
      ],
      [playerSprite, 'Great!'],
      [
        kingSprite,
        'You are welcome! Now, the doors are open for you!',
        ,
        () => {
          const incidentGame = incident[INCIDENT_GAME]
          const doorSprites = group_getSpritesByIds(
            incident[INCIDENT_MAP_GROUP],
            incident[INCIDENT_DOORS].map(
              doorId => incidentGame[GAME_DOORS][doorId]
            )
          )
          doorSprites.forEach(doorSprite => {
            doorSprite[SPRITE_BACKGROUND_COLOR] = PALETTE_GREEN[3]
            doorSprite[SPRITE_HITTYPE] = HITTYPE_PASS
          })
        },
      ],
      [kingSprite, 'Please bring back our gems!', PALETTE_RED[3]],
    ].map(dialogContent_factory)
  } else if (playerSprite[SPRITE_STATE][PLAYER_FINISH_BOSS]) {
    if (!kingSprite[SPRITE_CONVERSATION_STATES][1]) {
      kingSprite[SPRITE_CONVERSATION_STATES][1] = true
      // Before game over
      return [
        [kingSprite, "You are back! How's your trip?"],
        [playerSprite, 'I killed monsters and a liar!'],
        [kingSprite, 'What happened?!'],
        [
          playerSprite,
          '(I told the king about the betrayal of John. His closest friend turns out to be a bad guy.)',
        ],
        [playerSprite, 'And here is the gems he stolen.'],
        [kingSprite, '...'],
        [kingSprite, "I couldn'd believe what happened!"],
        [
          kingSprite,
          'Thank you, my friend, for bringing me back the best gem...',
        ],
        [kingSprite, 'The gem of truth!'],
        [kingSprite, 'It worth more than all other gems combined.'],
        [
          kingSprite,
          'Your name will be remembered in our country! (GAME OVER!)',
          PALETTE_GREEN[4],
        ],
      ].map(dialogContent_factory)
    } else {
      return [
        dialogContent_factory([
          kingSprite,
          'Your name will be remembered in our country! (GAME OVER!)',
          PALETTE_GREEN[3],
        ]),
      ]
    }
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
