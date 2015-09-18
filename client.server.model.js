'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ClientSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	secret: String,
	extIP: String,
	lastLogin: {
		type: Date,
		default: Date.now
	},
});

mongoose.model('Client', ClientSchema);

