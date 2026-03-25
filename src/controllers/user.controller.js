import cartService from '../services/cart.service.js'
import { generateToken, hashPassword, verifyPassword } from '../utils/utils.js'
import usersServices from '../services/users.services.js'
import UserDTO from '../models/dto/UserDTO.js'
import dotenv from 'dotenv'
import { sendRecoveryMail } from '../services/mail.services.js'
import jwt from 'jsonwebtoken'

dotenv.config()

export async function loginUser(req, res) {
    try {
        const user = req.user
        const { guestCartId } = req.body    

        if (!user) {
            return res.status(401).json({ status: "error", message: "No autorizado" })
        }

        if (guestCartId && user.cart) {
            await cartService.mergeCarts(guestCartId, user.cart)
        }

        const token = generateToken(user)

        const userClean = new UserDTO(user)

        res.cookie('currentUser', token, { 
            signed: true, 
            httpOnly: true, 
            sameSite: 'none',
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 })

        res.status(200).json({ 
            status: "success", 
            message: "Login exitoso",
            payload: userClean
        })
    } catch(error) {
        return res.status(500).json({ 
            status: "error", 
            message: "Error interno del servidor" 
        })
    }
}

export async function registerUser(req, res) {
    try {
        const user = req.user
        const { guestCartId } = req.body 

        if (!user) {
            return res.status(400).json({ status: "error", message: "No se pudo registrar" })
        }

        if (guestCartId && user.cart) {
            await cartService.mergeCarts(guestCartId, user.cart)
        }

        const token = generateToken(user)

        const userClean = new UserDTO(user)

        res.cookie('currentUser', token, { 
            signed: true, 
            httpOnly: true, 
            maxAge: 1000 * 60 * 60 * 24 
        })
        
        res.status(201).json({ 
            status: "success", 
            message: "Usuario registrado con éxito",
            payload: userClean
        })

    } catch(error) {
        console.error("Error en el registro:", error)
        res.status(500).json({ 
            status: "error", 
            message: "Error interno en el servidor al registrar" 
        })
    }
}

export async function updateUser(req, res) {
    try{
        const user = req.user._id
        const { first_name, last_name, email, age } = req.body

        if (!first_name || !last_name || !email) {
            return res.status(400).json({ message: "Debes completar los campos requeridos" })
        }

        const updatedUser = await usersServices.updateUserById(user, { first_name, last_name, email, age })

        const userClean = new UserDTO(updatedUser)

        res.json({
            message: "Perfil actualizado con éxito",
            user: userClean
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}

export const deleteUser = async (req, res) => {
    try {
        const userId = req.user._id

        await cartService.deleteCartByUserId(userId)

        await usersServices.deleteUserById(userId)

        res.clearCookie('token')

        res.json({ message: "Cuenta eliminada correctamente." })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function currentUser(req, res) {
    try {
        if (!req.user) {
            return res.status(200).json({ 
                status: "success", 
                payload: null
            })
        }

        const userClean = new UserDTO(req.user)
        
        res.json({
            status: "success",
            payload: userClean
        })
    } catch (error) {
        console.error("Error en currentUser:", error);
        res.status(500).json({ 
            status: "error", 
            message: "Error interno del servidor" 
        })
    }
}

export async function logoutUser(req, res) {
    try {
        res.clearCookie('currentUser', {
            signed: true,
            httpOnly: true,
            sameSite: 'none',
            secure: true 
        })
        
        return res.status(200).json({ 
            status: "success", 
            message: "Sesión cerrada correctamente" 
        })
    } catch (error) {
        console.error('Error durante logout:', error)
        return res.status(500).json({ 
            status: "error", 
            message: "No se pudo cerrar la sesión" 
        })
    }
}

export async function forgotPassword (req, res) {
    try {
        const { email } = req.body
        const emailLower = email.toLowerCase().trim()
        const user = await usersServices.getUserByEmail(emailLower)

        if (!user) {
            return res.status(404).json({ message: "Email no encontrado" })
        }

        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })

        await sendRecoveryMail(user.email, token)

        res.json({ message: "Correo de recuperación enviado con éxito" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function resetPassword (req, res) {
    try {
        const { token, password } = req.body

        let decoded

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (error) {
            return res.status(401).json({ message: "El enlace ha expirado o es inválido." })
        }

        const user = await usersServices.getUserByEmail(decoded.email)
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" })

        const isSamePassword = await verifyPassword(password, user.password)

        if (isSamePassword) {
            return res.status(400).json({ message: "No puedes usar la contraseña que ya tenías." })
        }

        const newHashedPassword = await hashPassword(password)

        await usersServices.updateUserPassword(user._id, newHashedPassword)

        res.json({ success: true, message: "Contraseña actualizada correctamente" })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}