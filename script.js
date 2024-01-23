const keys = document.querySelectorAll(".key");
const trigs = document.querySelectorAll(".trig");
const playButton = document.querySelector(".playbutton");
const clearButton = document.querySelector(".clearbutton");
const plusButton = document.querySelector(".plus");
const minusButton = document.querySelector(".minus");

const soundMappings = [68, 74, 83, 70, 65, 72, 75, 76];

let firstPlayCheck = 0;
let isRunning = false;
let intervalId;

let trigToHighlight = 0;
let keyPressed;
let kPID;
let tempo = 120;
const numberOfSteps = 16;
const numberOfKeys = 8;

const triggers = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const pressPlay = function () {
  playButton.classList.add("pressanim");
  console.log(tempo);
  if (!playButton.classList.contains("pressed"))
    playButton.classList.add("pressed");
  else playButton.classList.remove("pressed");

  if (!isRunning) {
    isRunning = true;
    trigToHighlight = 0;
  } else {
    isRunning = false;
    // removeSelectKeyAndTrigs();
  }
  console.log(isRunning);
  startApp();
};

const pressClear = function () {
  clearButton.classList.add("pressanim");

  if (!clearButton.classList.contains("pressed"))
    clearButton.classList.add("pressed");
  else clearButton.classList.remove("pressed");

  clearSequence();
};

const plusTempo = function () {
  tempo++;
  nextStep();
  updateTempo();
};

const minusTempo = function () {
  tempo--;
  updateTempo();
};

const updateTempo = function () {
  let tempoText = document.getElementById("temponumber");
  tempoText.innerText = `${tempo}`;
  clearInterval(intervalId);
  intervalSetter(tempo, nextStep);
};

const clearSequence = function () {
  removeSelectKeyAndTrigs();
  for (let i = 0; i < numberOfSteps; i++) {
    for (let _i = 0; _i < numberOfKeys; _i++) {
      triggers[i][_i] = 0;
    }
  }
};

const playSoundOnClick = function (note) {
  const audio = document.querySelector(`audio[data-key="${note}"]`);
  const key = document.querySelector(`.key[data-key="${note}"]`);
  if (!audio) return;
  audio.currentTime = 0;
  audio.play();
  key.classList.add("playing");
};

function removeKeyTransition(e) {
  // if (e.propertyName !== "transform") return;
  this.classList.remove("playing");
}

function removeTrigTransition(e) {
  this.classList.remove("pressanim");
}

const soundPressed = function (e) {
  keyName = e.target.id;
  playSoundOnClick(keyName);
};

const selectKey = function (e) {
  keyPressed = document.getElementById(`${e.target.id}`);
  kPID = Number(keyPressed.id);
  console.log(keyPressed);

  selectAndSetTrigs();
};

const removeSelectKeyAndTrigs = function () {
  trigs.forEach(function (trig) {
    trig.classList.remove("pressed");
  });
};

const selectKeyOnStart = function (key) {
  keyPressed = document.getElementById(`${key}`);
  kPID = Number(keyPressed.id);

  selectAndSetTrigs();
};

const selectAndSetTrigs = function () {
  // Selects the key and removes selection from others
  keys.forEach(function (keyTest) {
    if (keyTest !== keyPressed) keyTest.classList.remove("keyselected");
    else keyPressed.classList.add("keyselected");
  });

  // Adds the correctly pressed triggers via reading triggers array
  for (_i = 0; _i < numberOfKeys; _i++) {
    if (kPID === soundMappings[_i]) {
      trigs.forEach(function (trig, i) {
        if (triggers[i][_i] === 1 && kPID === soundMappings[_i])
          trig.classList.add("pressed");
        else trig.classList.remove("pressed");
      });
    }
  }
};

const removeTrigSelected = function () {
  trigs.forEach(function (trig) {
    trig.classList.remove("pressed");
  });
};

const lightTrig = function (trig) {
  const trigPressed = document.getElementById(`${trig}`);

  if (!trigPressed.classList.contains("pressed")) {
    trigPressed.classList.add("pressed");
  } else trigPressed.classList.remove("pressed");
};

const addTrigAnimation = function (trig) {
  const trigPressedId = document.getElementById(`${trig}`);
  trigPressedId.classList.add("pressanim");
};

const removeTrigAnimation = function (trig) {
  this.classList.remove("pressanim");
};

const removeTrigCycleAnimation = function (trig) {
  this.classList.remove("trigselected");
};

const trigPressed = function (trig) {
  const trigPressed = trig.target.id;
  lightTrig(trigPressed);
  addTrigAnimation(trigPressed);

  console.log(kPID);

  for (let i = 0; i < numberOfKeys; i++)
    for (let _i = 0; _i < numberOfSteps; _i++)
      if (kPID === soundMappings[i] && trigPressed === `trig${_i + 1}`)
        triggers[_i][i] = triggers[_i][i] === 0 ? 1 : 0;
};

const trigSwitcher = function () {
  if (isRunning) {
    trigToHighlight++;
    if (trigToHighlight > numberOfSteps) trigToHighlight = 1;
  }
};

const trigHighlighter = function (trig) {
  if (isRunning) {
    const trigPressed = document.getElementById(`trig${trig}`);

    if (!trigPressed.classList.contains("trigselected")) {
      trigPressed.classList.add("trigselected");
    } else trigPressed.classList.remove("trigselected");
  }
};

const playSelectedSound = function () {
  if (isRunning) {
    triggers.forEach(function (trig, i) {
      if (trigToHighlight === i + 1) {
        trig.forEach((value, index) => {
          if (value === 1) {
            playSoundOnClick(soundMappings[index]);
          }
        });
      }
    });
  }
};

const removePlayButtonAnim = function () {
  playButton.classList.remove("pressanim");
};

const removeClearButtonAnim = function () {
  clearButton.classList.remove("pressanim");
};

const removeClearButtonPressed = function () {
  clearButton.classList.remove("pressed");
};

const nextStep = () => {
  trigSwitcher();
  trigHighlighter(trigToHighlight);
  playSelectedSound();
};

// const beatMachine = function (tempo) {
//   let interval = 15000 / tempo;
//   setTimeout(function doSomething() {
//     nextStep();
//     setTimeout(doSomething, interval);
//   }, 1000);
// };

const intervalSetter = function (tempo, callback) {
  console.log(tempo);
  let interval = 15000 / tempo;
  intervalId = setInterval(callback, interval, true);
  return intervalId;
};

const startApp = () => {
  if (firstPlayCheck < 1) {
    selectKeyOnStart(68);
    firstPlayCheck++;
  }
  clearInterval(intervalId);
  nextStep();
  intervalSetter(tempo, nextStep);
  // beatMachine(tempo);
};

const stopApp = () => {
  removeTrigSelected();
};

trigs.forEach((trig) => {
  trig.addEventListener("click", trigPressed);
  trig.addEventListener("transitionend", removeTrigAnimation);
  trig.addEventListener("transitionend", removeTrigCycleAnimation);
});

keys.forEach((key) => {
  key.addEventListener("transitionend", removeKeyTransition);
  key.addEventListener("click", soundPressed);
  key.addEventListener("click", selectKey);
});

playButton.addEventListener("click", pressPlay);
playButton.addEventListener("transitionend", removePlayButtonAnim);

clearButton.addEventListener("click", pressClear);
clearButton.addEventListener("transitionend", removeClearButtonAnim);
clearButton.addEventListener("transitionend", removeClearButtonPressed);

plusButton.addEventListener("click", plusTempo);
minusButton.addEventListener("click", minusTempo);
