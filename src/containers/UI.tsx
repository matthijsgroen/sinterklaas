import { connect } from "react-redux";
import React from "react";
import { RootState } from "src/state/store";
import ui, { Dialogs } from "src/state/ui";
import ScreenScale from "src/components/generic/ScreenScale";
import DialogBox from "src/components/generic/ui/DialogBox";
import { getSaveSlots } from "src/lib/state/loadState";
import { OptionList } from "src/components/generic/ui/OptionList";
import { ButtonList } from "src/components/generic/ui/ButtonList";

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
          <OptionList
            options={saveSlots.map(({ name, slotId, time }, index) => ({
              name: `${slotId} - ${name} - ${Intl.DateTimeFormat(
                undefined,
                dateFormat
              ).format(time)}`,
              onClick: () => onResult(slotId),
            }))}
          />
        ) : dialogOpen === Dialogs.Settings ? (
          <ButtonList
            buttons={[
              {
                name: "Hervatten",
                onClick: () => onResult("resume"),
              },
              {
                name: "Opslaan",
                onClick: () => onResult("save"),
              },
            ]}
          />
        ) : dialogOpen === Dialogs.Saving ? (
          <OptionList
            options={[1, 2, 3, 4, 5, 6, 7, 8].map(index => ({
              name: `Opslag ${index}`,
              onClick: () => onResult(`slot${index}`),
            }))}
          />
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
