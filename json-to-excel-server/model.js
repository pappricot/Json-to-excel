'use strict';
const mongoose = require('mongoose');

const SearchTermSchema = mongoose.Schema({
    title: {
		type: String,
		required: true
    },
    link: {
		type: String,
		required: true
    },
    date: {
		type: String,
		required: true
	},
})

SearchTermSchema.methods.serialize = function() {
    return {
      title: this.title || '',
      link: this.link || '',
      data: this.data || ''
    };
  };
  
  
  const SearchTerm = mongoose.model('SearchTerm', SearchTermSchema);
  
  module.exports = {SearchTerm};