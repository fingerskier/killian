import { useState } from 'react';
import FSM from './ux/FSM';
import useLocalStorage from './hook/useLocalStorage';
import useInterval from './hook/useInterval';
import Webcam from './ux/Webcam';


export default function App() {
  const [state, setState] = useLocalStorage('test', 'value')

  const [count, setCount] = useState(0)
  const [camFlip, setCamFlip] = useState(false)


  const cancelCounter = useInterval(()=>{
    setCount(count+1)
  }, 1234)


  return <>
    <p>
      <em>Killian</em> is a test-bed for hooks and components that I need/like/want in my projects.
    </p>


    <h2> useLocalStorage </h2>
    <label>
      Change the value and refresh the page
      <input 
        onChange={E=>setState(E.target.value)}
        value={state}
        type="text" 
      />
    </label>


    <h2> useInterval </h2>
    <p>
      A perpetual timer that snuggles with React.  This one updates a counter every 1,234ms.
      <br />
      Count: {count}
      <br />
      <button onClick={E=>cancelCounter()}>Cancel Timer</button>
    </p>


    <h2>State-Machine</h2>
    <p>
      <FSM />
    </p>


    <h2> WebCam / useWebcam</h2>
    <label>
      Flip horizontal?
      <input
        onChange={E=>setCamFlip(!camFlip)}
        type="checkbox"
        value={camFlip}
      />
    </label>
    <Webcam 
      flipHorizontal={camFlip}
    />
  </> 
}