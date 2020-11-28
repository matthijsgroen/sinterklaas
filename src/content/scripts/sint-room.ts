import { Queue } from "src/lib/events/types";
import scriptHelpers from "src/lib/script-helpers";

import sintHotspot from "../assets/hotspots/sint-room-sint.png";
import bookHotspot from "../assets/hotspots/sint-room-book.png";
import drawing1Hotspot from "../assets/hotspots/sint-room-drawing1.png";
import drawing2Hotspot from "../assets/hotspots/sint-room-drawing2.png";
import recipeHotspot from "../assets/hotspots/sint-room-recipe.png";

import backgroundTrack from "src/content/assets/sounds/background-sint.mp3";
import { MenuType } from "src/lib/script-helpers/flow";

const sintroom = (queue: Queue) => {
  const {
    fadeIn,
    fadeOut,
    jump,
    updateBackground,
    buttons,
    hold,
    pause,
    stopMusic,
    playMusic,
    menu,
    onState,
    updateState,
    manageCharacter,
  } = scriptHelpers(queue);

  const { say: sint, pos: sintPos } = manageCharacter(
    "sint",
    "sint",
    "Sinterklaas",
    {
      x: 600,
      y: 30,
      visible: false,
      dollSettings: {},
    }
  );

  const { say: hiddo, pos: hiddoPos } = manageCharacter(
    "hiddo",
    "hiddo",
    "Hiddo",
    {
      x: 100,
      y: 70,
      flipped: true,
      visible: false,
      dollSettings: {},
    }
  );

  updateBackground({ image: "sintroom", frontLayer: undefined, blur: false });
  fadeIn();
  playMusic(backgroundTrack, { volume: 0.1 });
  onState(
    state => state.sint === "new",
    () => {
      sintPos({ visible: true });
      sint("Hey, Hiddo, wat gezellig dat je er bent!");

      sintPos({ visible: false });
      updateState(actions => actions.updateSint("visited"));
    }
  );

  const explainProblem1 = () => {
    sint("Ik ben het verlanglijstje van Carl kwijtgeraakt.");
    sint("Ik kan er helemaal niets van vinden in mijn boek.");
    sint("Rijmpiet heeft het lijstje van Carl vast in zijn boekenkast.");
    sint("Hij houd altijd erg goed dit soort zaken bij.");
  };

  const explainProblem2 = () => {
    sint(
      "Oh, ik lees hier net dat Catootje heel erg gek is op pepernotentaart..."
    );
    sint(
      "Dat zou leuk zijn om te geven, misshien kan je er een aan Bakpiet vragen?"
    );
  };

  buttons([
    {
      id: "hall",
      hoverEffect: "glow",
      coordinates: [78, -10, 263, 100, 260, 450, 70, 630],
      color: "black",
      onClick: ({ hide }) => {
        hide("sint");
        sintPos({ visible: true });
        sint("Dag hoor!");
        stopMusic();
        fadeOut();
        jump("hall");
      },
    },
    {
      id: "book",
      image: bookHotspot,
      position: [610, 360],
      onClick: ({ hide, show }) => {
        hide();
        show();
      },
    },
    {
      id: "drawing1",
      hoverEffect: "glow",
      image: drawing1Hotspot,
      position: [300, 70],
      onClick: ({ hideAll }) => {
        fadeOut();
        hideAll();
        updateBackground({ image: "sintroom", frontLayer: "drawing1" });
        pause(100);
        fadeIn();
        sint("Och, ik heb zulke prachtige tekeningen gehad!");
        sint("Deze zijn gemaakt door Jinte en Catootje.");
        pause();
        fadeOut();
        pause(100);
        updateBackground({ image: "sintroom", frontLayer: undefined });
        fadeIn();
      },
    },
    {
      id: "drawing2",
      hoverEffect: "glow",
      image: drawing2Hotspot,
      position: [760, 90],
      onClick: ({ hideAll }) => {
        fadeOut();
        hideAll();
        updateBackground({ image: "sintroom", frontLayer: "drawing2" });
        pause(100);
        fadeIn();
        sint("Ik vind deze kunstwerken echt prachtig!");
        sint("Deze zijn gemaakt door Catootje en Jinte.");
        pause();
        fadeOut();
        pause(100);
        updateBackground({ image: "sintroom", frontLayer: undefined });
        fadeIn();
      },
    },
    {
      id: "recipe",
      hoverEffect: "glow",
      image: recipeHotspot,
      position: [500, 70],
      skip: s => s.recipe === "inventory" || s.recipe === "done",
      onClick: ({ hideAll }) => {
        fadeOut();
        hideAll();
        updateBackground({ image: "sintroom", frontLayer: "recipe" });
        pause(100);
        fadeIn();
        hiddo("Hee dit is helemaal geen kindertekening.");
        sint(
          "Oh inderdaad. Dat is niet om naar te kijken, maar lekker op te snoepen."
        );
        pause();
        onState(
          s => s.recipe === "desired",
          () => {
            hiddo("Is het goed als ik het recept meeneem?");
            sint("Ja natuurlijk, geen probleem hoor.");
            updateState(a => a.updateRecipe("inventory"));
          }
        );
        fadeOut();
        pause(100);
        updateBackground({ image: "sintroom", frontLayer: undefined });
        fadeIn();
      },
    },
    {
      id: "sint",
      hoverEffect: "glow",
      image: sintHotspot,
      position: [783, 149],
      onClick: ({ hide, show }) => {
        hide();
        sintPos({ visible: true });
        onState(
          s => s.sint === "details",
          () => {
            hiddoPos({
              visible: true,
              dollSettings: { expression: "mouth-closed" },
            });
            menu(
              {
                "Over het lijstje van Carl...": {
                  skip: s => s.listCarl === "done",
                  onClick: () => {
                    onState(
                      s => s.listCarl === "inventory",
                      () => {
                        hiddo("Ik heb denk ik wat u zoekt.");
                        sint(
                          "Ow dat wat fijn, dan kan ik mijn boek weer bijwerken"
                        );
                        sint("... ... ...");
                        sint("Ow... alweer dat... nouja dat mag hoor.");
                        sint("Super bedankt!");
                        updateState(a => a.updateListCarl("done"));

                        // All complete? Wrap up game
                      },
                      () => {
                        hiddo(
                          "Ow ik weet het weer, ik moest even naar Rijmpiet toe."
                        );
                      }
                    );
                  },
                },
                "Over de pepernoten taart...": () => {
                  onState(
                    s => s.bakingPiet === "new",
                    () => {
                      sint("Ben je al bij bakpiet geweest?");
                      hiddo("Ownee, dat was het, ik moest naar Bakpiet toe!");
                    },
                    () =>
                      onState(
                        s => s.bakingPiet === "visited",
                        () => {
                          hiddo(
                            "Ik wil het graag aan Bakpiet vragen, maar hij is een recept kwijt."
                          );
                          sint("Och, ik ben ook wel eens iets kwijt.");
                          sint(
                            "Vaak helpt het om gewoon even rust te scheppen in je hoofd voordat je gaat zoeken...."
                          );
                          sint(
                            "Ik doe dat vaak door even naar de prachtige kindertekening in mijn kamer te kijken."
                          );
                        },
                        () => {
                          // TODO: 2. Hints voor vinden ingredienten
                        }
                      )
                  );
                },
                "Ik ga weer verder.": ({ endDialog }) => {
                  endDialog();
                },
              },
              MenuType.Dialog
            );
          },
          () =>
            onState(
              s => s.glasses === "inventory",
              () => {
                hiddoPos({
                  visible: true,
                  dollSettings: { expression: "mouth-closed" },
                });
                hiddo("Sinterklaas, ik heb een bril voor u!");
                sint("Ow wat fijn! Ik ben benieuwd.");

                updateState(a => a.updateSint("details"));
                updateState(a => a.updateGlasses("done"));
                updateState(a => a.updateListCarl("desired"));

                sint("Ooh dit is echt heel fijn.", { glasses: true });
                pause(200);
                sint("Nou, kan ik eindelijk in het grote boek kijken...");
                sint("Ik weet dat ik wat dingetjes mis...");

                sint("...even kijken hoor.");
                onState(s => !s.sintProblems.problem1Solved, explainProblem1);
                sint("En verder...");
                onState(s => !s.sintProblems.problem2Solved, explainProblem2);
                sint("En ten slotte...");
                sint("Nee, dit was alles!");
              },
              () => {
                hiddoPos({
                  visible: true,
                  dollSettings: { expression: "mouth-closed" },
                });
                sint("Hiddo, zou je me willen helpen met mijn boek?");
                hiddo("Ja, natuurlijk!", { expression: "happy" });
                hiddoPos({ dollSettings: { expression: "mouth-closed" } });
                sint("Er zijn wat dingen die ik lijk te missen.");
                sint(
                  "Ik zou je graag willen vertellen wat, maar ik ben mijn leesbril kwijt."
                );
                hiddo(
                  "Geen probleem, ik vind wel een goede leesbril voor je.",
                  {
                    expression: "enthusiastic",
                  }
                );
                hiddoPos({ dollSettings: { expression: "mouth-closed" } });

                sint("Oh, dat zou echt geweldig zijn. Dank je.");
                updateState(state => state.updateSint("glasses"));
              }
            )
        );
        sintPos({ visible: false });
        hiddoPos({ visible: false });
        show();
      },
    },
  ]);
  hold();
};

export default sintroom;
