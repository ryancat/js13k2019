function conv_john(johnSprite, playerSprite, incident) {
  const johnSpriteId = johnSprite[SPRITE_ID]
  const playerSpriteId = playerSprite[SPRITE_ID]

  if (!johnSprite[SPRITE_CONVERSATION_STATES][0]) {
    johnSprite[SPRITE_CONVERSATION_STATES][0] = true
    return [
      [johnSpriteId, 'Yes?'],
      [playerSpriteId, 'I...'],
      [johnSpriteId, 'Let me guess! You are looking for the gem of light?'],
      [playerSpriteId, 'Actually...'],
      [johnSpriteId, 'Wait! Is it gem of ice?'],
      [playerSpriteId, '(Sigh) Nope.'],
      [
        johnSpriteId,
        'Oh, it must be gem of fire then! You have a long way to go, my friend!',
      ],
      [playerSpriteId, 'Why do you say that?'],
      [
        johnSpriteId,
        'Well... You are not the first warrior come here. Definitely not the last one.',
      ],
      [
        johnSpriteId,
        'The land of three gems is not what it used to be. The dragons have taken all the three gems!',
      ],
      [johnSpriteId, 'They say the gem of fire will give you strength...'],
      [johnSpriteId, 'the gem of ice will give you dexterity...'],
      [johnSpriteId, 'and the gem of light will give you wisdom!'],
      [
        johnSpriteId,
        'Each gem is protected by a powerful dragon, and they are stronger than all the other monsters out there!',
      ],
      [
        johnSpriteId,
        'Remember! You cannot pass the doors unless all the monsters are cleard in that room!',
      ],
      [
        johnSpriteId,
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
        johnSpriteId,
        'Good luck, my friend! You need to find your way across the maze. I heard the gems are in the south',
      ],
    ].map(dialogContent_factory)
  } else {
    return [
      dialogContent_factory([
        johnSpriteId,
        'Good luck, my friend! You need to find your way across the maze. I heard the gems are in the south',
        PALETTE_RED[3],
      ]),
    ]
  }
}
