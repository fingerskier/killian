import {useEffect, useState} from 'react'


/**
 * This hook returns a Promise that resolves when `condition` is true.  It rejects if `timeoutSeconds` elapses.
 * @param {*} condition 
 * @param {*} timeoutSeconds 
 * @param {*} intervalMilliseconds 
 * @returns 
 */
export default function useWait(
  condition,
  timeoutSeconds=60,
  intervalMilliseconds=100,
) {
  const [done, setDone] = useState(false)
  const [timeout, setTimeout] = useState(false)
  
  let ticker


  const cancelSafety = useTimeout(() => {
    setTimeout(true)
  }, timeoutSeconds * 1000)


  useEffect(() => {
    return () => {
      cancelSafety()
      clearInterval(ticker)
    }
  }, [])
  
  useEffect(() => {
    if (condition) {
      setDone(true)
    }
  }, [condition])


  return new Promise((resolve, reject) => {
    ticker = setInterval(() => {
      if (done) {
        resolve()
      }

      if (timeout) {
        reject(new Error('Timeout'))
      }
    }, intervalMilliseconds)
  })
}