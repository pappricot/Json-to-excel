'use strict';
const mongoose = require('mongoose');

const SearchResultsSchema = mongoose.Schema({
  searchTerm: {
    type: String,
    required: true
  },
  results: [{
    title: {
      type: String,
      required: true,
      default: 'No title'
      },
    link: {
      type: String,
      required: true
      },
    date: {
      type: String
      },
    summary: {
      type: String
    }
 }]
}, {
  timestamps: true
})

SearchResultsSchema.methods.serialize = function() {
    return {
      title: this.title || '',
      link: this.link || '',
      data: this.data || '',
      summary: this.summary || ''
    };
  };
  
  
  const SearchResults = mongoose.model('SearchResults', SearchResultsSchema);
  
  module.exports = {SearchResults};