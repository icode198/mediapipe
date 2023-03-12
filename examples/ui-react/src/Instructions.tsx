export function Instructions() {
  return (
    <div style={{ width: 1280, margin: "0 auto", paddingBottom: 100 }}>
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
      <center>
        <p>
          <img
            src="https://user-images.githubusercontent.com/154258/224560435-988c4649-9ec6-46f2-90a9-57ba58871595.png"
            alt="hands"
            width={600}
          />
        </p>
      </center>
      <h3>Gestures</h3>
      <p>You can use some gestures:</p>
      <ul>
        <li>🤟: To play/stop last selected video.</li>
        <li>
          ✋: To zoom in/out (Incline palm forward/backward in an angle with the
          wrist).
        </li>
        <li>👍: Throw last selected video far away above the window.</li>
        <li>👎: Throw last selected video far away below the window.</li>
        <li>👎: Throw last selected video far away below the window.</li>
        <li>✌️: Confetti!</li>
      </ul>
      <h2>Code</h2>
      This is an example of usage of{" "}
      <a
        href="
https://github.com/nacmartin/manitas
      "
      >
        manitas
      </a>{" "}
      with React.{" "}
      <a href="https://github.com/nacmartin/manitas">See the code</a>
      <h2>Notes</h2>
      <p>
        We have configured mediapipe to use the GPU. It is possible to make it
        use the CPU. So if it doesn't work, that may be the reason.
      </p>
    </div>
  );
}
