const mongoose = require('mongoose');

/**
 * Schema for User document in MongoDB.
 * Defines the structure and validation for user data.
 * * @type {mongoose.Schema<User>}
 */
const userSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true }, // Unique ID for the user.
    first_name: { type: String, required: true }, // User's first name.
    last_name: { type: String, required: true }, // User's last name.
    birthday: { type: Date, required: true }, // User's date of birth.
    marital_status: { type: String, required: true, enum: ['single', 'married', 'divorced', 'widowed']} // User's marital status. Possible values are: single, married, divorced, or widowed.
});

/**
 * User model to interact with the 'User' collection in the database.
 * @type {mongoose.Model<User>}
 */
const User = mongoose.model('User', userSchema);
module.exports = User; // Exporting the model for use in other parts of the app.