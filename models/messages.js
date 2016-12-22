var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var messageSchema = new Schema({
  from: Number,
  to: Number,
  deeplink: String,
  type: String,
  state: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Message', messageSchema);

