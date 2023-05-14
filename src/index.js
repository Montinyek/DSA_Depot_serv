const express = require('express')
const { ObjectId } = require('mongodb')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()

const SnippetModel = require('./model')

app.use(express.json())
app.use(cors())

require('dotenv').config();

const newSnippet = process.env.REACT_APP_NEW_SNIPPET
const updateSnippet = process.env.REACT_APP_UPDATE_SNIPPET
const deleteSnippet = process.env.REACT_APP_DELETE_SNIPPET

mongoose.connect("mongodb+srv://user371:mongodb371@cluster0.l849qe3.mongodb.net/dsa_depot?retryWrites=true&w=majority", {
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
    SnippetModel.find().then(result => {console.log(result[result.length - 1]); res.send(result[result.length - 1])}).catch(err => console.log(err))
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
    console.log("Server is running")
})