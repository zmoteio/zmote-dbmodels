'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var CommandSchema = new Schema({
	created: {
		type: Date,
		expires: '5m',
		default: Date.now
	},
	widget: {
		type: Schema.ObjectId,
		ref: 'Widget'
	},
	status: {
		type: String,
		enum: ['pending', 'completed'],
		default: "pending"
	},
	response: String
});

mongoose.model('Command', CommandSchema);

