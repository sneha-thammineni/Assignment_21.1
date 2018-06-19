const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    var moment = require('moment');

// create a schema
const employeeSchema = new Schema({
    name: String,
    slug: {
        type: String,
        unique: true
    },
    department: String,
    designation: String,
    salary: { type: Number, min: 3000, max: 50000 },
    dateofjoining: String,
    city: String
});

// middleware -----
// make sure that the slug is created from the name
employeeSchema.pre('save', function(next) {
    this.dateofjoining = moment(this.dateofjoining).format('DD-MM-YYYY');
    this.slug = slugify(this.name);
    next();
});

// create the model
const employeeModel = mongoose.model('Employee', employeeSchema);

// export the model
module.exports = employeeModel;

// function to slugify a name
function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}