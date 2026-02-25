import mongoose from "mongoose"
import { hashPassword } from "../utils/utils.js"

const UserSchema = new mongoose.Schema({
    first_name: String,
    email: { 
        type: String, 
        unique: true
    },
    age: Number,
    password: String,
    cart: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Carts' 
    },
    role: { 
        type: String, 
        default: 'user',
        enum: ['user', 'admin']
    }
})

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next()
    this.password = await hashPassword(this.password)
    next()
})

export default mongoose.model("User", UserSchema)