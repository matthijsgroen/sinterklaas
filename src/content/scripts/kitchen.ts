import { Queue } from "src/lib/events/types";
import scriptHelpers from "src/lib/script-helpers";

import bakpietHotspot from "../assets/hotspots/kitchen-bakpiet.png";
import { Ingredient } from "../gameState";

const keuken = (queue: Queue) => {
  const {
    fadeIn,
    fadeOut,
    updateBackground,
    manageCharacter,
    jump,
    hold,
    buttons,
    onState,
    updateState,
    pause,
  } = scriptHelpers(queue);

  const { say: hiddo, pos: hiddoPos } = manageCharacter(
    "hiddo",
    "hiddo",
    "Hiddo",
    {
      x: 112,
      y: 130,
      flipped: true,
      visible: false,
      dollSettings: {},
    }
  );

  const { say: bakpiet, pos: bakpietPos } = manageCharacter(
    "bakpiet",
    "piet",
    "Bakpiet",
    {
      x: 650,
      y: 110,
      visible: false,
      dollSettings: { color: "white", body: "cooking" },
    }
  );

  updateBackground({ image: "kitchen", frontLayer: undefined, blur: false });
  fadeIn();

  buttons([
    {
      id: "hall",
      hoverEffect: "glow",
      color: "black",
      coordinates: [0, 86, 189, 80, 204, 470, 0, 531],
      onClick: () => {
        fadeOut();
        jump("hall");
      },
    },
    {
      id: "bakpiet",
      hoverEffect: "glow",
      image: bakpietHotspot,
      position: [610, 113],
      onClick: ({ hide }) => {
        hide();
        bakpietPos({ visible: true });
        onState(
          s =>
            !(
              s.gingerbreadButtonPie === "ingredients" ||
              s.gingerbreadButtonPie === "inventory"
            ),
          () => bakpiet("Ah, heerlijk om weer pepernoten te kunnen maken!")
        );

        onState(
          s => s.gingerbreadButtonPie === "desired",
          () => {
            hiddoPos({ visible: true });
            hiddo("Bakpiet, Sinterklaas had een leuk idee!");
            hiddo("Catootje is namelijk helemaal gek op taart...");
            hiddo("Dus vroeg hij of je misschien een lekkere taart kon maken?");
            pause(1000);
            bakpiet("Ja, dat is ook een goed idee!");
            bakpiet("Ai! Probleem!");
            bakpiet(
              "Ik heb alleen net al mijn ingrediënten gebruikt om pepernoten te maken...."
            );
            bakpiet(
              "...dus moeten we nieuwe ingrediënten regelen voor de taart!"
            );
            bakpiet("... even denken. Ik heb nodig:");
            bakpiet("Melk, Eieren, Meel en speculaaskruiden.");
            bakpiet("Denk je dat je die kunt vinden voor mij?");

            hiddo("Tuurlijk! Geen probleem!");
            hiddo("...denk ik...");
            updateState(a => a.updateGingerbreadButtonPie("ingredients"));
            hiddoPos({ visible: false });
          },
          () =>
            onState(
              s => s.gingerbreadButtonPie === "ingredients",
              () => {
                const ingriedientMap: { [key in Ingredient]: string } = {
                  flour: "Meel",
                  eggs: "Eieren",
                  gingerherbs: "Speculaaskruiden",
                  milk: "Melk",
                };
                onState(
                  s => s.newIngredientsFound,
                  () => {
                    bakpiet("Ah, meer ingrediënten, fijn!");
                    updateState(a => a.deliverIngredients());
                  }
                );

                let stillNeeded: string[] = [];
                onState(
                  s => {
                    stillNeeded = s.neededIngriedients.map(
                      ingr => ingriedientMap[ingr]
                    );
                    return stillNeeded.length === 1;
                  },
                  () => {
                    bakpiet(
                      `We hebben alleen nog maar ${stillNeeded[0]} nodig!`
                    );
                  },
                  () => {
                    if (stillNeeded.length === 0) {
                      bakpiet("We hebben alles! We kunnen aan de slag!");
                      hiddo("Woohoo!");
                      fadeOut();
                      pause(3000);
                      fadeIn();
                      bakpiet(
                        "Alsjeblieft! Een heerlijke verse pepernoten taart."
                      );
                      bakpiet(
                        "En kinderen thuis, er staat iets lekkers voor jullie in de oven!"
                      );
                      updateState(a =>
                        a.updateGingerbreadButtonPie("inventory")
                      );
                      bakpiet(
                        "Hiddo, wil je deze taart naar Sinterklaas brengen?"
                      );
                    } else {
                      const [first, ...rest] = stillNeeded;
                      bakpiet(`We zoeken nog ${rest.join(", ")} en ${first}.`);
                    }
                  }
                );
              },
              () => {
                bakpiet("Nog bedankt voor alle hulp!");
              }
            )
        );

        bakpietPos({ visible: false });
      },
    },
  ]);

  hold();
};

export default keuken;
