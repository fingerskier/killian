import {useEffect, useRef, useState} from 'react'


export default function useStateMachine(ID, verbose=false) {
  const state = useRef({name:'void'})
  const [states, setStates] = useState({})
  const [transitions, setTransitions] = useState([])
  
  const queue = []
  let changingState


  const addState = (name='unk', config={})=>{
    states[name] = config
    states[name].name = name
    setStates({...states})
    if (verbose) console.log(`FSM<${ID}>: Added state ${name}.`, config)
  }


  const addTransition = (from,to)=>{
    transitions.push({from,to})
    setTransitions([...transitions])
  }


  // the `available` function returns true if there is a valid transition from the current state to the desired state
  const available = desiredState=>{
    return (state.current.name === 'void') 
      || transitions.find(t=>t.from === state.current.name && t.to === desiredState)
  }


  const goto = desiredState=>{
    if (verbose) console.log(`FSM<ID>:GOTO`, desiredState, 'FROM', state.current)

    /* the transition is valid only if we are:
       * transitioning from the void state
       * using a registered transition
    */
    const transition = (state.current.name === 'void') 
      || transitions.find(t=>{
        return t.from === state.current.name && t.to === desiredState
      })
    
    if (transition) {
      setState(desiredState)
    } else {
      console.error(`FSM<${ID}>: Transition from ${state.current.name} to ${desiredState} not registered.`)
    }
  }


  const setState = name=>{
    if (!states[name]) {
      console.error(`FSM<${ID}>: State ${name} not registered.`)
      return
    }
    
    if (changingState) return queue.push(name)
    
    changingState = true
    
    if (state.current?.onExit) state.current.onExit()
    if (verbose) console.log(`FSM<${ID}>: Exiting state ${state.current.name}.`)
    
    state.current = states[name]
    if (verbose) console.log(`FSM<${ID}>: Set state to ${name}.`)
    
    if (state.current?.onEnter) state.current.onEnter()
    
    changingState = false
  }


  const update = dt=>{
    if (queue.length) setState(queue.shift())
    
    if (state.current?.onUpdate) state.current.onUpdate(dt)
  }


  return {
    addState,
    addTransition,
    available,
    goto,
    setState,
    update,
  }
}
