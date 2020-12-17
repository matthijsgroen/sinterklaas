import { Queue } from "src/lib/events/types";
import scriptHelpers from "src/lib/script-helpers";
import characterHelpers from "./helpers/characters";

import rapTrack from "../assets/sounds/372069__swagmasterlord__80-s-old-school-rap-drum-loop.mp3";
import backgroundTrack from "src/content/assets/sounds/background-sint.mp3";
import { hud } from "./hud";

const gameComplete = (queue: Queue) => {
  const {
    fadeIn,
    fadeOut,
    updateBackground,
    manageCharacter,
    pause,
    playMusic,
    stopMusic,
    say,
  } = scriptHelpers(queue);
  hud(queue);
  const { reporter } = characterHelpers(queue);

  updateBackground({ image: "pietenhuis", frontLayer: "news2", blur: true });

  const { say: piet, pos: pietPos } = manageCharacter(
    "piet",
    "piet",
    "Hoofdpiet",
    {
      x: 350,
      y: 10,
      dollSettings: { expression: "small-smile" },
    }
  );
  pietPos({ x: 550, y: 85, scale: 1.0 });
  fadeIn();
  pause();

  piet("Hallo kinderen! Goed nieuws!", { expression: "happy" });
  piet(
    "Het Sinterklaasfeest gaat gewoon door!",
    { expression: "big-smile" },
    { expression: "small-smile" }
  );
  reporter("Oh, hoe is je dat gelukt?");
  piet(
    "We hebben hulp gekregen van Hiddo.",
    { expression: "grin" },
    { expression: "small-smile" }
  );

  const { say: hiddo, pos: hiddoPos } = manageCharacter(
    "hiddo",
    "hiddo",
    "Hiddo",
    {
      x: 100,
      y: 70,
      flipped: true,
      dollSettings: {},
    }
  );

  hiddo(
    "Euh, hallo.",
    { expression: "happy", body: "wave" },
    { expression: "mouth-closed", body: "default" }
  );
  piet(
    "Kijk dit is 'm! Hij zou zo superpiet kunnen zijn!",
    { expression: "happy" },
    { expression: "small-smile" }
  );
  reporter("Vertel Hiddo, wat heb je zoal moeten doen?");
  hiddoPos({ flipped: false });
  hiddo(
    "Nou ik heb het recept van pepernoten teruggevonden voor bakpiet...",
    { expression: "enthusiastic", body: "chin" },
    { expression: "mouth-closed", body: "default" }
  );

  hiddoPos({ flipped: true });
  pietPos({ flipped: true, x: 320 });
  const { say: bakpiet, pos: bakpietPos } = manageCharacter(
    "bakpiet",
    "piet",
    "Bakpiet",
    {
      x: 850,
      y: 125,
      dollSettings: { color: "white" },
    }
  );
  bakpiet("Ja, ik kon hem nergens meer vinden!", {
    expression: "sip-open",
    body: "hip",
  });
  bakpiet("Maar Hiddo had 'm zo weer terug!", { expression: "grin" });
  bakpiet(
    "En we hebben samen nog een heerlijke pepernotentaart gemaakt!",
    { expression: "happy" },
    { expression: "small-smile" }
  );
  reporter("Nou, nou, kijk aan...");

  hiddoPos({ x: 250, flipped: false });
  pietPos({ x: 470, flipped: false });
  const { say: poem, pos: poemPos } = manageCharacter(
    "poem",
    "piet",
    "Rijmpiet",
    {
      x: -100,
      y: 100,
      flipped: true,
      dollSettings: {
        color: "red",
        body: "default",
        expression: "happy",
        glasses: true,
      },
    }
  );

  playMusic(rapTrack, { volume: 0.3 });
  poem(
    "Maar dat was nog niet alles, oh nee. Hiddo hielp mij uit de ratsmodee."
  );
  poem(
    "Mijn inspiratie was helemaal opgedroogd. Maar hij heeft mijn rijmniveau gewoon verhoogd.",
    { expression: "grin", body: "pointUp" }
  );
  poem(
    "Alle gedichten vliegen weer uit mijn veer. Allemaal uniek en tof, keer op keer.",
    { body: "default", expression: "happy" },
    { expression: "small-smile" }
  );
  stopMusic({ fadeOut: true });
  reporter("Nou wat ontzettend fijn om te horen!");
  pause(100);

  playMusic(backgroundTrack, { fadeIn: true });
  hiddoPos({ flipped: true });
  poemPos({ x: -150 });
  pietPos({ x: 50, flipped: true });
  bakpietPos({ x: 500, flipped: true });

  const { say: sint, pos: sintPos } = manageCharacter(
    "sint",
    "sint",
    "Sinterklaas",
    {
      x: 900,
      y: 30,
      dollSettings: { expression: "mouth-closed" },
    }
  );
  pause(800);
  sintPos({ x: 700 });
  bakpietPos({ x: 700 });
  pause(800);
  bakpietPos({ x: 900, flipped: false });
  sintPos({ x: 550 });

  sint(
    "Ja, Hiddo heeft ons super goed geholpen.",
    { expression: "happy" },
    { expression: "mouth-closed" }
  );
  reporter("S-S-s-interklaas!");
  sint("Ja zeker, geen Sinterklaasfeest zonder mij natuurlijk!", {
    expression: "wink",
  });
  sint("Het is tenslotte mijn verjaardag.", { expression: "eyes-down" });
  sint("Hiddo, heel erg bedankt jongen!", { expression: "happy" });
  sint("... Ow bijna vergeten!", { expression: "mouth-open-sip" });

  hiddoPos({ visible: false });
  poemPos({ visible: false });
  bakpietPos({ visible: false });
  pietPos({ visible: false });

  updateBackground({ frontLayer: undefined });
  sintPos({ scale: 1.4, x: 380, y: 10 });

  sint("Je krijgt natuurlijk ook nog een echt pakje!", {
    expression: "mouth-open-sip",
  });
  sint("Jouw echte cadeau ligt verstopt in jouw kledingkast.", {
    expression: "happy",
  });
  sint("Veel plezier!", { expression: "wink" });
  fadeOut();
  say(null, "Einde.");
  stopMusic({ fadeOut: true });
};

export default gameComplete;
