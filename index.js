const express = require('express')
const morgan = require('morgan')


const app = express()
app.use(express.json())

const cors = require('cors')

app.use(cors())

// app.use(morgan('tiny'))

morgan.token('mytoken', (req, res) => {
  if(req.method === 'POST'){
    return JSON.stringify(req.body)
  }
  return ' '
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :mytoken'))



let persons = [
    { 
      "name": "Arto Hellas", 
      "number": "040-123456",
      "id": 1
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": 2
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": 3
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": 4
    }
  ]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})


app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/info', (req, res) => {
    let d = new Date();
    res.send(`Phonebook has info for ${persons.length} people

    ${d}`)
})

app.get('/api/persons/:id', (req, res)=> {
    const id = Number(req.params.id);
    console.log(req.params);
    const person = persons.find(person => person.id === id)

    person? res.json(person): res.status(404).end()
    
})

app.delete('/api/persons/:id', (req, res) => {
    console.log("deleting");
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== p)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const maxId = persons.length > 0? Math.max(...persons.map(p => p.id)): 0
    const person = req.body
    person.id = maxId +1
    // console.log(person);
    // console.log(person.id);

    checkName = (name) => {
        return persons.find(e => e.name === name)
    }

    if(!person.name || !person.number){
        return res.status(400).json(
            {
                error: 'missing data'
            }
        )
    }

    if (checkName(person.name)) {
        return res.status(400).json({ 
          error: 'name must be unique'
        })
      }

    persons = persons.concat(person)
    res.json(person)
})

// const PORT = 3001
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })

//morgan impl
// const PORT = 3001
// app.listen(3001, () => {
//   console.log(`Server running on port ${PORT}`);
// });
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})