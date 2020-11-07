import React, { ReactElement } from "react";
import { Provider } from "react-redux";
import { store } from "./state/store";
import ConnectedScene from "./containers/Scene";
import { playEvent } from "./lib/events";
import scripts from "./content/scripts";

const App = (): ReactElement => (
  <Provider store={store}>
    <ConnectedScene />
  </Provider>
);

const play = async () => {
  await playEvent(store, scripts, "intro");
};
play();

export default App;
