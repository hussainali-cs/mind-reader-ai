/* =====================================================
   MIND READER AI
   Built with HTML, CSS & Vanilla JavaScript
   Hussain Ali
===================================================== */


/* =====================================================
   DOM
===================================================== */

const modeButtons =
    document.querySelectorAll(".mode-button");

const readerMode =
    document.getElementById("readerMode");

const guesserMode =
    document.getElementById("guesserMode");

const numberGrid =
    document.getElementById("numberGrid");

const yesButton =
    document.getElementById("yesButton");

const noButton =
    document.getElementById("noButton");

const cardNumber =
    document.getElementById("cardNumber");

const progressFill =
    document.getElementById("progressFill");

const readerInstruction =
    document.getElementById("readerInstruction");

const botGuess =
    document.getElementById("botGuess");

const botMessage =
    document.getElementById("botMessage");

const thinkingLabel =
    document.getElementById("thinkingLabel");

const lowerButton =
    document.getElementById("lowerButton");

const higherButton =
    document.getElementById("higherButton");

const correctButton =
    document.getElementById("correctButton");

const attemptsElement =
    document.getElementById("attempts");

const rangeDisplay =
    document.getElementById("rangeDisplay");

const gamesPlayedElement =
    document.getElementById("gamesPlayed");

const gamesWonElement =
    document.getElementById("gamesWon");

const bestAttemptsElement =
    document.getElementById("bestAttempts");

const resultOverlay =
    document.getElementById("resultOverlay");

const resultIcon =
    document.getElementById("resultIcon");

const resultLabel =
    document.getElementById("resultLabel");

const resultTitle =
    document.getElementById("resultTitle");

const resultNumber =
    document.getElementById("resultNumber");

const resultDescription =
    document.getElementById("resultDescription");

const playAgain =
    document.getElementById("playAgain");

const themeButton =
    document.getElementById("themeButton");

const soundButton =
    document.getElementById("soundButton");

const year =
    document.getElementById("year");


/* =====================================================
   STATE
===================================================== */

let currentMode = "reader";

let readerCardIndex = 0;

let readerNumber = 0;

let readerResult = 0;

let soundEnabled = true;

let gamesPlayed = 0;

let gamesWon = 0;

let bestAttempts = null;


/* Guesser state */

let guessLow = 1;

let guessHigh = 100;

let currentGuess = 50;

let guessAttempts = 0;

let guesserFinished = false;


/* =====================================================
   LOCAL STORAGE
===================================================== */

function loadStats() {

    const savedStats =
        localStorage.getItem(
            "mindReaderStats"
        );

    const savedSound =
        localStorage.getItem(
            "mindReaderSound"
        );


    if (savedStats) {

        const data =
            JSON.parse(savedStats);

        gamesPlayed =
            data.gamesPlayed || 0;

        gamesWon =
            data.gamesWon || 0;

        bestAttempts =
            data.bestAttempts ?? null;

    }


    if (savedSound !== null) {

        soundEnabled =
            savedSound === "true";

    }


    updateStats();

    updateSoundIcon();

}


/* =====================================================
   SAVE STATS
===================================================== */

function saveStats() {

    localStorage.setItem(
        "mindReaderStats",

        JSON.stringify({
            gamesPlayed,
            gamesWon,
            bestAttempts
        })
    );

    localStorage.setItem(
        "mindReaderSound",
        soundEnabled
    );

}


/* =====================================================
   STATS UI
===================================================== */

function updateStats() {

    gamesPlayedElement.textContent =
        gamesPlayed;

    gamesWonElement.textContent =
        gamesWon;

    bestAttemptsElement.textContent =
        bestAttempts === null
            ? "—"
            : bestAttempts;

}


/* =====================================================
   MODE SWITCHING
===================================================== */

modeButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const mode =
                button.dataset.mode;

            switchMode(mode);

        }
    );

});


function switchMode(mode) {

    currentMode = mode;


    modeButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.mode === mode
        );

    });


    if (mode === "reader") {

        readerMode.classList.remove(
            "hidden"
        );

        guesserMode.classList.add(
            "hidden"
        );

        startReaderGame();

    }

    else {

        readerMode.classList.add(
            "hidden"
        );

        guesserMode.classList.remove(
            "hidden"
        );

        startGuesserGame();

    }

}


/* =====================================================
   MIND READER
===================================================== */

