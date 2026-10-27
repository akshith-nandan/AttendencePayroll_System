const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const EmployeeSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        required: true,
    },
    name:{
        type: String,
        trim : true,
        required: [true,'name is required'],
    },
    email: {
        type: String,
        required: [true,'email is required'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w(2,3))+$/, 'please provide an email'],
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        sparse: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minlength: [6,'password must be atleast 6 characters long'],
        select: false
    },
    designation: {
        type: String,
        trim: true,
    },
    joiningDate: {
        type: Date,
        required: true
    },
    monthlySalary: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
    },
    employeementStatus: {
        type: String,
        enum: ['Active','InActive'],
        default: Active,
        required: true
    },
}, { timestamps: true });

UserSchema.pre('save', async function() {
    if(!this.isModified(password)){
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};

module.export = mongoose.model('Employee',EmployeeSchema);