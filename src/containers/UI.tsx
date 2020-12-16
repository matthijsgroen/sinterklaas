import { connect } from "react-redux";
import React from "react";
import { RootState } from "src/state/store";
import ui, { Dialogs } from "src/state/ui";
import ScreenScale from "src/components/generic/ScreenScale";
import DialogBox from "src/components/generic/ui/DialogBox";
import { getSaveSlots } from "src/lib/state/loadState";
import { Option, OptionList } from "src/components/generic/ui/OptionList";
import { ButtonList } from "src/components/generic/ui/ButtonList";
import { Button } from "src/components/generic/ui/Button";

interface ConnectedSceneProps {
  dialogOpen: RootState["ui"]["dialogOpen"];
  closeDialog: () => void;
  onResult: (result: string) => void;
}

const dateFormat: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
};

const ConnectedScene: React.FC<ConnectedSceneProps> = ({
  dialogOpen,
  closeDialog,
  onResult,
}) => {
  const title: string = {
    [Dialogs.None]: "",
    [Dialogs.Loading]: "Spel laden",
    [Dialogs.Saving]: "Spel opslaan",
    [Dialogs.Settings]: "Pause menu",
  }[dialogOpen];

  const saveSlots = getSaveSlots();
  if (dialogOpen === Dialogs.None) {
    return null;
  }

  return (
    <ScreenScale>
      <DialogBox title={title} onClose={() => closeDialog()}>
        {dialogOpen === Dialogs.Loading ? (
          <OptionList>
            {saveSlots.map(({ name, slotId, time }, index) => (
              <Option onClick={() => onResult(slotId)}>
                {slotId} - {name} -{" "}
                {Intl.DateTimeFormat(undefined, dateFormat).format(time)}
              </Option>
            ))}
          </OptionList>
        ) : dialogOpen === Dialogs.Settings ? (
          <ButtonList>
            <Button onClick={() => onResult("resume")}>Hervatten</Button>
            <Button onClick={() => onResult("save")}>Opslaan</Button>
          </ButtonList>
        ) : dialogOpen === Dialogs.Saving ? (
          <OptionList>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(index => (
              <Option onClick={() => onResult(`slot${index}`)}>
                Opslag {index}
              </Option>
            ))}
          </OptionList>
        ) : null}
      </DialogBox>
    </ScreenScale>
  );
};

const mapStateToProps = (state: RootState) => ({
  dialogOpen: state.ui.dialogOpen,
});

const mapDispatchToProps = {
  closeDialog: ui.actions.closeDialog,
  onResult: ui.actions.dialogResult,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedScene);
