import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { useImmer } from 'use-immer'
import './styles.css'
import { compare } from 'fast-json-patch'
import { encode, decode } from '@msgpack/msgpack'

const emitChangeOverWs = (data) => {
  if (!data) return
  data = encode(data)
  console.log(JSON.stringify(decode(data)))
}

const App = () => {
  const [person, updatePerson] = useImmer({
    name: 'Name',
    age: 33
  })

  const [diff, updateDiff] = useImmer()

  const setName = (ev) => {
    updatePerson((p) => {
      p.name = ev.target.value
      updateDiff(compare(person, p))
    })
  }

  const addAge = () => {
    updatePerson((p) => {
      p.age++
      updateDiff(compare(person, p))
    })
  }

  useEffect(() => emitChangeOverWs(diff))

  return (
    <div className="App">
      <h1>
        Hello {person.name} ({person.age})
      </h1>
      <input onChange={setName} value={person.name} />
      <br />
      <button onClick={addAge}>Older</button>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
