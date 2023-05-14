const mongoose = require('mongoose')

const SnippetSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    createdOn: {
        type: String,
        required: true
    },
    updatedOn: {
        type: String,
        required: true
    },
    lang: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        required: true
    }
})

const SnippetModel = mongoose.model("snippets", SnippetSchema)
module.exports = SnippetModel