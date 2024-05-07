import {useEffect, useState} from 'react'
import useStateMachine from '../hook/useStateMachine'


export default function FSM() {
  const [count, setCount] = useState(0)
  const [state, setState] = useState('')
  const FSM = useStateMachine('test')

  let T


  useEffect(()=>{
    FSM.addState('idle', {
      onEnter:()=>setState('idle')
    })

    FSM.addState('running', {
      onEnter:()=>setState('running'),
      onUpdate:()=>{
        T = setInterval(()=>{
          setCount(count+1)
        }, 100)
      },
      onExit:()=>{
        clearInterval(T)
      },
    })

    FSM.addState('paused', {
      onEnter:()=>setState('paused')
    })

    FSM.addState('stopped', {
      onEnter:()=>setState('stopped')
    })

    FSM.addTransition('idle','running')
    FSM.addTransition('running','paused')
    FSM.addTransition('paused','running')
    FSM.addTransition('running','stopped')
    FSM.addTransition('stopped','idle')

    FSM.setState('idle')
  },[])

  return <>
    <div>State: {state}</div>

    <button onClick={E=>FSM.goto('idle')}>Idle</button>
    
    <button onClick={E=>FSM.goto('running')}>Run {count}</button>

    <button onClick={E=>FSM.goto('paused')}>Pause</button>
    
    <button onClick={E=>FSM.goto('stopped')}>Stop</button>
  </>
}
