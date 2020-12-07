import { Queue } from "src/lib/events/types";
import scriptHelpers from "src/lib/script-helpers";

import bakpietHotspot from "../assets/hotspots/living-bakpiet.png";
import bagHotspot from "../assets/hotspots/living-bag.png";
import flourHotspot from "../assets/hotspots/living-flour.png";

const living = (queue: Queue) => {
  const {
    fadeOut,
    fadeIn,
    updateBackground,
    hold,
    pause,
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
    updateBackground({ blur: true });
    hiddo("Oeh! Pakjes zakken....", { expression: "very-enthusiastic" });

    onState(
      s => s.sint === "glasses" && s.glasses !== "inventory",
      () => {
        hiddo(
          "Misschien zit in een van deze zakken wel een bril voor Sinterklaas?",
          { body: "chin", expression: "question" }
        );
      },
      () => {
        hiddo("Wat zou hier in zitten?", {
          body: "chin",
          expression: "question",
        });
      }
    );

    hiddo("... ... ...", { expression: "mouth-closed" });
    hiddo("Het is niet netjes om zo maar in een zak te gaan rommelen.", {
      expression: "sip",
      body: "default",
    });
    onState(
      s => s.sint === "glasses" && s.glasses !== "inventory",
      () => {
        hiddo("Hoe kan ik er achter komen welke zak onze pakjes bevat?", {
          body: "chin",
          expression: "think",
        });
      }
    );
    updateBackground({ blur: false });
    hiddoPos({ visible: false });
  };

  buttons([
    {
      id: "flourInactive",
      image: flourHotspot,
      position: [380, 390],
      skip: s =>
        s.gingerbreadButtonPie === "ingredients" ||
        s.gingerbreadButtonPie === "inventory" ||
        s.gingerbreadButtonPie === "done",
      onClick: () => {
        // no action
      },
    },
    {
      id: "flour",
      image: flourHotspot,
      position: [380, 390],
      hoverEffect: "glow",
      condition: s =>
        s.gingerbreadButtonPie === "ingredients" &&
        s.neededIngriedients.includes("flour"),
      onClick: ({ hide }) => {
        hiddoPos({ visible: true });
        updateBackground({ blur: true });
        hiddo("Hee, dat is geen zak pakjes, dat is een zak meel!");
        hide();
        hiddoPos({ x: 300, y: 230, dollSettings: { expression: "shocked" } });
        hiddo("Oef! Die is zwaar");

        hiddoPos({
          x: 300,
          y: 110,
          dollSettings: { expression: "mouth-closed" },
        });
        pause(200);

        updateState(a => a.findIngredient("flour"));
        hiddoPos({ visible: false });
        updateBackground({ blur: false });
      },
    },
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
      skip: s => s.bakingPiet === "helped",
      onClick: ({ hide }) => {
        hide();
        bakpietPos({ visible: true });
        updateBackground({ blur: true });
        hiddoPos({
          visible: true,
          x: 200,
          y: 110,
          flipped: true,
          dollSettings: { body: "default", expression: "mouth-closed" },
        });

        onState(
          s => s.bakingPiet === "new",
          () => {
            bakpiet(
              "Hallo daar! Fijn dat je ons komt helpen!",
              { expression: "happy" },
              { expression: "small-smile" }
            );
            hiddo(
              "Hee, bakpiet! Hoor jij niet in de keuken te zijn?",
              {
                expression: "question",
              },
              { expression: "mouth-closed" }
            );
            bakpiet(
              "Ja, ik wou dat ik daar kon zijn... Maar ik ben mijn recept voor pepernoten kwijt!",
              { expression: "sip" }
            );
            bakpiet(
              "Volgens mij moet het ergens tussen deze pakjes liggen...",
              { expression: "sip-open" },
              { expression: "sip2" }
            );
            hiddo(
              "Misschien kan ik je wel helpen met het vinden van het recept!",
              { body: "open", expression: "happy" },
              { body: "default", expression: "mouth-closed" }
            );
            bakpiet("Ooh dat zou echt geweldig zijn.", { expression: "happy" });

            updateState(a => a.updateBakingPiet("visited"));
            updateState(a => a.updateRecipe("desired"));
          },
          () =>
            onState(
              s => s.recipe === "inventory",
              () => {
                hiddo("Hoi Bakpiet, ik heb je recept gevonden!");
                bakpiet("Oooh super fijn! Dank je wel!");
                bakpiet("... ... ...");
                bakpiet("Ik heb meteen zin om wat lekkers te gaan maken!");
                bakpiet(
                  "Als je zin hebt in pepernoten, kom dan straks maar langs in de keuken!"
                );
                updateState(a => a.updateBakingPiet("helped"));
                updateState(a => a.updateRecipe("done"));
              },
              () => {
                hiddo("En, het recept al kunnen vinden?");
                bakpiet("Nee, ik heb hier denk ik ook bijna overal gezocht...");
                hiddo("Ik heb ook nog niets gevonden...");
              }
            )
        );

        updateBackground({ blur: false });
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
