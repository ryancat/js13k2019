import { createCastleHall } from '../maps/castle/createCastleHall';

export function castleHallGameStart(game, dt) {
  if (game.flag.castleHallGameStart) {
    return true;
  }

  console.log('start castleHallGameStart', game, dt);

  // Render map
  const castleHallMap = createCastleHall();

  game.flag.castleHallGameStart = true;
};
