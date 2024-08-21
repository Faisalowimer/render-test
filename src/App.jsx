import { useState, useEffect } from 'react'
import Note from "./components/Note.jsx"
import Notification from './components/Notification.jsx'
import Footer from './components/Footer.jsx'
import noteService from "./services/noteService.js"

const App = () => {
  const [notes, setNotes] = useState(null)
  const [newNote, setNewNote] = useState("a new note...")
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
    }, [])

    if (!notes) {
      return null
    }
    
    const addNote = (event) => {
      event.preventDefault()
      const noteObject = {
        content: newNote,
        important: Math.random() > 0.5
      }
  
      noteService
      .create(noteObject)
        .then(returnedNote => {
          setNotes(notes.concat(returnedNote))
          setNewNote("")
      })
    }

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = {...note, important: !note.important}

    noteService
    .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
    })
    .catch(error => {
      setErrorMessage(
        `the note "${note.content}" was already deleted from server`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setNotes(notes.filter(n => n.id !== id))
    })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
    console.log(event.target.value)
  }

  const NotesToShow = showAll
  ? notes
  : notes.filter(note => note.important)

  return (
    <>
      <h1>Notes</h1>
      <Notification  message={errorMessage}/>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {NotesToShow.map(note => 
            <Note 
              key={note.id} 
              note={note} 
              toggleImportance={() => toggleImportanceOf(note.id)}  
            />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input 
          value={newNote}
          onChange={handleNoteChange} 
        />
        <button type="submit" >Save</button>
      </form>
      <Footer />
    </>
  )

}

export default App