const mongoose = require('mongoose');
const Appointment = require('./Appointment');

const HospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    district: {
        type: String,
        required: [true, 'Please add a district']
    },
    province: {
        type: String,
        required: [true, 'Please add a province']
    },
    postalcode: {
        type: String,
        required: [true, 'Please add a name'],
        maxlength: [5, 'Postal code can not be more than 5 characters']
    },
    tel: {
        type: String
    },
    region: {
        type: String,
        required: [true, 'Please add aregion']
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

//Reverse populate with virtuals
HospitalSchema.virtual('appointments', {
    ref: 'Appointment',
    localField: '_id',
    foreignField: 'hospital',
    justOne: false
});

//Cascade delete appointments when a hospital deleted
// HospitalSchema.pre('find', async function(next) {
//     var ObjectId = require('mongoose').Types.ObjectId; 
//     var id = this._id
//     id = new ObjectId(id)
//     console.log(`Appointment being remove from hospital ${id}`);
//     const appointments = await Appointment.find({hospital: id});
//     //console.log(appointments)
//     next();
// });

module.exports = mongoose.model('Hospital', HospitalSchema);