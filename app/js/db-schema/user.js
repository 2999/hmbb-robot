var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: {
		type: String,
		default: ''
	},
	sex: {
		type: String,
		default: ''
	},
	age: {
		type: Number,
		default: 0
	}
});

UserSchema.methods = {};

mongoose.model('User', UserSchema);