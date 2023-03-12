export function Instructions() {
  return (
    <div>
      <h2>Usage</h2>
      <h3>Selecting/Moving</h3>
      <p>
        We can use AI (
        <a href="https://developers.google.com/mediapipe/solutions/vision/gesture_recognizer">
          Google's Mediapipe
        </a>
        ) to recognize the position of our hands, but ¿what is the equivalent of
        "click" in this context?
      </p>
      <p>
        You can select videos by advancing your index relative to your wrist.
        So, in the following image, the left one is an event, and the right one
        is not.
      </p>
      <p>
        <center>
          <img
            src="https://user-images.githubusercontent.com/154258/224560435-988c4649-9ec6-46f2-90a9-57ba58871595.png"
            alt="hands"
            width={600}
          />
        </center>
      </p>
      <h3>Gestures</h3>
      <p>You can use some gestures:</p>
      <ul>
        <li>🤟: To play/stop last selected video.</li>
        <li>✋: To zoom in/out.</li>
        <li>👍: Throw last selected video far away above the window.</li>
        <li>👎: Throw last selected video far away below the window.</li>
        <li>👎: Throw last selected video far away below the window.</li>
        <li>✌️: Confetti!</li>
      </ul>
      <h2>Code</h2>
      This is an example of usage of manitas.
      <a href="https://github.com/nacmartin/manitas">See the code</a>
    </div>
  );
}
