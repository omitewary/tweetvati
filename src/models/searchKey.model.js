const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SearchKeySchema = new Schema({
    searchedTerm: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = SearchKey = mongoose.model('searchKeySchema', SearchKeySchema);