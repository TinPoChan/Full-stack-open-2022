import { useState, useEffect } from 'react'
import phonebook from './services/phonebook'
import './index.css'

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      filter shown with: <input value={filter} onChange={handleFilterChange} />
    </div>
  )
}

const PersonForm = ({ addName, newName, newNumber, handleNameChange, handleNumberChange }) => {
  return (
    <form onSubmit={addName}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ namesToShow, deletePerson }) => {
  return (
    <div>
      <ul>
        {namesToShow.map(person =>
          <li key={person.name}>{person.name} {person.number} <button onClick={()=> deletePerson(person)}> Delete </button></li>
        )}
      </ul>
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])

  useEffect(() => {
    phonebook
      .getAll()
      .then(response => {
        setPersons(response)
      })
  }, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState('')

  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    }

    if (persons.some(person => person.name === nameObject.name)) {
      if (window.confirm(`${nameObject.name} is already added to phonebook, replace the old number with a new one?`)) {
        phonebook
          .update(persons.find(person => person.name === nameObject.name).id, nameObject)
          .then(response => {
            setPersons(persons.map(person => person.id === response.id ? response : person))
          })
          .then(() => {
            setMessage(`Changed ${nameObject.name}'s number`)
            setTimeout(() => {
              setMessage('')
            }, 5000)
          })
          .catch(() => {
            setMessage(`Information of ${nameObject.name} has already been removed from server`)
            setTimeout(() => {
              setMessage('')
            } , 5000)
          })
      }
    } else {
      phonebook
      .create(nameObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
      .then(() => {
        setMessage(`Added ${nameObject.name}`)
        setTimeout(() => {
          setMessage('')
        }, 5000)
      })
    }
  }

  const deletePerson = (person) => {
    if(window.confirm("Do you really want to delete " + person.name)) {
      phonebook.remove(person.id)
      .then(() => {
        setMessage(`Deleted ${person.name}`)
        setTimeout(() => {
          setMessage('')
        }, 5000)
      })
    }
  }
  

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const namesToShow = () => { 
    if (filter === '') {
      return persons
    } else {
      return persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    }
  }

  const Notification = ({ message }) => {
    if(message === '') {
      return (
        <div></div>
      )
    } else if (message.includes('Added')) {
      return (
        <div className="success">
          {message}
        </div>
      )
    } else {
      return (
        <div className="error">
          {message}
        </div>
      )
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} />

      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      
      <h2>Add a new</h2>

      <PersonForm addName={addName} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />

      <h2>Numbers</h2>

      <Persons namesToShow={namesToShow()} deletePerson={deletePerson} />
    </div>
  )
}

export default App