 var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var KnowledgeSchema = new Schema({
	question: {
		type: String,
		default: ''
	},
	answer: {
		type: String,
		default: '不知道该说什么=.=||'
	}
});

KnowledgeSchema.methods = {};

mongoose.model('Knowledge', KnowledgeSchema);