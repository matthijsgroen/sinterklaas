import React, { ReactElement } from "react";
import Piet from "./Piet";
import Hiddo from "./Hiddo";
import Silhouette from "./Silhouette";
import { DollSettings } from "./types";

export interface DollProps<TDollName extends keyof DollSettings> {
  doll: TDollName;
  settings: DollSettings[TDollName];
}

export const Doll = <T extends keyof DollSettings>({
  doll,
  settings,
}: DollProps<T>): ReactElement<DollProps<T>> => {
  switch (doll) {
    case "piet":
      return <Piet {...(settings as DollSettings["piet"])} />;
    case "hiddo":
      return <Hiddo {...(settings as DollSettings["hiddo"])} />;
  }
  return <Silhouette {...(settings as DollSettings["silhouette"])} />;
};
