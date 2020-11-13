import { Queue } from "src/lib/events/types";
import { pause } from "src/lib/scene";
import scriptHelpers from "src/lib/script-helpers";
import pietSipHotspot from "../assets/hotspots/poem-room-piet.png";

const pietenhuis = (queue: Queue) => {
  const {
    fadeIn,
    fadeOut,
    jump,
    updateBackground,
    buttons,
    hold,
    hpunch,
    manageCharacter,
    menu,
    onState,
    updateState,
  } = scriptHelpers(queue);

  updateBackground({ image: "poemroom", frontLayer: undefined, blur: false });
  fadeIn();

  const { say: poem, pos: poemPos } = manageCharacter(
    "poem",
    "piet",
    "Rijmpiet",
    {
      x: 150,
      y: 100,
      flipped: true,
      visible: false,
      dollSettings: {
        color: "red",
        body: "default",
        expression: "annoyed",
        glasses: true,
      },
    }
  );
  const { say: hiddo, pos: hiddoPos } = manageCharacter(
    "hiddo",
    "hiddo",
    "Hiddo",
    {
      visible: false,
      x: 750,
      y: 100,
      flipped: false,
      dollSettings: {
        expression: "happy",
      },
    }
  );

  const playGame = () => {
    hiddoPos({ visible: true });
    hiddo("Ik heet Hiddo en ik help jou.");
    hiddo("Ja die rijmwoorden schud ik uit mijn mouw.");
    hiddo("Een gedicht is geen uitdaging voor mij.");
    hiddo("Dus Piet zet je zorgen maar op zij.");

    /**
     *
     * - Zeker geen probleem!
     * Ik ben super goed in rijmen
     * Ik kan rijmen en dichten
     * zonder mijn hemd op te lichten!
     *
     * - Ok, ok, indrukwekkend...
     *
     * Ik zit hier met een gedicht...
     *
     * Lieve Tristan,
     *
     * Op je kamer heel alleentjes...
     *
     * - Speel je graag met stapelbare steentjes,
     *
     * Wow! Dat is mooi!
     * Ahum verder dan...
     *
     * Maar ook de switch is erg in trek,
     *
     * - Ja spelletjes vindt je te gek!
     *
     * Oooh! Die is goed!
     *
     * Dus ga nu je cadeau maar opsporen!
     * hij ligt vast in de schoenentoren!
     *
     * op papier -> hopelijk zal deze buit je bekoren!
     *
     */
    poemPos({ visible: false });
    hiddoPos({ visible: false });
  };

  const playChoice = () => {
    menu({
      "Ja zeker!": () => {
        playGame();
      },
      "Is het goed als ik je straks kom helpen?": () => {
        poemPos({ visible: true });
        poem("Ok...", { expression: "sip" });
        poemPos({ visible: false });
      },
    });
  };

  onState(
    s => s.poemPiet === "new",
    () => {
      poemPos({ visible: true });
      pause(100);
      hpunch();
      poem("Hey! wat kom je hier doen??");
      hpunch();
      poem("Ik wil niet gestoord worden!", { expression: "shout" });
      poem("... ... ...", { expression: "sip" });
      pause(200);
      poem("Ik heb geen inspiratie!!", { expression: "crying" });
      poem("... ... ...", { expression: "sip" });
      poem("Zou jij me willen helpen?");
      updateState(a => a.updatePoemPiet("visited"));
      playChoice();
    }
  );

  buttons([
    {
      id: "hall",
      hoverEffect: "glow",
      coordinates: [1190, 0, 1280, 0, 1280, 445, 1262, 550, 1120, 461],
      color: "black",
      onClick: () => {
        fadeOut();
        jump("hall");
      },
    },
    {
      id: "pietSip",
      hoverEffect: "glow",
      image: pietSipHotspot,
      position: [436, 134],
      onClick: ({ hide, show }) => {
        hide();
        poem("Zou jij me willen helpen?", { expression: "sip" });
        playChoice();
        show();
      },
    },
  ]);
  hold();
};

export default pietenhuis;
