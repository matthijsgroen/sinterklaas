import { connect } from "react-redux";
import React from "react";
import { RootState } from "src/state/store";
import ui, { Dialogs } from "src/state/ui";
import ScreenScale from "src/components/generic/ScreenScale";
import DialogBox from "src/components/generic/DialogBox";
import { getSaveSlots } from "src/lib/state/loadState";

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
        <ul>
          {getSaveSlots().map(({ name, slotId, time }, index) => (
            <li key={index}>
              <button
                onClick={() => {
                  onResult(slotId);
                }}
              >
                {slotId} - {name} -{" "}
                {Intl.DateTimeFormat(undefined, dateFormat).format(time)}
              </button>
            </li>
          ))}
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
