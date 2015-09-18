'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// A remote is a curated remote controller with a set of defined keys and a default layout
var RemoteSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    confidence: { // Objective measure of how good this DB entry is
        type: Number,
        default: 0
    },
    score: { // Usage based core
        type: Number,
        default: 0
    },

    // Searchable fields
    brand: String,
    model: String,
    name: String,
    type: { // TV, VCR etc.
        type: String,
        default: "Unknown",
    },

    keys: [{
        key: String,
        name: String,
        icon: String,
        color: String,
        confidence: { // Objective measure of how good this key is
            type: Number,
            default: 0
        },
        spec: { // information obtained from decodeir
            protocol: String,
            device: Number,
            subdevice: Number,
            obc: Number,
            misc: String
        },
        code: {
            period: Number, // 1/2 peirod in Q16 based on modulation frequency
            n: Number,
            repeat: [Number],
            seq: [Number]
        },
        tcode: { // Same code with toggle bit set
            period: Number,
            n: Number,
            repeat: [Number],
            seq: [Number]
        },
    }],

    layout: [String],
});

mongoose.model('Remote', RemoteSchema);
mongoose.model('UserRemote', RemoteSchema);
