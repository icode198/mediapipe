<div align="center">
<h1> ☝️☝️ <br/>
Manitas</h1>
Move your fingers in the air to interact with the web
</div>
<br/><br/><br/>

Hi 👋!

This is a (typescript/javascript) library that uses AI ([Google's Mediapipe](https://developers.google.com/mediapipe/solutions/vision/gesture_recognizer)) to recognize
the position of fingers recorded from a webcam and emits HTML events similar to mouse or touch events (mousedown, mousemove, touchstart, touchmove, ...),
so we can use our fingers to interact with the web.

<div align="center">
<video src="https://user-images.githubusercontent.com/154258/224558658-852015d9-ce86-4663-8c4a-f76588997151.mp4"></video>
</div>

# Getting started

```
npm install manitas
```

```js
import { init } from "manitas";


// In some async function
await init();

// Or as a promise
init().then(...)
```

And then you can listen to these events:
```js
document.addEventListener('gesturestart', listener);
document.addEventListener('gesturemove', listener);
document.addEventListener('gestureend', listener);
document.addEventListener('airfingerstart', listener);
document.addEventListener('airfingermove', listener);
document.addEventListener('airfingerend', listener);
```

### Examples

Check out the [examples](examples/) folder:

* [ui-react](examples/ui-react): Usage in React to select items, drag them around and trigger actions with gestures. [See it live](http://manitas-react.limenius.com).
* airpaint (coming soon).


## Events

There are two main classes of events:

### Airfingers

`airfingerstart`, `airfingermove`, `airfingerend`: These are meant to work like ontouchstart, ontouchmove and ontouchend (or mouse events). From Mediapipe we get an estimation of the position of the fingers in space, but we need something like a "click" to select, move, drag, paint...

So we have defined an "airfinger" as an event that happens **when the tip of the index finger is closer to the camera than the wrist**. This makes "touch" actions quite intuitive after a little practice.

See this image: the one in the left qualifies as airfinger and will trigger events when it starts, moves and ends, an the right one won't (so you can move freely without triggering events, as *hovering*).

![hands](https://user-images.githubusercontent.com/154258/224560435-988c4649-9ec6-46f2-90a9-57ba58871595.png)


These events contain this data:

```typescript
export interface AirfingerEventParams {
  airpoint: Point3D; // x, y, z (normalized 0..1 position of the index finger)
  hand: Hand;        // Left or right
}
```


### Gestures

When a gesture is recognized, we send these events: `gesturestart`, `gesturemove`, `gestureend`. Mediapipe can recognize  seven gestures 👍, 👎, ✌️, ☝️, ✊, 👋, 🤟 with the default training model:

* Closed fist (`Closed_Fist`)
* Open palm (`Open_Palm`)
* Pointing up (`Pointing_Up`)
* Thumbs down (`Thumb_Down`)
* Thumbs up (`Thumb_Up`)
* Victory (`Victory`)
* Love (`ILoveYou`)

These events contain this data:


```typescript
export interface GestureEventParams {
  gesture: string;    // Name of the gesture 
  hand: Hand;         // Left or right
  airpoint: Point3D;  // x, y, z (normalized 0..1 position of the index finger)
}
```

*Note: It is possible to train mediapipe to recognize more gestures, but this library does not have support for custom gestures yet.*
