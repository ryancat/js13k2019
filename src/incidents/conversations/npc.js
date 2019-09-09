import { palette } from '../../utils/colors'

export function npcJohn(npcJohnSprite, playerSprite) {
  return [
    {
      content: '',
    },
    {
      content: 'Please find the gem of fire first!',
      options: {
        color: palette.red[3],
      },
    },
  ].map(conversation =>
    Object.assign(conversation, {
      fromSpriteKey: 'NpcJohnDialogSprite',
    })
  )
}
