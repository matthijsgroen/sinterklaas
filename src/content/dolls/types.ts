import { PietProps } from "./Piet";
import { HiddoProps } from "./Hiddo";
import { SilhouetteProps } from "./Silhouette";

type Settings<
  TCharacterProps,
  TMandatory extends keyof TCharacterProps = never
> = Partial<TCharacterProps> & Pick<TCharacterProps, TMandatory>;

export type DollSettings = {
  piet: Settings<PietProps>;
  silhouette: Settings<SilhouetteProps, "sil">;
  hiddo: Settings<HiddoProps>;
};
