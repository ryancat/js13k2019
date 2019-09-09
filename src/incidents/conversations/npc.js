import { palette } from '../../utils/colors'

export function john(npcJohnSprite, playerSprite, incident) {
  if (
    incident.cellRow === incident.game.maze.startRow &&
    incident.cellCol === incident.game.maze.startCol
  ) {
    if (!npcJohnSprite.state.hasIntroduced) {
      npcJohnSprite.state.hasIntroduced = true

      return [
        {
          content: 'Yes?',
        },
        {
          fromSpriteKey: 'PlayerDialogSprite',
          content: 'I...',
        },
        {
          content: 'Let me guess! You are looking for the gem of light?',
        },
        {
          fromSpriteKey: 'PlayerDialogSprite',
          content: 'Actually...',
        },
        {
          content: 'Wait! Is it gem of ice?',
        },
        {
          fromSpriteKey: 'PlayerDialogSprite',
          content: '(Sigh) Nope',
        },
        {
          content:
            'Oh, it must be gem of fire then! You have a long way to go, my friend!',
        },
        {
          fromSpriteKey: 'PlayerDialogSprite',
          content: 'Why do you say that?',
        },
        {
          content:
            'Well... You are not the first warrior come here. Definitely not the last one.',
        },
        {
          content:
            'The land of three gems is not what it used to be. The dragons have taken all the three gems!',
        },
        {
          content: 'They say the gem of fire will give you strenth...',
        },
        {
          content: 'the gem of ice will give you dexterity...',
        },
        {
          content: 'and the gem of light will give you wisdom!',
        },
        {
          content:
            'Each gem is protected by a powerful dragon, and they are stronger than all other monsters out there!',
        },
        {
          content:
            'Remember! You cannot pass the doors unless all the monsters are cleard in that room!',
        },
        {
          content:
            'I have cleared this room for you. You are welcome! Now the doors are opened!',
          contentCallback: () => {
            incident.doorScenes.forEach(doorScene => {
              doorScene.backgroundColor = palette.green[3]
              doorScene.hitType = 'pass'
            })
          },
        },
        {
          content:
            'Good luck, my friend! You need to find your way across the maze. I heard the gem of fire is in the south',
          options: {
            color: palette.red[3],
          },
        },
      ].map(conversation => {
        if (!conversation.fromSpriteKey) {
          conversation.fromSpriteKey = 'NpcJohnDialogSprite'
        }
        return conversation
      })
    } else {
      return [
        {
          fromSpriteKey: 'NpcJohnDialogSprite',
          content: 'I heard the gem of fire is in the south',
          options: {
            color: palette.red[3],
          },
        },
      ]
    }
  }
}
