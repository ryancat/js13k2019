import { palette } from '../../utils/colors'

export function kingIntroduction(kingSprite, playerSprite) {
  if (!kingSprite.state.hasIntroduced) {
    kingSprite.state.hasIntroduced = true
    return [
      {
        content: 'Hello warrior, welcome to the land of three gems!',
      },
      {
        content: 'I am the real king. You know, I run this place.',
      },
      {
        content:
          "However, that's until 5 years ago, when the dragons took our gems!",
      },
      {
        content: 'The world is suffering in fear...',
      },
      {
        content: 'Please bring back the gems and restore the world peace!',
      },
      {
        fromSpriteKey: 'PlayerDialogSprite',
        content:
          "That sounds great! Kill the dragons and get the gems, that's what I do for a living!",
      },
      {
        content:
          'Well, the dragon king is too powerful for you at this moment, I am afraid.',
      },
      {
        fromSpriteKey: 'PlayerDialogSprite',
        content: '...Excuse me?',
      },
      {
        content:
          'No offense! I am sure you will be stronger with the gem of fire.',
      },
      {
        content: 'Please find the gem of fire first!',
        options: {
          color: palette.red[3],
        },
      },
    ].map(conversation => {
      if (!conversation.fromSpriteKey) {
        conversation.fromSpriteKey = 'KingDialogSprite'
      }
      return conversation
    })
  } else {
    return [
      {
        fromSpriteKey: 'KingDialogSprite',
        content: 'Please find the gem of fire first!',
        options: {
          color: palette.red[3],
        },
      },
    ]
  }
}
