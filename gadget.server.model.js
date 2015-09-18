'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// A gadget is a specific device that can be controlled by a specific zMote
//  It may get its keys from the curated "Remote" collection, or
//  the "UserRemote" (when the user creates a custom remote or modifies one
//  from the standard collection)
var GadgetSchema = new Schema({
	name: String,
	created: {
		type: Date,
		default: Date.now
	},
	createdBy: {
		type: Schema.ObjectId,
		ref: 'Client'
	},
	remote: {
		type: Schema.ObjectId,
		ref: 'Remote'
	},
	userRemote: {
		type: Schema.ObjectId,
		ref: 'UserRemote'
	}, 
	widget: {
		type: Schema.ObjectId,
		ref: 'Widget'
	}
});

mongoose.model('Gadget', GadgetSchema);
