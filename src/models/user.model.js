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

UserSchema.pre('save', async function() {
    if (this.isModified('password')){
        this.password = await hashPassword(this.password)
    }
})

export default mongoose.model("User", UserSchema)