function startReaderGame() {

    readerCardIndex = 0;

    readerResult = 0;

    /*
       Generate the six binary cards.

       Card 1 contains numbers whose
       binary representation has bit 0.

       Card 2 has bit 1.

       etc.

       Number 42, for example:

       42 = 32 + 8 + 2

       Therefore cards:
       2, 4 and 6 will contain 42.
    */

    readerNumber =
        Math.floor(
            Math.random() * 63
        ) + 1;


    renderReaderCard();

}


/* =====================================================
   RENDER READER CARD
===================================================== */

function renderReaderCard() {

    numberGrid.innerHTML = "";

    const bit =
        readerCardIndex;

    const firstNumber =
        1;

    const lastNumber =
        63;


    for (
        let number = firstNumber;
        number <= lastNumber;
        number++
    ) {

        /*
           Check if this number contains
           the current binary bit.
        */

        if (
            (number & (1 << bit)) !== 0
        ) {

            const element =
                document.createElement("div");

            element.className =
                "number";

            element.textContent =
                number;

            numberGrid.appendChild(
                element
            );

        }

    }


    cardNumber.textContent =
        readerCardIndex + 1;


    progressFill.style.width =
        `${((readerCardIndex + 1) / 6) * 100}%`;


    readerInstruction.textContent =
        "Does your number appear below?";

}


/* =====================================================
   READER ANSWER
===================================================== */

yesButton.addEventListener(
    "click",
    () => {

        /*
           Each card represents a binary value:

           Card 1 = 1
           Card 2 = 2
           Card 3 = 4
           Card 4 = 8
           Card 5 = 16
           Card 6 = 32
        */

        readerResult +=
            Math.pow(
                2,
                readerCardIndex
            );


        playClickSound();

        nextReaderCard();

    }
);


noButton.addEventListener(
    "click",
    () => {

        playClickSound();

        nextReaderCard();

    }
);


/* =====================================================
   NEXT READER CARD
===================================================== */

function nextReaderCard() {

    readerCardIndex++;

    if (
        readerCardIndex >= 6
    ) {

        setTimeout(
            revealReaderResult,
            400
        );

        return;

    }


    renderReaderCard();

}


/* =====================================================
   REVEAL READER RESULT
===================================================== */

function revealReaderResult() {

    gamesPlayed++;

    gamesWon++;

    /*
       readerResult should always equal
       the number the user was thinking of.
    */

    updateStats();

    saveStats();

    showResult(
        "🧠",
        "MIND READ",
        "I calculated your number using binary mathematics.",
        readerResult
    );

    playSuccessSound();

}


/* =====================================================
   GUESS MY NUMBER
===================================================== */

function startGuesserGame() {

    guessLow = 1;

    guessHigh = 100;

    guessAttempts = 0;

    guesserFinished = false;

    calculateNextGuess();

}


/* =====================================================
   CALCULATE NEXT GUESS
===================================================== */

function calculateNextGuess() {

    if (
        guessLow > guessHigh
    ) {

        /*
           This means the user has provided
           contradictory answers.
        */

        botMessage.textContent =
            "Hmm... your answers don't seem consistent.";

        thinkingLabel.textContent =
            "CHECK YOUR ANSWERS";

        disableGuesserControls();

        return;

    }


    currentGuess =
        Math.floor(
            (guessLow + guessHigh) / 2
        );


    botGuess.textContent =
        currentGuess;

    attemptsElement.textContent =
        guessAttempts;

    rangeDisplay.textContent =
        `${guessLow} – ${guessHigh}`;


    botMessage.textContent =
        `Is your number ${currentGuess}?`;

    thinkingLabel.textContent =
        "I'M THINKING...";

}


/* =====================================================
   HIGHER
===================================================== */

higherButton.addEventListener(
    "click",
    () => {

        if (guesserFinished) return;

        /*
           User says:
           My number is HIGHER than your guess.

           Therefore:
           lower boundary becomes guess + 1.
        */

        guessLow =
            currentGuess + 1;

        guessAttempts++;

        playClickSound();

        botThinkingAnimation(
            calculateNextGuess
        );

    }
);


/* =====================================================
   LOWER
===================================================== */

lowerButton.addEventListener(
    "click",
    () => {

        if (guesserFinished) return;

        /*
           User says:
           My number is LOWER than your guess.

           Therefore:
           upper boundary becomes guess - 1.
        */

        guessHigh =
            currentGuess - 1;

        guessAttempts++;

        playClickSound();

        botThinkingAnimation(
            calculateNextGuess
        );

    }
);


/* =====================================================
   CORRECT
===================================================== */

