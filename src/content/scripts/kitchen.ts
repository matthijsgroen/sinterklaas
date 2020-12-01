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
    hpunch,
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
      dollSettings: { color: "white", body: "default", cooking: true },
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
          () =>
            bakpiet(
              "Ah, heerlijk om weer pepernoten te kunnen maken!",
              { expression: "concentrated" },
              { expression: "small-smile" }
            )
        );

        onState(
          s => s.gingerbreadButtonPie === "desired",
          () => {
            hiddoPos({ visible: true });

            hiddo("Bakpiet, Sinterklaas had een leuk idee!", {
              expression: "enthusiastic",
            });
            hiddo("Catootje is namelijk helemaal gek op taart...", {
              expression: "happy",
              body: "chin",
            });
            hiddo(
              "Dus vroeg hij of je misschien een lekkere taart kon maken.",
              { expression: "very-enthusiastic", body: "default" },
              { expression: "mouth-closed" }
            );
            bakpiet("Ja, dat is ook een goed idee!", {
              body: "pointUp",
              expression: "happy",
            });
            hpunch();
            bakpiet("Ai! Probleem!", {
              body: "hip",
              expression: "defeated",
            });
            bakpiet(
              "Ik heb alleen net al mijn ingrediënten gebruikt om pepernoten te maken....",
              { expression: "sip-open" }
            );
            bakpiet(
              "...dus moeten we nieuwe ingrediënten regelen voor de taart!",
              { body: "pointUp", expression: "happy" }
            );
            bakpiet("... even denken. Ik heb nodig:", {
              body: "think",
              expression: "sip",
            });
            bakpiet("Melk, Eieren, Meel en Speculaaskruiden.", {
              expression: "happy",
              body: "default",
            });
            bakpiet(
              "Denk je dat je die kunt vinden voor mij?",
              { expression: "grin" },
              { expression: "small-smile" }
            );

            hiddo("Tuurlijk! Geen probleem!", {
              body: "default",
              expression: "enthusiastic",
            });
            hiddo("...denk ik...", { body: "chin", expression: "think" });
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
                    bakpiet("Ah, meer ingrediënten, fijn!", {
                      expression: "happy",
                    });
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
                      `We hebben alleen nog maar ${stillNeeded[0]} nodig!`,
                      { body: "pointUp", expression: "happy" }
                    );
                  },
                  () => {
                    if (stillNeeded.length === 0) {
                      hiddoPos({
                        visible: true,
                        dollSettings: {
                          body: "default",
                          expression: "mouth-closed",
                        },
                      });
                      bakpiet(
                        "We hebben alles! We kunnen aan de slag!",
                        { expression: "happy", body: "hip" },
                        { expression: "small-smile" }
                      );
                      hiddo(
                        "Woohoo!",
                        { body: "fists", expression: "very-enthusiastic" },
                        { body: "default", expression: "mouth-closed" }
                      );
                      fadeOut();
                      pause(3000);
                      fadeIn();
                      bakpiet(
                        "Alsjeblieft! Een heerlijke verse pepernoten taart.",
                        {
                          body: "hip",
                          cooking: false,
                          expression: "small-smile",
                        }
                      );
                      hiddoPos({ visible: false });
                      bakpietPos({ visible: false });
                      pause(300);
                      bakpietPos({ x: 400, y: 50, scale: 1.4, visible: true });
                      bakpiet(
                        "En kinderen thuis, er staat iets lekkers voor jullie in de oven!",
                        { expression: "wink" }
                      );
                      pause(300);
                      bakpietPos({ visible: false });
                      pause(300);
                      bakpietPos({ x: 650, y: 110, scale: 1, visible: true });
                      hiddoPos({ visible: true });

                      updateState(a =>
                        a.updateGingerbreadButtonPie("inventory")
                      );
                      bakpiet(
                        "Hiddo, wil je deze taart naar Sinterklaas brengen?",
                        { expression: "grin", cooking: true, body: "default" }
                      );
                      hiddoPos({ visible: false });
                    } else {
                      const [first, ...rest] = stillNeeded;
                      bakpiet(`We zoeken nog ${rest.join(", ")} en ${first}.`, {
                        body: "think",
                        expression: "sip",
                      });
                    }
                  }
                );
              },
              () => {
                bakpiet("Nog bedankt voor alle hulp!", { expression: "happy" });
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
