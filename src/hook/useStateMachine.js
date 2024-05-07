import {useEffect, useRef, useState} from 'react'


export default function useStateMachine(ID) {
  const state = useRef({name:'void'})
  const [states, setStates] = useState({})
  const [transitions, setTransitions] = useState([])
  
  const queue = []
  let changingState


  const addState = (name='unk', config={})=>{
    states[name] = config
    states[name].name = name
    setStates({...states})
    console.log('STATES', states)
  }


  const addTransition = (from,to)=>{
    transitions.push({from,to})
    setTransitions([...transitions])
  }


  const goto = desiredState=>{
    console.log('GOTO', desiredState, state.current)
    const transition = (state.current.name === 'void') 
    || 
    (state.current.name === desiredState)
    ||
    transitions.find(t=>{
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
    
    console.log(`FSM<${ID}>: Transitioning from ${state.current?.name} to ${name}.`)
    
    if (state.current?.onExit) state.current.onExit()
    
    state.current = states[name]
    console.log('setstate', name, states[name])
    
    if (state.current?.onEnter) state.current.onEnter()
    
    changingState = false
  }


  const update = dt=>{
    if (queue.length) setState(queue.shift())
    
    if (state.current?.onUpdate) state.current.onUpdate(dt)
  }


  useEffect(() => {
    console.log('STATE', state.current)
  }, [state.current])
  


  return {
    addState,
    addTransition,
    goto,
    setState,
    update,
  }
}
