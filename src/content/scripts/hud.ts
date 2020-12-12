import { Queue } from "src/lib/events/types";
import scriptHelpers from "src/lib/script-helpers";

import menuBackground from "src/content/assets/hotspots/menu-background.png";
import menu from "src/content/assets/hotspots/menu.png";

export const hud = (queue: Queue) => {
  const { buttons, settings } = scriptHelpers(queue);

  buttons([
    {
      id: "menuBackground",
      image: menuBackground,
      position: [1202, -2],
      role: "hud",
      onClick: () => {
        // no op
      },
    },
    {
      id: "menu",
      image: menu,
      hoverEffect: "shadow",
      position: [1226, 8],
      role: "hud",
      onClick: settings,
    },
  ]);
};
