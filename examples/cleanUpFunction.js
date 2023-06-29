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