correctButton.addEventListener(
    "click",
    () => {

        if (guesserFinished) return;

        guessAttempts++;

        guesserFinished = true;

        gamesPlayed++;

        gamesWon++;

        /*
           Update best attempt score.
        */

        if (
            bestAttempts === null ||
            guessAttempts < bestAttempts
        ) {

            bestAttempts =
                guessAttempts;

        }


        updateStats();

        saveStats();

        disableGuesserControls();


        showResult(
            "🤖",
            "GOT IT!",
            `I found your number in ${guessAttempts} attempt${guessAttempts === 1 ? "" : "s"} using binary search.`,
            currentGuess
        );

        playSuccessSound();

    }
);


/* =====================================================
   BOT THINKING ANIMATION
===================================================== */

function botThinkingAnimation(
    callback
) {

    disableGuesserControls();

    thinkingLabel.textContent =
        "ANALYZING...";

    botMessage.textContent =
        "Narrowing down the possibilities...";


    let dots = 0;

    const interval =
        setInterval(
            () => {

                dots++;

                thinkingLabel.textContent =
                    "THINKING" +
                    ".".repeat(
                        (dots % 3) + 1
                    );

            },
            180
        );


    setTimeout(
        () => {

            clearInterval(interval);

            if (!guesserFinished) {

                calculateNextGuess();

                enableGuesserControls();

            }

        },
        650
    );

}


/* =====================================================
   DISABLE GUESS CONTROLS
===================================================== */

function disableGuesserControls() {

    higherButton.disabled = true;

    lowerButton.disabled = true;

    correctButton.disabled = true;

}


/* =====================================================
   ENABLE GUESS CONTROLS
===================================================== */

function enableGuesserControls() {

    if (guesserFinished) return;

    higherButton.disabled = false;

    lowerButton.disabled = false;

    correctButton.disabled = false;

}


/* =====================================================
   RESULT MODAL
===================================================== */

function showResult(
    icon,
    label,
    description,
    number
) {

    resultIcon.textContent =
        icon;

    resultLabel.textContent =
        label;

    resultTitle.textContent =
        number
            ? "YOUR NUMBER IS"
            : "GAME COMPLETE";

    resultNumber.textContent =
        number ?? "";

    resultDescription.textContent =
        description;


    resultOverlay.classList.add(
        "show"
    );

}


/* =====================================================
   PLAY AGAIN
===================================================== */

playAgain.addEventListener(
    "click",
    () => {

        resultOverlay.classList.remove(
            "show"
        );


        if (
            currentMode === "reader"
        ) {

            startReaderGame();

        }

        else {

            startGuesserGame();

        }

    }
);


/* =====================================================
   CLOSE MODAL
===================================================== */

resultOverlay.addEventListener(
    "click",
    event => {

        if (
            event.target === resultOverlay
        ) {

            resultOverlay.classList.remove(
                "show"
            );

        }

    }
);


/* =====================================================
   THEME
===================================================== */

themeButton.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light"
        );


        const lightMode =
            document.body.classList.contains(
                "light"
            );


        themeButton.textContent =
            lightMode
                ? "🌙"
                : "☀️";

    }
);


/* =====================================================
   SOUND
===================================================== */

soundButton.addEventListener(
    "click",
    () => {

        soundEnabled =
            !soundEnabled;

        updateSoundIcon();

        saveStats();

    }
);


function updateSoundIcon() {

    soundButton.textContent =
        soundEnabled
            ? "🔊"
            : "🔇";

}


/* =====================================================
   AUDIO ENGINE
===================================================== */

let audioContext = null;


function getAudioContext() {

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

    }

    return audioContext;

}


function beep(
    frequency,
    duration,
    type = "sine"
) {

    if (!soundEnabled) return;

    const context =
        getAudioContext();

    const oscillator =
        context.createOscillator();

    const gain =
        context.createGain();


    oscillator.type =
        type;

    oscillator.frequency.value =
        frequency;


    gain.gain.setValueAtTime(
        .07,
        context.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
        .001,
        context.currentTime + duration
    );


    oscillator.connect(gain);

    gain.connect(
        context.destination
    );


    oscillator.start();

    oscillator.stop(
        context.currentTime + duration
    );

}


/* =====================================================
   SOUND EFFECTS
===================================================== */

function playClickSound() {

    beep(
        520,
        .07
    );

}


function playSuccessSound() {

    setTimeout(
        () => beep(600, .1),
        0
    );

    setTimeout(
        () => beep(750, .1),
        120
    );

    setTimeout(
        () => beep(950, .18),
        240
    );

}


/* =====================================================
   YEAR
===================================================== */

year.textContent =
    new Date().getFullYear();


/* =====================================================
   INITIALIZE
===================================================== */

loadStats();

startReaderGame();