import { connect } from "react-redux";
import React, { useEffect } from "react";
import Background from "src/components/Background";
import Scene from "src/components/generic/Scene";
import Character from "src/components/Character";
import ScreenFade from "src/components/generic/ScreenFade";
import Dialog from "src/components/Dialog";
import Menu from "./Menu";
import screenState from "src/state/screen";
import { RootState } from "src/state/store";
import { DollSettings } from "src/content/dolls/types";
import { DialogState } from "src/state/dialog";
import { Character as CharacterType } from "src/state/characters";
import { Doll } from "src/content/dolls";
import { ScreenButtons, Button } from "src/components/generic/ScreenButtons";
import buttons from "src/state/buttons";
import FrontLayer from "src/components/Frontlayer";
import Loader from "./Loader";
import BackgroundBlur from "src/components/generic/BackgroundBlur";
import Layer from "src/components/generic/Layer";

interface ConnectedSceneProps {
  dialog: DialogState;
  characters: CharacterType<keyof DollSettings>[];
  background: RootState["background"];
  screen: RootState["screen"];
  buttons: Button[];
  buttonActive: boolean;
  stopPunch: typeof screenState.actions.stopPunch;
  pressButton: typeof buttons.actions.select;
}

const ConnectedScene: React.FC<ConnectedSceneProps> = ({
  background,
  dialog,
  characters,
  screen,
  buttons,
  buttonActive,
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
      <Layer z={1}>
        <Background {...background} />
        <ScreenButtons
          role={"normal"}
          buttons={buttons}
          buttonActive={buttonActive}
          onClick={id => {
            pressButton(id);
          }}
        />
        <BackgroundBlur active={!!background.blur} />
      </Layer>
      <Layer z={2}>
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
        <FrontLayer {...background} />
        <ScreenButtons
          role={"hud"}
          buttons={buttons}
          buttonActive={buttonActive}
          onClick={id => {
            pressButton(id);
          }}
        />
      </Layer>
      <Layer z={3}>
        <ScreenFade active={screen.fadeOut} color={screen.color} />
        {dialog.visible && (
          <Dialog
            name={dialog.name}
            {...dialog.settings}
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
              z={2}
            />
          ))}
      </Layer>
      <Menu />
      <Loader />
    </Scene>
  );
};

const mapStateToProps = (state: RootState) => ({
  characters: Object.values(state.characters),
  buttons: Object.values(state.buttons.buttons),
  buttonActive: !!state.buttons.selected,
  screen: state.screen,
  background: state.background,
  dialog: state.dialog,
});

const mapDispatchToProps = {
  stopPunch: screenState.actions.stopPunch,
  pressButton: buttons.actions.select,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedScene);
