import { Queue } from "src/lib/events/types";
import scriptHelpers from "src/lib/script-helpers";

import hoofdPiet from "src/content/assets/hotspots/hall-piet.png";
import carpet from "src/content/assets/hotspots/hall-carpet.png";

import backgroundTrack from "src/content/assets/sounds/background.mp3";
import { MenuType } from "src/lib/script-helpers/flow";

const pietenhuis = (queue: Queue) => {
  const {
    fadeIn,
    fadeOut,
    onState,
    updateState,
    updateBackground,
    manageCharacter,
    jump,
    hold,
    buttons,
    menu,
    playMusic,
    stopMusic,
  } = scriptHelpers(queue);
  const { say: hiddo, pos: hiddoPos } = manageCharacter(
    "hiddo",
    "hiddo",
    "Hiddo",
    {
      x: 512,
      y: 130,
      visible: false,
      dollSettings: {},
    }
  );
  const { say: piet, pos: pietPos } = manageCharacter(
    "piet",
    "piet",
    "Hoofdpiet",
    {
      x: -50,
      y: 100,
      flipped: true,
      visible: false,
      dollSettings: {},
    }
  );

  updateBackground({ image: "hall", frontLayer: undefined, blur: false });
  fadeIn();
  playMusic(backgroundTrack, { volume: 0.1 });

  buttons([
    {
      id: "hoofdPiet",
      hoverEffect: "glow",
      image: hoofdPiet,
      position: [50, 260],
      onClick({ show, hide }) {
        hide();
        piet("Welkom! Leuk dat je ons wilt komen helpen!", {
          expression: "happy",
        });
        hiddoPos({ x: 700, y: 130, visible: true });
        menu(
          {
            "Waarmee kan ik helpen?": () => {
              piet("Goede vraag! even nadenken...", {
                expression: "sip",
                body: "think",
              });

              onState(
                state => state.poemPiet !== "helped",
                () => {
                  piet("Oh ja! Rijmpiet boven heeft hulp nodig.", {
                    expression: "happy",
                    body: "pointUp",
                  });
                  piet("Maar pas op, hij is een beetje...", {
                    expression: "hmm",
                    body: "default",
                  });
                  piet("... Prikkelbaar.", { expression: "grin" });
                },
                () => {
                  piet(
                    "Rijmpiet heb je al geholpen, die is weer helemaal blij...",
                    {
                      expression: "happy",
                      body: "think",
                    }
                  );
                }
              );

              onState(
                state => state.sint !== "helped",
                () => {
                  piet("Sinterklaas heeft wat problemen met zijn boek.", {
                    expression: "hmm",
                    body: "think",
                  });
                  piet("Ik denk dat je hem wel goed kan helpen!", {
                    expression: "happy",
                    body: "pointUp",
                  });
                },
                () => {
                  piet("Sinterklaas was erg blij met alle hulp die je gaf.", {
                    expression: "happy",
                    body: "think",
                  });
                }
              );

              onState(
                state => state.bakingPiet !== "helped",
                () => {
                  piet(
                    "Bakpiet hiernaast lijkt maar geen pepernoten te kunnen bakken....",
                    {
                      expression: "hmm",
                      body: "think",
                    }
                  );
                  piet("Ik weet niet of jij goed in bakken bent?", {
                    expression: "hmm",
                    body: "think",
                  });
                },
                () => {
                  piet(
                    "Bakpiet gaat zo weer aan de slag! Ik kan niet wachten om straks wat bij hem te gaan snoepen...",
                    {
                      expression: "happy",
                      body: "default",
                    }
                  );
                }
              );
            },
            "Waar is Sinterklaas?": () => {
              piet("Sinterklaas is boven in zijn werkkamer.", {
                expression: "sip",
              });
              piet("Hier de trap op en dan naar links.", { expression: "sip" });
            },
            "Over die pakjes zakken hiernaast....": {
              condition: s =>
                s.sint === "glasses" &&
                s.livingVisited &&
                (s.glasses === "location" || s.glasses === "none"),
              onClick: () => {
                piet("Ja wat wil je weten?");
                hiddo("Ik vroeg me af welke zak met pakjes voor ons was...");
                piet(
                  "Oeh, wil je ze helpen bezorgen? Dat hoeft niet hoor, dat doen de pieten wel!"
                );
                hiddo(
                  "Nou ik wilde kijken of er misschien iets tussen zat om aan de Sint te geven..."
                );
                piet(
                  "Oh dat is aardig! Het is natuurlijk tenslotte zijn verjaardag!"
                );
                hiddo("Eh, ja, dat is precies de reden!");
                piet("De rechter zak met pakjes is voor jullie.");
                hiddo("Super, bedankt!");
                updateState(a => a.updateGlasses("location"));
              },
            },
            "Ik kijk nog even rond": ({ endDialog }) => {
              piet("Ok.", { expression: "sip" });
              endDialog();
              pietPos({ visible: false });
              hiddoPos({ visible: false });
            },
          },
          MenuType.Dialog
        );
        show();
      },
    },
    {
      id: "carpet",
      hoverEffect: "glow",
      image: carpet,
      position: [230, 640],
      onClick: () => {
        stopMusic();
        fadeOut();
        jump("pietenhuis");
      },
    },
    {
      id: "topright",
      hoverEffect: "glow",
      coordinates: [730, 0, 919, 0, 890, 95, 730, 191],
      onClick: () => {
        stopMusic();
        fadeOut();
        jump("poemroom");
      },
    },
    {
      id: "topleft",
      hoverEffect: "glow",
      coordinates: [370, 0, 550, 0, 550, 195, 400, 100],
      onClick: () => {
        stopMusic();
        fadeOut();
        jump("sintroom");
      },
    },
    {
      id: "right",
      hoverEffect: "glow",
      color: "black",
      // prettier-ignore
      coordinates: [
        1195, 195, 1195, 476, 1185, 477,
        1180, 539, 1020, 475, 1018, 245,
      ],
      onClick: () => {
        fadeOut();
        jump("living");
      },
    },
    {
      id: "kitchen",
      hoverEffect: "glow",
      color: "black",
      // prettier-ignore
      coordinates: [
        861, 266, 866, 336, 892,337, 896, 456, 935, 454, 938, 265
      ],
      onClick: () => {
        onState(
          s => s.bakingPiet === "helped",
          () => {
            fadeOut();
            jump("kitchen");
          },
          () => {
            hiddo("Hmm, de deur van de keuken zit op slot.");
          }
        );
      },
    },
  ]);

  onState(
    s => !s.mansionAccess,
    () => {
      hiddo("Wow!");
      updateState(a => a.hasMansionAccess());
    }
  );
  hiddoPos({ visible: false });
  hold();
};

export default pietenhuis;
