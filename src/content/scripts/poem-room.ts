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
    say,
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

  const vraag2 = () => {
    poem("Wow! Dat is mooi!");
    poem("*Ahum*");
    poem("Verder dan...");

    say(null, "Maar ook de switch is erg in trek,"); // TODO: Papier look

    menu({
      "Want je bent gek op gamen!": () => {
        fout();
      },
      "Ja spelletjes vind je super leuk!": () => {
        fout();
      },
      "Ja spelletjes vindt je te gek!": () => {
        vraag3();
      },
    });
  };

  const vraag3 = () => {
    poem("Oooh! Die is goed!");
    poem("*Ahum*");
    poem("Verder dan...");

    say(null, "Dus ga nu je cadeau maar opsporen!"); // TODO: Papier look

    menu({
      "Hij ligt vast in de schoenentoren!": () => {
        // op papier -> hopelijk zal deze buit je bekoren!
        klaar();
      },
      "Want we hebben hem verstopt!": () => {
        fout();
      },
      "Haha je gaat hem nooit vinden!": () => {
        fout();
      },
    });
  };

  const klaar = () => {
    poem("Fantastisch! Wat een goed gedicht!");
    poem("Die ga ik meteen op dit pakje plakken!");
    // TODO: Add state
  };

  const fout = () => {
    // TODO: Add facial expressions
    poem("Aiiii dat rijmt niet!");
    poem("Fout fout fout!");
    poem("Het lukt ons nooit!");
  };

  const playGame = () => {
    hiddoPos({ visible: true });
    hiddo("Ik heet Hiddo en ik help jou.");
    hiddo("Ja die rijmwoorden schud ik uit mijn mouw.");
    hiddo("Een gedicht is geen uitdaging voor mij.");
    hiddo("Dus Piet zet je zorgen maar op zij.");
    hiddo("Van mijn rijmen en dichten, zullen alle kinderen zwichten!");

    poem("Ok, ok, indrukwekkend...");
    poem("Ik zit hier met een gedicht...");

    say(null, "Lieve Tristan,"); // TODO: Papier look
    say(null, "Op je kamer heel alleentjes..."); // TODO: Papier look

    menu({
      "Lig je de hele dag in bed?": () => {
        fout();
      },
      "Speel je graag met stapelbare steentjes,": () => {
        vraag2();
      },
      "Speel je graag met Lego,": () => {
        fout();
      },
    });

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
