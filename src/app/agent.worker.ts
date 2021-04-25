/// <reference lib="webworker" />

import { evaluateNextMove } from 'src/game/ai/pmcs-agent';
import { ConnectContext } from 'src/game/game-context';

addEventListener('message', ({ data }) => {
  let context = new ConnectContext();
  context._context = data.context; // Need to reconstruct context because object methods are not preserved through data
  evaluateNextMove(context, data.rounds).then((value) => {
    postMessage(value);
  });
});
