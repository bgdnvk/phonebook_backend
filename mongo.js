const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
//mongodb+srv://fullstack:<password>@cluster0.n98wd.mongodb.net/<dbname>?retryWrites=true&w=majority
// const url =
//   `mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/test?retryWrites=true`
const dbname = 'contacts'
const url =
    `mongodb+srv://fullstack:${password}@cluster0.n98wd.mongodb.net/${dbname}?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// const person = new Person({
//   name: 'Maria - THE PASTA NERD',
//   number: '111-111-111',
//   id: 2,
// })


//get all people with only psw
if (process.argv.length === 3) {
    console.log("phonebook: ");
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })
  }

if (process.argv.length > 3) {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number,
      })

    person.save().then(result => {
        console.log(result);
    //   console.log('person saved!')
      console.log(`added ${name} number ${number} to phonebook`);
      mongoose.connection.close()
    })

  }



// person.save().then(result => {
//     console.log(result);
//   console.log('person saved!')
//   mongoose.connection.close()
// })