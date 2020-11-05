import React, { ReactElement } from "react";
import { Provider } from "react-redux";
import { store } from "./state/store";
import ConnectedScene from "./containers/Scene";
// import { pause } from "./lib/scene";
import { playEvent } from "./lib/events";
import event from "./content/scripts/demo";

const App = (): ReactElement => (
  <Provider store={store}>
    <ConnectedScene />
  </Provider>
);

const play = async () => {
  await playEvent(store, event);
};
play();

export default App;
