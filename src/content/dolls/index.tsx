import React, { ReactElement } from "react";
import Sint from "./Sint";
import Piet from "./Piet";
import Hiddo from "./Hiddo";
import Jinte from "./Jinte";
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
    case "sint":
      return <Sint {...(settings as DollSettings["sint"])} />;
    case "hiddo":
      return <Hiddo {...(settings as DollSettings["hiddo"])} />;
    case "jinte":
      return <Jinte {...(settings as DollSettings["jinte"])} />;
  }
  return <Silhouette {...(settings as DollSettings["silhouette"])} />;
};
