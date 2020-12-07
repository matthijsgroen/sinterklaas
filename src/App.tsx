import React, { ReactElement } from "react";
import { Provider } from "react-redux";
import { store } from "./state/store";
import ConnectedScene from "./containers/Scene";
import { playEvent } from "./lib/events";
import scripts from "./content/scripts";
import gameState, { startScript } from "./content/gameState";
import { loadState } from "./lib/state/loadState";

const App = (): ReactElement => (
  <Provider store={store}>
    <ConnectedScene />
  </Provider>
);

const currentGame = loadState("autosave");

const play = async () => {
  const activeScript = currentGame ? currentGame.script : startScript;
  if (currentGame) {
    store.dispatch(gameState.actions.restore(currentGame.gameState));
  }

  await playEvent(store, scripts, activeScript);
};
play();

export default App;
