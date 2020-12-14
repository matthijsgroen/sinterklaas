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
}) =>
  dialogOpen === Dialogs.Loading ? (
    <ScreenScale>
      <DialogBox title="Spel laden" onClose={() => closeDialog()}>
        <OptionList
          options={getSaveSlots().map(({ name, slotId, time }, index) => ({
            name: `${slotId} - ${name} - ${Intl.DateTimeFormat(
              undefined,
              dateFormat
            ).format(time)}`,
            onClick: () => onResult(slotId),
          }))}
        />
      </DialogBox>
    </ScreenScale>
  ) : dialogOpen === Dialogs.Settings ? (
    <ScreenScale>
      <DialogBox title="Pauze menu" onClose={() => closeDialog()}>
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
      </DialogBox>
    </ScreenScale>
  ) : dialogOpen === Dialogs.Saving ? (
    <ScreenScale>
      <DialogBox title="Opslag menu" onClose={() => closeDialog()}>
        <ul>
          <li>
            <button
              onClick={() => {
                onResult("save");
              }}
            >
              Opslaan
            </button>
          </li>
        </ul>
      </DialogBox>
    </ScreenScale>
  ) : null;

const mapStateToProps = (state: RootState) => ({
  dialogOpen: state.ui.dialogOpen,
});

const mapDispatchToProps = {
  closeDialog: ui.actions.closeDialog,
  onResult: ui.actions.dialogResult,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedScene);
