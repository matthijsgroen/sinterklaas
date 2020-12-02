import { Queue } from "src/lib/events/types";
import scriptHelpers from "src/lib/script-helpers";

import sintHotspot from "../assets/hotspots/sint-room-sint.png";
import bookHotspot from "../assets/hotspots/sint-room-book.png";
import drawing1Hotspot from "../assets/hotspots/sint-room-drawing1.png";
import drawing2Hotspot from "../assets/hotspots/sint-room-drawing2.png";
import recipeHotspot from "../assets/hotspots/sint-room-recipe.png";
import milkHotspot from "../assets/hotspots/sint-room-milk.png";

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

  const { say: sint, pos: sintPos, doll: sintDoll } = manageCharacter(
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
      sint("Hey, Hiddo, wat gezellig dat je er bent!", { expression: "happy" });

      sintPos({ visible: false });
      updateState(actions => actions.updateSint("visited"));
    }
  );

  const gameComplete = (show: (id?: string | undefined) => void) => {
    onState(
      s => s.gingerbreadButtonPie === "done" && s.listCarl === "done",
      () => {
        updateState(a => a.updateSint("helped"));
        sint("Nou, volgens mij is alles weer op orde!", {
          expression: "mouth-open-sip",
          glasses: false,
        });
        show("book");
        sint("We gaan het gewoon toch weer redden dit jaar!", {
          body: "default",
          expression: "happy",
        });
        fadeOut();
        stopMusic();
        jump("gameComplete");
      }
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
        hide("book");
        onState(
          s => s.glasses === "done",
          () => {
            sint("Dag hoor!", {
              body: "book",
              glasses: true,
              expression: "happy",
            });
          },
          () => {
            sint("Dag hoor!", {
              body: "default",
              glasses: false,
              expression: "happy",
            });
          }
        );
        stopMusic();
        fadeOut();
        jump("hall");
      },
    },
    {
      id: "Milk",
      image: milkHotspot,
      position: [580, 310],
      hoverEffect: "glow",
      condition: s =>
        s.gingerbreadButtonPie === "ingredients" &&
        s.neededIngriedients.includes("milk"),
      onClick: ({ hide }) => {
        hiddoPos({ visible: true });
        sintPos({ visible: true });
        hiddo("Hoi Sinterklaas, mag ik deze melk meenemen?");
        sint("Ja hoor, geen probleem, ik heb net mijn glas gevuld.");
        hide();
        updateState(a => a.findIngredient("milk"));

        hiddo("Bedankt!");
        hiddoPos({ visible: false });
        sintPos({ visible: false });
      },
    },
    {
      id: "book",
      image: bookHotspot,
      position: [610, 365],
      onClick: () => {
        // no action
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
          "Oh inderdaad. Dat is niet om naar te kijken, maar lekker om op te snoepen."
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
        hide("book");
        sintPos({
          visible: true,
          dollSettings: { body: "book", glasses: true, expression: "reading" },
        });
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
                        sintDoll({ expression: "mouth-closed" });
                        hiddo("Ik heb denk ik wat u zoekt.", {
                          expression: "happy",
                        });
                        sint(
                          "Ow wat fijn, dan kan ik mijn boek weer bijwerken.",
                          { expression: "happy" }
                        );
                        sint("... ... ...", { expression: "reading" });
                        sint("Ow... alweer dat... nouja dat mag hoor.", {
                          expression: "eyes-down",
                        });
                        sint("Super bedankt!", { expression: "happy" });
                        updateState(a => a.updateListCarl("done"));

                        gameComplete(show);
                      },
                      () => {
                        hiddo(
                          "Ow ik weet het weer, ik moest even naar Rijmpiet toe.",
                          { expression: "happy", body: "chin" },
                          { body: "default", expression: "mouth-closed" }
                        );
                      }
                    );
                  },
                },
                "Over de pepernoten taart...": () => {
                  onState(
                    s => s.bakingPiet === "new",
                    () => {
                      sint(
                        "Ben je al bij bakpiet geweest?",
                        { expression: "happy" },
                        { expression: "mouth-closed" }
                      );
                      hiddo(
                        "Ownee, dat was het, ik moest naar Bakpiet toe!",
                        { body: "open", expression: "question" },
                        { body: "default", expression: "mouth-closed" }
                      );
                      sintDoll({ expression: "reading" });
                    },
                    () =>
                      onState(
                        s => s.bakingPiet === "visited",
                        () => {
                          sintDoll({ expression: "mouth-closed" });
                          hiddo(
                            "Ik wil het graag aan Bakpiet vragen, maar hij is een recept kwijt.",
                            { body: "open", expression: "question" },
                            { body: "default", expression: "mouth-closed" }
                          );
                          sint("Och, ik ben ook wel eens iets kwijt.", {
                            expression: "mouth-open-sip",
                          });
                          sint(
                            "Vaak helpt het om gewoon even rust te scheppen in je hoofd voordat je gaat zoeken....",
                            { expression: "eyes-down" }
                          );
                          sint(
                            "Ik doe dat vaak door even naar de prachtige kindertekeningen in mijn kamer te kijken.",
                            { expression: "happy" }
                          );
                        },
                        () => {
                          onState(
                            s => s.gingerbreadButtonPie === "inventory",
                            () => {
                              sintDoll({ expression: "mouth-closed" });
                              hiddo(
                                "Hij is klaar Sinterklaas! Ik heb de taart hier.",
                                { expression: "very-enthusiastic" }
                              );
                              sint(
                                "Ow dat zal Catootje heerlijk vinden. Dank je wel.",
                                { expression: "happy" }
                              );
                              updateState(a =>
                                a.updateGingerbreadButtonPie("done")
                              );
                              gameComplete(show);
                            },
                            () => {
                              sintDoll({ expression: "mouth-closed" });
                              hiddo(
                                "We zijn er druk mee bezig.",
                                { expression: "happy" },
                                { expression: "mouth-closed" }
                              );
                              sint(
                                "Ah. Dat is fijn om te horen.",
                                { expression: "happy" },
                                { expression: "mouth-closed" }
                              );
                            }
                          );
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
                sintPos({ dollSettings: { expression: "mouth-closed" } });
                hiddo(
                  "Sinterklaas, ik heb een bril voor u!",
                  { expression: "happy" },
                  { expression: "mouth-closed" }
                );
                sint("Ow wat fijn! Ik ben benieuwd.", { expression: "happy" });

                updateState(a => a.updateSint("details"));
                updateState(a => a.updateGlasses("done"));

                sint(
                  "Ooh dit is echt heel fijn.",
                  { glasses: true, expression: "mouth-open-sip" },
                  { expression: "mouth-closed" }
                );
                pause(200);
                hide("book");
                sint("Nou, kan ik eindelijk in het grote boek kijken...", {
                  body: "book",
                  expression: "eyes-down",
                });
                sint("Ik weet dat ik wat dingetjes mis...", {
                  expression: "reading",
                });
                sint("...even kijken hoor.", { expression: "eyes-down" });

                sint("Ik ben het verlanglijstje van Carl kwijtgeraakt.", {
                  expression: "mouth-open-sip",
                });
                sint("Ik kan er helemaal niets van vinden in mijn boek.", {
                  expression: "eyes-down",
                });
                sint(
                  "Rijmpiet heeft het lijstje van Carl vast in zijn boekenkast.",
                  { expression: "happy" }
                );
                sint("Hij houdt altijd erg goed dit soort zaken bij.", {
                  expression: "mouth-open-sip",
                });
                updateState(a => a.updateListCarl("desired"));

                sint("En verder...", { expression: "reading" });
                sint(
                  "Oh, ik lees hier net dat Catootje heel erg gek is op pepernotentaart...",
                  { expression: "eyes-down" }
                );
                sint(
                  "Dat zou leuk zijn om te geven, misschien wil Bakpiet er wel eentje maken?",
                  { expression: "happy" }
                );
                updateState(a => a.updateGingerbreadButtonPie("desired"));

                sint("En, tenslotte...", { expression: "reading" });
                sint("Nee, dit was alles!", {
                  expression: "happy",
                  glasses: false,
                });
              },
              () => {
                hiddoPos({
                  visible: true,
                  dollSettings: { expression: "mouth-closed" },
                });
                sint(
                  "Hiddo, zou je me willen helpen met mijn boek?",
                  { expression: "happy" },
                  { expression: "mouth-closed" }
                );
                hiddo(
                  "Ja, natuurlijk!",
                  { expression: "happy" },
                  { expression: "mouth-closed" }
                );
                sint("Er zijn wat dingen die ik lijk te missen.", {
                  expression: "happy",
                });
                sint(
                  "Ik zou je graag willen vertellen wat, maar ik ben mijn leesbril kwijt.",
                  { expression: "mouth-open-sip" },
                  { expression: "mouth-closed" }
                );
                hiddo(
                  "Geen probleem, ik vind wel een goede leesbril voor je.",
                  { expression: "enthusiastic" },
                  { expression: "mouth-closed" }
                );

                sint("Oh, dat zou echt geweldig zijn. Dank je.", {
                  expression: "happy",
                });
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
