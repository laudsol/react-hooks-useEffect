import React, { useState, useEffect } from 'react';

const TimerComponent = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <h1>Timer: {count}</h1>
    </div>
  );
};

const App = () => {
  const [showTimer, setShowTimer] = useState(true);

  const toggleTimer = () => {
    setShowTimer(!showTimer);
  };

  return (
    <div>
      <button onClick={toggleTimer}>
        {showTimer ? 'Unmount Timer' : 'Mount Timer'}
      </button>
      {showTimer && <TimerComponent />}
    </div>
  );
};

export default App;


/*

In this example, the `TimerComponent` is rendered conditionally within the `App` component based on the `showTimer` state variable. Clicking the "Unmount Timer" button will toggle the `showTimer` state, causing the `TimerComponent` to unmount.

When you run the application and click the "Unmount Timer" button, the `TimerComponent` will be unmounted, but the interval will continue running. You can verify this by observing that the timer in the `TimerComponent` keeps incrementing, even though the component is no longer rendered.

By mounting and unmounting the `TimerComponent` in this manner, you can observe firsthand that the interval function persists even after the component is unmounted.
*/
