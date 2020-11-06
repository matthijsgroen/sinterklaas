import { connect } from "react-redux";
import React, { useEffect } from "react";
import Background from "src/components/Background";
import Scene from "src/components/Scene";
import Character from "src/components/Character";
import ScreenFade from "src/components/ScreenFade";
import Dialog from "src/components/Dialog";
import Menu from "./Menu";
import screenState from "src/state/screen";
import { RootState } from "src/state/store";
import { DollSettings } from "src/content/dolls/types";
import { DialogState } from "src/state/dialog";
import { Character as CharacterType } from "src/state/characters";
import { Doll } from "src/content/dolls";
import { ScreenButtons, Button } from "src/components/ScreenButtons";
import buttons from "src/state/buttons";
import Loading from "src/components/Loading";

interface ConnectedSceneProps {
  dialog: DialogState;
  characters: CharacterType<keyof DollSettings>[];
  background: RootState["background"];
  screen: RootState["screen"];
  buttons: Button[];
  stopPunch: typeof screenState.actions.stopPunch;
  pressButton: typeof buttons.actions.select;
}

const ConnectedScene: React.FC<ConnectedSceneProps> = ({
  background,
  dialog,
  characters,
  screen,
  buttons,
  stopPunch,
  pressButton,
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
      <ScreenButtons
        buttons={buttons}
        onClick={id => {
          pressButton(id);
        }}
      />
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
      {screen.loading && <Loading />}
    </Scene>
  );
};

const mapStateToProps = (state: RootState) => ({
  characters: Object.values(state.characters),
  buttons: Object.values(state.buttons.buttons),
  screen: state.screen,
  background: state.background,
  dialog: state.dialog,
});
const mapDispatchToProps = {
  stopPunch: screenState.actions.stopPunch,
  pressButton: buttons.actions.select,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedScene);
