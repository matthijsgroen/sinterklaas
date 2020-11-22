import { Queue } from "src/lib/events/types";
import { pause } from "src/lib/scene";
import scriptHelpers from "src/lib/script-helpers";
import pietSipHotspot from "../assets/hotspots/poem-room-piet.png";
import pietHappyHotspot from "../assets/hotspots/poem-room-piet2.png";

const poemroom = (queue: Queue) => {
  const {
    fadeIn,
    fadeOut,
    jump,
    updateBackground,
    buttons,
    hold,
    hpunch,
    vpunch,
    manageCharacter,
    menu,
    say,
    onState,
    updateState,
  } = scriptHelpers(queue);

  updateBackground({ image: "poemroom", frontLayer: undefined, blur: false });
  fadeIn();
  const write = (content: string) => say(null, content, { look: "paper" });

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
  const { say: hiddo, pos: hiddoPos, doll: hiddoDoll } = manageCharacter(
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
    onState(
      s => s.poemPiet === "q2",
      () => {
        poem("Verder dan...");

        write("Maar ook de switch is erg in trek,"); // TODO: Papier look

        menu({
          "Want je bent gek op gamen!": () => {
            fout();
          },
          "Ja spelletjes vind je super leuk!": () => {
            fout();
          },
          "Ja spelletjes vindt je te gek!": () => {
            updateState(a => a.updatePoemPiet("q3"));
            poem("Oooh! Die is goed!", { expression: "happy" });
            poem("*Ahum*", { expression: "small-smile" });
            vraag3();
          },
        });
      },
      () => {
        write("Maar ook de switch is erg in trek,");
        write("Ja spelletjes vindt je te gek!");
        vraag3();
      }
    );
  };

  const vraag3 = () => {
    poem("Verder dan...");

    write("Dus ga nu je cadeau maar opsporen!");

    menu({
      "Hij ligt vast in de schoenentoren!": () => {
        // op papier -> hopelijk zal deze buit je bekoren!
        updateState(a => a.updatePoemPiet("helped"));
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
    poem("Fantastisch! Wat een goed gedicht!", { expression: "happy" });
    poem("Die ga ik meteen op dit pakje plakken!", { expression: "happy" });
    hiddo("Woohoo! Yes!", { body: "fists", expression: "very-enthusiastic" });
  };

  const fout = () => {
    hiddoDoll({ expression: "mouth-closed" });
    poem("Aiiii dat rijmt niet!", { expression: "annoyed" });
    vpunch();
    poem("Fout fout fout!", { expression: "shout" });
    poem("Het lukt ons nooit!", { expression: "crying" });
    hiddo("Oeps! Sorry...", { expression: "shocked" });
    poem("Ik ga het nog even alleen proberen dan...", { expression: "sip" });
  };

  const playGame = () => {
    hiddoPos({ visible: true });
    onState(
      s => s.poemPiet === "new" || s.poemPiet === "visited",
      () => {
        hiddo("Ik heet Hiddo en ik help jou.");
        hiddo("Ja die rijmwoorden schud ik uit mijn mouw.", {
          expression: "enthusiastic",
        });
        hiddo("Een gedicht is geen uitdaging voor mij.", {
          expression: "happy",
        });
        hiddo("Dus Piet zet je zorgen maar opzij.", {
          expression: "enthusiastic",
        });
        hiddo("Van mijn rijmen en dichten, zullen alle kinderen zwichten!", {
          expression: "very-enthusiastic",
        });
        hiddoDoll({ expression: "mouth-closed" });

        poem("Ok, ok, indrukwekkend...", { expression: "small-smile" });
        updateState(a => a.updatePoemPiet("q1"));
      },
      () => {
        hiddo("Ja, ik help je graag, vertel me wat is de vraag?", {
          expression: "enthusiastic",
        });
      }
    );
    poem("Ik zit hier met een gedicht...", { expression: "grin" });

    write("Lieve Tristan,");
    write("Op je kamer heel alleentjes...");
    onState(
      s => s.poemPiet === "q1",
      () => {
        menu({
          "Lig je de hele dag in bed?": () => {
            fout();
          },
          "Speel je graag met stapelbare steentjes.": () => {
            updateState(a => a.updatePoemPiet("q2"));
            poem("Wow! Dat is mooi!", { expression: "happy" });
            hiddoDoll({ expression: "mouth-closed" });
            poem("*Ahum*", { expression: "small-smile" });
            vraag2();
          },
          "Speel je graag met Lego.": () => {
            fout();
          },
        });
      },
      () => {
        write("Speel je graag met stapelbare steentjes.");
        vraag2();
      }
    );

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
      id: "pietHappy",
      skip: s => s.poemPiet !== "helped",
      hoverEffect: "glow",
      image: pietHappyHotspot,
      position: [436, 134],
      onClick: ({ hide, show }) => {
        hide();
        poem("Nog van harte bedankt voor al je begrip!", {
          expression: "happy",
        });
        poem("Dankzij jou ben ik nu uit mijn dip!", {
          expression: "small-smile",
        });
        poem("Ik ga nu weer snel verder met mijn werk.", {
          expression: "grin",
        });
        poem("Want mijn inspiratie is weer sterk!", { expression: "happy" });
        poemPos({ visible: false });
        show();
      },
    },
    {
      id: "pietSip",
      skip: s => s.poemPiet === "helped",
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

export default poemroom;
