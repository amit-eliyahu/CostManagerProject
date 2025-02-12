const mongoose = require('mongoose');

/**
 * Schema for User document in MongoDB.
 * @param {Number} id - Unique ID for the user.
 * @param {String} first_name - User's first name.
 * @param {String} last_name - User's last name.
 * @param {Date} birthday - User's date of birth.
 * @param {String} marital_status - User's marital status.
 */
const userSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    birthday: { type: Date, required: true },
    marital_status: { type: String, required: true, enum: ['single', 'married', 'divorced', 'widowed'] }
});

/**
 * User model to interact with the 'User' collection.
 * @param {Object} User - The User model to be exported.
 */
const User = mongoose.model('User', userSchema);
module.exports = User;
