import type { GestureEvent, Hand, HandState, Point3D } from "./types";

export function emitGestures(
  prevState: HandState | null,
  nextState: HandState | null,
  hand: Hand
) {
  if ((!prevState || !prevState.gesture) && nextState && nextState.gesture) {
    const event = new CustomEvent<GestureEvent>("gesturestart", {
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

export function emitAirfingers(
  prevState: HandState | null,
  nextState: HandState | null,
  hand: Hand
) {
  if ((!prevState || !prevState.active) && nextState && nextState.active) {
    const event = new CustomEvent("airfingerstart", {
      detail: { airpoint: flipX(nextState.position), hand },
    });
    document.dispatchEvent(event);
  } else if (
    (!nextState || !nextState.active) &&
    prevState &&
    prevState.active
  ) {
    const event = new CustomEvent("airfingerend", {
      detail: { airpoint: flipX(prevState.position), hand },
    });
    document.dispatchEvent(event);
  } else if (prevState && prevState.active && nextState && nextState.active) {
    const event = new CustomEvent("airfingermove", {
      detail: { airpoint: flipX(prevState.position), hand },
    });
    document.dispatchEvent(event);
  }
}

function flipX(p: Point3D) {
  return { ...p, x: 1 - p.x };
}