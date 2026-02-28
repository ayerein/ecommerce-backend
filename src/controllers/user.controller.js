import { mergeCarts } from '../services/cart.service.js'
import { generateToken } from '../utils/utils.js'


export async function loginUser(req, res) {
    try {
        const user = req.user
        const { guestCartId } = req.body    

        if (!user) {
            return res.status(401).json({ status: "error", message: "No autorizado" })
        }

        if (guestCartId && user.cart) {
            await mergeCarts(guestCartId, user.cart)
        }

        const token = generateToken(user)

        res.cookie('currentUser', token, { 
            signed: true, 
            httpOnly: true, 
            sameSite: 'none',
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 })

        res.status(200).json({ 
            status: "success", 
            message: "Login exitoso",
            payload: {
                first_name: user.first_name,
                email: user.email,
                role: user.role,
                cart: user.cart
            }
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
            await mergeCarts(guestCartId, user.cart)
        }

        const token = generateToken(user)

        res.cookie('currentUser', token, { 
            signed: true, 
            httpOnly: true, 
            maxAge: 1000 * 60 * 60 * 24 
        })
        
        res.status(201).json({ 
            status: "success", 
            message: "Usuario registrado con éxito",
            payload: {
                first_name: user.first_name,
                email: user.email,
                role: user.role,
                cart: user.cart
            } 
        })

    } catch(error) {
        console.error("Error en el registro:", error)
        res.status(500).json({ 
            status: "error", 
            message: "Error interno en el servidor al registrar" 
        })
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
        res.json({
            status: "success",
            payload: {
                id: req.user._id || req.user.id,
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                email: req.user.email,
                age: req.user.age,
                cart: req.user.cart,
                role: req.user.role
            }
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