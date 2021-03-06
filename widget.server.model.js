'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// A widget is an individual zMote
//	- It has exactly one esp8266 with a unique chip ID
var WidgetSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	name: String,
	chipID: String,
	flashID: String, // Flash Chip ID
	mac: String,
	macAP: String,
	secret: String,
	version: String, // f/w version
	fs_version: String, // filesystem version

	// Connection details
	connected: Boolean,
	lastEvent: Date,
	localIP: String,
	extIP: String,

	// OTA related
	ota: Boolean,  // OTA is in progress
	ota_version: String, 
	ota_msg: String, // Store to resend for retries
	ota_retries: Number, // retry count goes to 10 before we stop trying

	clients: [{ // List of clients authorized to access this widget
		type: Schema.ObjectId,
		ref: 'Client'
	}],

	gadgets:[{
		type: Schema.ObjectId,
		ref: 'Gadget'
	}],
});
WidgetSchema.options.toJSON = {
        transform: function (doc, ret, options) {
                // remove the secret of every document before returning the result
                delete ret.secret;
        }
};
mongoose.model('Widget', WidgetSchema);
mongoose.model('DemoWidget', WidgetSchema);
