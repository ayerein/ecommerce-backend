import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt";

export function generateToken(user){
    const payload = {
        id: user._id,
        first_name: user.first_name,
        email: user.email,
        age: user.age,
        cart: user.cart,
        role: user.role,
    }

    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '24h'})
}

export function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET)
}

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

export const verifyPassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
}