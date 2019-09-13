function conv_john(johnSprite, playerSprite, incident) {
  if (!johnSprite[SPRITE_CONVERSATION_STATES][0]) {
    johnSprite[SPRITE_CONVERSATION_STATES][0] = true
    return [
      [johnSprite, 'Yes?'],
      [playerSprite, 'I...'],
      [johnSprite, 'Let me guess! You are looking for the gem of light?'],
      [playerSprite, 'Actually...'],
      [johnSprite, 'Wait! Is it gem of ice?'],
      [playerSprite, '(Sigh) Nope.'],
      [
        johnSprite,
        'Oh, it must be gem of fire then! You have a long way to go, my friend!',
      ],
      [playerSprite, 'Why do you say that?'],
      [
        johnSprite,
        'Well... You are not the first warrior come here. Definitely not the last one.',
      ],
      [
        johnSprite,
        'The land of three gems is not what it used to be. The dragons have taken all the three gems!',
      ],
      [johnSprite, 'They say the gem of fire will give you strength...'],
      [johnSprite, 'the gem of ice will give you dexterity...'],
      [johnSprite, 'and the gem of light will give you wisdom!'],
      [
        johnSprite,
        'Each gem is protected by a powerful dragon, and they are stronger than all the other monsters out there!',
      ],
      [
        johnSprite,
        'Remember! You cannot pass the doors unless all the monsters are cleard in that room!',
      ],
      [
        johnSprite,
        'I have cleared this room for you. You are welcome! Now the doors are opened!',
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
      [
        johnSprite,
        'Good luck, my friend! You need to find your way across the maze. I heard the gems are in the south',
      ],
    ].map(dialogContent_factory)
  } else if (johnSprite[SPRITE_CONVERSATION_STATES][1]) {
    johnSprite[SPRITE_CONVERSATION_STATES][1] = false
    return [
      [johnSprite, 'You KILL the dragon king! That never happened!!'],
      [playerSprite, 'It was... easy.'],
      [johnSprite, 'Ok, that was not expected...'],
      [
        playerSprite,
        'You are welcome! Now, where is the gems? I was told to bring them back.',
      ],
      [johnSprite, '...'],
      [playerSprite, 'John...?'],
      [johnSprite, '...'],
      [playerSprite, "John... John, are you ok? You don't look good."],
      [
        johnSprite,
        'I am sorry, my friend, but you are not going to leave here',
        PALETTE_RED[3],
        () => {
          johnSprite[SPRITE_NAME] = 'johnTheBadGuy'
          johnSprite[SPRITE_BACKGROUND_COLOR] = PALETTE_RED[4]
          johnSprite[SPRITE_BORDER_COLOR] = PALETTE_RED[4]
          johnSprite[SPRITE_STATE][SPRITE_HP] = 20
          johnSprite[SPRITE_STATE][SPRITE_HP_MAX] = 20
          johnSprite[SPRITE_STATE][SPRITE_DAMAGE] = 3
          johnSprite[SPRITE_STATE][SPRITE_ATTACK_RATE] = 200
        },
      ],
      [playerSprite, 'What...!?'],
      [
        johnSprite,
        'I took the gems! I am the richest person in the world, but I must hide that from the king!',
      ],
      [
        johnSprite,
        'The gems bring me everything, but I want more... I want the throne! I want to be the new king!',
      ],
      [playerSprite, 'That is not appropriate...'],
      [
        johnSprite,
        'Ha! Now that you know the truth, you are going to die with it!',
      ],
    ].map(dialogContent_factory)
  } else {
    return [
      dialogContent_factory([
        johnSprite,
        'Good luck, my friend! You need to find your way across the maze. I heard the gems are in the south',
        PALETTE_RED[3],
      ]),
    ]
  }
}
