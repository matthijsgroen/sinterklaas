import { PietProps } from "./Piet";
import { SintProps } from "./Sint";
import { HiddoProps } from "./Hiddo";
import { SilhouetteProps } from "./Silhouette";
import { JinteProps } from "./Jinte";

type Settings<
  TCharacterProps,
  TMandatory extends keyof TCharacterProps = never
> = Partial<TCharacterProps> & Pick<TCharacterProps, TMandatory>;

export type DollSettings = {
  piet: Settings<PietProps>;
  sint: Settings<SintProps>;
  silhouette: Settings<SilhouetteProps, "sil">;
  hiddo: Settings<HiddoProps>;
  jinte: Settings<JinteProps>;
};
