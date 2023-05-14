const express = require('express')
const { ObjectId } = require('mongodb')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
require('dotenv').config()

const SnippetModel = require('./model')

app.use(express.json())
app.use(cors())

const connection = process.env.DB_CONNECTION
const PORT = process.env.PORT || 3001

const newSnippet = process.env.NEW_SNIPPET
const updateSnippet = process.env.UPDATE_SNIPPET
const deleteSnippet = process.env.DELETE_SNIPPET

mongoose.connect(connection, {
    useNewUrlParser: true
})

const authLogin = (password) => {
    return (req, res, next) => {
        const input = req.body.input
        if (input === password) {
            next()
        } 
    }
}

app.get('/', (req, res) => {
    SnippetModel.find().then(result => res.send(result)).catch(err => console.log(err))
})

app.get('/latest', (req, res) => {
    SnippetModel.find().then(result => {res.send(result[result.length - 1])}).catch(err => console.log(err))
})

app.post('/login', authLogin("Dsadepot"), (req, res) => {
    res.send({ newSnippet, updateSnippet, deleteSnippet })
})

app.post(`/${newSnippet}`, async (req, res) => {
    try {
        const snippet = await SnippetModel.create(req.body)
        res.status(200).json(snippet)
    } catch(error) {
        res.status(500).json({message: error.message})
    }
})

app.put(`/${updateSnippet}/:id`, async (req, res) => {
    try {
        const { id } = req.params
        const snippet = await SnippetModel.findByIdAndUpdate(id, req.body)
        res.status(200).json(snippet)
    } catch(error) {
        res.status(500).json({message: error.message})
    }
})

app.delete(`/${deleteSnippet}/:id`, (req, res) => {
        SnippetModel.deleteOne({_id: new ObjectId(req.params.id)})
        .then(res => res.status(200).json(res)) 
        .catch(err => res.status(500))
})

app.listen(3001, () => {
    console.log(`Server is running on port ${PORT}`)
})