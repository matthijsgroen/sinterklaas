import { connect } from "react-redux";
import React, { useEffect } from "react";
import Background from "../components/Background";
import Scene from "../components/Scene";
import Character from "../components/Character";
import ScreenFade from "../components/ScreenFade";
import Dialog from "../components/Dialog";
import Menu from "./Menu";
import screenState from "../state/screen";
import { RootState } from "../state/store";
import { DollSettings } from "../content/dolls/types";
import { DialogState } from "../state/dialog";
import { Character as CharacterType } from "../state/characters";
import { Doll } from "../content/dolls";

interface ConnectedSceneProps {
  dialog: DialogState;
  characters: CharacterType<keyof DollSettings>[];
  background: RootState["background"];
  screen: RootState["screen"];
  stopPunch: typeof screenState.actions.stopPunch;
}

const ConnectedScene: React.FC<ConnectedSceneProps> = ({
  background,
  dialog,
  characters,
  screen,
  stopPunch,
}) => {
  useEffect(() => {
    setTimeout(() => {
      stopPunch();
    }, 500);
  }, [screen.horizontalPunch, screen.verticalPunch, stopPunch]);
  return (
    <Scene
      horizontalPunch={screen.horizontalPunch}
      verticalPunch={screen.verticalPunch}
    >
      <Background {...background} />
      {characters
        .filter(({ portrait }) => !portrait)
        .map(({ id, doll, x, y, visible, scale, flipped, dollSettings }) => (
          <Character
            key={id}
            visible={visible}
            character={<Doll doll={doll} settings={dollSettings} />}
            mirrored={flipped}
            scale={scale}
            x={x}
            y={y}
          />
        ))}
      <ScreenFade active={screen.fadeOut} color={screen.color} />
      {dialog.visible && (
        <Dialog
          name={dialog.name}
          paddingLeft={dialog.settings.paddingLeft}
          paddingRight={dialog.settings.paddingRight}
          text={dialog.contents || ""}
        />
      )}
      {characters
        .filter(({ portrait, visible }) => portrait && visible)
        .map(({ id, doll, x, y, scale, flipped, dollSettings }) => (
          <Character
            key={id}
            character={<Doll doll={doll} settings={dollSettings} />}
            mirrored={flipped}
            scale={scale}
            x={x}
            y={y}
          />
        ))}
      <Menu />
    </Scene>
  );
};

const mapStateToProps = (state: RootState) => ({
  characters: Object.values(state.characters),
  screen: state.screen,
  background: state.background,
  dialog: state.dialog,
});
const mapDispatchToProps = {
  stopPunch: screenState.actions.stopPunch,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedScene);
