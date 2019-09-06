import { palette } from '../../utils/colors'

export function kingIntroduction(kingSprite, playerSprite) {
  if (!kingSprite.state.hasIntroduced) {
    kingSprite.state.hasIntroduced = true
    return [
      {
        fromSpriteKey: 'KingDialogSprite',
        content: 'Hello warrior, welcome to the land of three gem!',
      },
      {
        fromSpriteKey: 'KingDialogSprite',
        content: 'I am the real king. You know, I run this place.',
      },
      {
        fromSpriteKey: 'KingDialogSprite',
        content:
          "However, that's until 5 years ago, when the dragon king took the gem of peace!",
      },
      {
        fromSpriteKey: 'KingDialogSprite',
        content: 'The world is suffering without peace...',
      },
      {
        fromSpriteKey: 'KingDialogSprite',
        content: 'Please bring back the gem and restore the peace!',
      },
      {
        fromSpriteKey: 'PlayerDialogSprite',
        content: 'Sounds great! But where can I find the dragon king?',
      },
      {
        fromSpriteKey: 'KingDialogSprite',
        content: 'Well, the dragon king is too powerful for you, I am afraid.',
      },
      {
        fromSpriteKey: 'PlayerDialogSprite',
        content: '...Pardon?',
      },
      {
        fromSpriteKey: 'KingDialogSprite',
        content:
          'No offense! I am sure you will be stronger with the gem of fire.',
      },
      {
        fromSpriteKey: 'KingDialogSprite',
        content: 'Please find the gem of fire first!',
        options: {
          color: palette.red[3],
        },
      },
    ]
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
