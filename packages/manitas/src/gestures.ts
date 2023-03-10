//import { continueStroke, startStroke } from "./brush";
import vision from "@mediapipe/tasks-vision";

const { GestureRecognizer, FilesetResolver } = vision;

// TODO: configure if left or right handed
// Configure GPU
// Size of video
// Configure this?
const GESTURE_THRESHOLD = 0.6;
const HANDEDNESS_THRESHOLD = 0.8;
const ACTIVE_THRESHOLD = -0.1;

const videoHeight = "720px";
const videoWidth = "960px";

// Before we can use GestureRecognizer class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
async function load() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task",
      // TODO: Make configurable
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numHands: 2,
  });

  return gestureRecognizer;
}

// Check if webcam access is supported.
function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

export async function init() {
  const gestureRecognizer: vision.GestureRecognizer = await load();
  const { video } = setupElements();
  if (!video) {
    // TODO: Actually create
    console.warn("Unable to create auxiliary elements");
    return;
  }
  const userMedia = checkUserMedia();
  if (!userMedia) {
    console.warn("getUserMedia() is not supported by your browser");
    return;
  }
  getUserMedia(video, () => run(video, gestureRecognizer));
}

function run(
  video: HTMLVideoElement,
  gestureRecognizer: vision.GestureRecognizer
) {
  video.style.height = videoHeight;
  video.style.width = videoWidth;
  runContinously(video, gestureRecognizer);
}

type HandState = HandStateActive | HandStateInactive;
interface Point3D {
  x: number;
  y: number;
  z: number;
}
interface HandStateInactive {
  gesture: string | null;
  active: false;
}
interface HandStateActive {
  gesture: string | null;
  active: true;
  position: Point3D;
}
interface State {
  leftHand: HandState | null;
  rightHand: HandState | null;
}

function runContinously(
  video: HTMLVideoElement,
  gestureRecognizer: vision.GestureRecognizer
) {
  let state: State = {
    leftHand: {
      active: false,
      gesture: null,
    },
    rightHand: {
      active: false,
      gesture: null,
    },
  };
  function go() {
    let nowInMs = Date.now();
    const results = gestureRecognizer.recognizeForVideo(video, nowInMs);

    const { gestures, landmarks, worldLandmarks, handednesses } = results;
    let rightHand: HandState | null = null;
    let leftHand: HandState | null = null;
    handednesses.forEach((hand, idx) => {
      const category: vision.Category = hand[0];
      if (category.score > HANDEDNESS_THRESHOLD) {
        if (category.categoryName === "Right") {
          rightHand = assembleHandEstimation(gestures[idx], landmarks[idx]);
        }
        if (category.categoryName === "Left") {
          leftHand = assembleHandEstimation(gestures[idx], landmarks[idx]);
        }
      }
    });
    const newState: State = {
      rightHand,
      leftHand,
    };
    compareStatesAndEmitEvents(state, newState);
    state = newState;

    window.requestAnimationFrame(go);
  }
  go();
}

function compareStatesAndEmitEvents(prevState: State, nextState: State) {
  emitGestures(prevState.leftHand, nextState.leftHand, "left");
  emitGestures(prevState.rightHand, nextState.rightHand, "right");
  emitAirfingers(prevState.leftHand, nextState.leftHand, "left");
  emitAirfingers(prevState.rightHand, nextState.rightHand, "right");
  //console.log(prevState.leftHand?.gesture, nextState.leftHand?.gesture);
}

type Hand = "left" | "right";

function emitGestures(
  prevState: HandState | null,
  nextState: HandState | null,
  hand: Hand
) {
  if ((!prevState || !prevState.gesture) && nextState && nextState.gesture) {
    const event = new CustomEvent("gesturestart", {
      detail: { gesture: nextState.gesture, hand },
    });
    document.dispatchEvent(event);
  }
  if ((!nextState || !nextState.gesture) && prevState && prevState.gesture) {
    const event = new CustomEvent("gestureend", {
      detail: { gesture: prevState.gesture, hand },
    });
    document.dispatchEvent(event);
  }
}

function emitAirfingers(
  prevState: HandState | null,
  nextState: HandState | null,
  hand: Hand
) {
  if ((!prevState || !prevState.active) && nextState && nextState.active) {
    const event = new CustomEvent("airfingerstart", {
      detail: { airpoint: nextState.position, hand },
    });
    document.dispatchEvent(event);
  } else if (
    (!nextState || !nextState.active) &&
    prevState &&
    prevState.active
  ) {
    const event = new CustomEvent("airfingerend", {
      detail: { airpoint: prevState.position, hand },
    });
    document.dispatchEvent(event);
  } else if (prevState && prevState.active && nextState && nextState.active) {
    const event = new CustomEvent("airfingermove", {
      detail: { airpoint: prevState.position, hand },
    });
    document.dispatchEvent(event);
  }
}

function assembleHandEstimation(
  gestureCategory: vision.Category[],
  landmarks: vision.NormalizedLandmark[]
): HandState {
  const gesture = bestGesture(gestureCategory);
  const active = isActive(landmarks);
  return {
    gesture,
    active,
    position: landmarks[8],
  };
}

function isActive(landmark: vision.NormalizedLandmark[]) {
  const indexFinger = landmark[8];
  return indexFinger.z < ACTIVE_THRESHOLD;
}

function bestGesture(category: vision.Category[]) {
  for (let i = 0; i < category.length; i++) {
    const gesture = category[i];
    if (gesture.score > GESTURE_THRESHOLD && gesture.categoryName !== "None") {
      return gesture.categoryName;
    }
  }

  return null;
}

function getUserMedia(video: HTMLVideoElement, onSuccess: () => void) {
  const constraints = {
    video: true,
  };

  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream;
    video.addEventListener("loadeddata", onSuccess);
  });
}

function setupElements() {
  const video = document.getElementById("webcam") as HTMLVideoElement;
  return { video };
}

function checkUserMedia() {
  return hasGetUserMedia();
}
