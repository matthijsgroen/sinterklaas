import { Queue } from "src/lib/events/types";
import scriptHelpers from "src/lib/script-helpers";

import bakpietHotspot from "../assets/hotspots/living-bakpiet.png";
import bagHotspot from "../assets/hotspots/living-bag.png";

const living = (queue: Queue) => {
  const {
    fadeOut,
    fadeIn,
    updateBackground,
    hold,
    jump,
    buttons,
    manageCharacter,
    onState,
    updateState,
  } = scriptHelpers(queue);

  const { say: bakpiet, pos: bakpietPos } = manageCharacter(
    "bakpiet",
    "piet",
    "Bakpiet",
    {
      x: 650,
      y: 110,
      visible: false,
      dollSettings: { color: "white" },
    }
  );

  const { say: hiddo, pos: hiddoPos } = manageCharacter(
    "hiddo",
    "hiddo",
    "Hiddo",
    {
      x: 300,
      y: 110,
      visible: false,
      dollSettings: {},
    }
  );

  updateBackground({ image: "living", frontLayer: undefined, blur: false });
  fadeIn();
  updateState(s => s.hasVisitedLiving());

  const bagInterest = () => {
    hiddoPos({ visible: true, x: 300, y: 110, flipped: false });
    hiddo("Oeh! Pakjes zakken....");

    onState(
      s => s.sint === "glasses" && s.glasses !== "inventory",
      () => {
        hiddo(
          "Misschien zit in een van deze zakken wel een bril voor Sinterklaas?"
        );
      },
      () => {
        hiddo("Wat zou hier in zitten?");
      }
    );

    hiddo("... ... ...");
    hiddo("Het is niet netjes om zo maar in een zak te gaan rommelen.");
    onState(
      s => s.sint === "glasses" && s.glasses !== "inventory",
      () => {
        hiddo("Hoe kan ik er achter komen welke zak onze pakjes bevat?");
      }
    );
    hiddoPos({ visible: false });
  };

  buttons([
    {
      id: "bag1",
      hoverEffect: "glow",
      image: bagHotspot,
      position: [570, 430],
      onClick: () => {
        bagInterest();
      },
    },
    {
      id: "bag2",
      hoverEffect: "glow",
      image: bagHotspot,
      position: [410, 430],
      onClick: () => {
        bagInterest();
      },
    },
    {
      id: "bag3",
      hoverEffect: "glow",
      image: bagHotspot,
      position: [680, 430],
      onClick: () => {
        onState(
          s => s.glasses !== "none",
          () => {
            fadeOut();
            jump("bag");
          },
          bagInterest
        );
      },
    },
    {
      id: "bakpiet",
      hoverEffect: "glow",
      image: bakpietHotspot,
      position: [970, 293],
      onClick: ({ hide }) => {
        hide();
        bakpietPos({ visible: true });
        hiddoPos({ visible: true, x: 200, y: 110, flipped: true });
        onState(
          s => s.bakingPiet === "new",
          () => {
            bakpiet("Hallo daar! Fijn dat je ons komt helpen!");
            hiddo("Hee, bakpiet! Hoor jij niet in de keuken te zijn?");
            bakpiet(
              "Ja, ik wou dat ik daar kon zijn... Maar ik ben mijn recept voor pepernoten kwijt!"
            );
            bakpiet("Volgens mij moet het ergens tussen deze pakjes liggen...");
            hiddo(
              "Misschien kan ik je wel helpen met het vinden van het recept!"
            );
            bakpiet("Ooh dat zou echt geweldig zijn.");

            updateState(a => a.updateBakingPiet("visited"));
          },
          () => {
            hiddo("En, het recept al kunnen vinden?");
            bakpiet("Nee, ik heb hier denk ik ook bijna overal gezocht...");
            hiddo("Ik heb ook nog niets gevonden...");
          }
        );

        bakpietPos({ visible: false });
        hiddoPos({ visible: false });
      },
    },
    {
      id: "left",
      hoverEffect: "glow",
      color: "black",
      // prettier-ignore
      coordinates: [
        85, 195, 85, 476, 95, 477,
        100, 539, 260, 475, 262, 245,
      ],
      onClick(button) {
        fadeOut();
        jump("hall");
      },
    },
  ]);

  hold();
};

export default living;
