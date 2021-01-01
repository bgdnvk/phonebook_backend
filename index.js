require('dotenv').config()
const express = require('express')
const morgan = require('morgan')

const Person = require('./models/person')




const app = express()
app.use(express.json())
//adding build
app.use(express.static('build'))

const cors = require('cors')

app.use(cors())

morgan.token('mytoken', (req, res) => {
  if(req.method === 'POST'){
    return JSON.stringify(req.body)
  }
  return ' '
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :mytoken'))


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})


app.get('/api/persons', (request, response) => {
  Person.find({}).then(p => {
    response.json(p)
  })
})

app.get('/api/info', (req, res) => {
  Person.find({}).then(persons => {
    // console.log(persons);
    // console.log('first p',persons[0]);
    res.send(`Phonebook has info for ${persons.length} people <br /> ${Date()}`)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
    // const id = Number(req.params.id);
    const id = req.params.id
    Person.findById(id)
      .then(person => {
        if (person) {
          res.json(person)
        } else {
          res.status(404).end()
        }
      })
      .catch(e => next(e))
})

app.delete('/api/persons/:id', (req, res, next) => {
    // const id = Number(req.params.id)
    const id = req.params.id
    console.log(id);
    Person.findByIdAndRemove(id)
      .then(result => {
        console.log('deleting', result);
        res.status(204).end()
      })
      .catch(e => next(e))


})

app.post('/api/persons', (req, res, next) => {
    const body = req.body
    // if(!body.name || !body.number){
    //     return res.status(400).json(
    //         {
    //             error: 'missing data'
    //         }
    //     )
    // }
    if (body.name === undefined) {
      return res.status(400).json({
        error: 'name missing'
      })
    }
  
    if (body.number === undefined) {
      return res.status(400).json({
        error: 'number missing'
      })
    }

    const person = new Person({
      name: body.name,
      number: body.number
    })
    //promise chain clearing
    // person.save()
    //   .then(savedP => {
    //   res.json(savedP)
    // })
    //   .catch(e => next(e))
    person
    .save()
    .then( savedP => savedP.toJSON())
    .then( savedAndFormattedP => {
      res.json(savedAndFormattedP)
    })
    .catch(e => next(e))


})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })  
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})