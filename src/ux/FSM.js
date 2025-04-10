import {useEffect, useRef, useState} from 'react'
import useStateMachine from '../hook/useStateMachine'
import useInterval from '../hook/useInterval'


export default function FSM() {
  const count = useRef(0)
  const [state, setState] = useState('')
  const FSM = useStateMachine('test', true)


  useEffect(()=>{
    FSM.addState('idle', {
      onEnter:()=>setState('idle')
    })

    FSM.addState('running', {
      onEnter:()=>{
        setState('running')
      },
      onUpdate:()=>{
        count.current++
      },
      onExit:()=>{
      },
    })

    FSM.addState('paused', {
      onEnter:()=>{
        setState('paused')
      }
    })

    FSM.addState('stopped', {
      onEnter:()=>{
        count.current = 0
        setState('stopped')
      },
      onUpdate:()=>{
        FSM.goto('idle')
      },
    })

    FSM.addTransition('idle','running')
    FSM.addTransition('running','paused')
    FSM.addTransition('paused','running')
    FSM.addTransition('paused','stopped')
    FSM.addTransition('running','stopped')
    FSM.addTransition('stopped','idle')

    FSM.setState('idle')
  },[])

  useInterval(()=>{
    if (FSM) FSM.update(1000)
  }, 1000)

  return <>
    <span>State: {state} {count.current}</span>
    <br />

    <button
      disabled={!FSM.available('idle')}
      onClick={E=>FSM.goto('idle')}
    >Idle</button>
    
    <button
      onClick={E=>FSM.goto('running')}
      disabled={!FSM.available('running')}
    >Run</button>
    
    <button
      onClick={E=>FSM.goto('paused')}
      disabled={!FSM.available('paused')}
    >Pause</button>
    
    <button
      onClick={E=>FSM.goto('stopped')}
      disabled={!FSM.available('stopped')}
    >Stop</button>
  </>
}
