import User from '../models/user.model.js'
import Cart from '../models/cart.model.js'
import { generateToken, verifyPassword } from '../utils/utils.js'

export async function loginUser(req, res) {
    try {
        const { email, password } = req.body
        
        if (!email || !password) {
            return res.status(400).json({ 
                status: "error", 
                message: "Email y contraseña son requeridos" 
            });
        }

        const user = await User.findOne({email})

        if( !user || !(await verifyPassword(password, user.password))){
            return res.status(401).json({ 
                status: "error", 
                message: "Credenciales inválidas" 
            });
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
            user: {
                first_name: user.first_name,
                email: user.email,
                role: user.role,
                cart: user.cart
            }
        });
    } catch(error) {
        console.error('Error en login:', error)
        return res.redirect('/login?error=3')
    }
}

export async function registerUser(req, res) {
    const { first_name, email, age, password } = req.body

    try {
        if (!first_name || !email || !password) {
            return res.status(400).json({ 
                status: "error", 
                message: "Faltan datos obligatorios" 
            });
        }

        const user = await User.findOne({email})

        if(user){
            return res.status(400).json({ 
                status: "error", 
                message: "El correo electrónico ya está registrado" 
            });
        }

        const newCart = await Cart.create({ products: [] })

        const newUser = await User.create({ first_name, email, age, password, cart: newCart._id })

        const token = generateToken(newUser)

        res.cookie('currentUser', token, { signed: true, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 })
        
        res.status(201).json({ 
            status: "success", 
            message: "Usuario registrado con éxito",
            payload: newUser 
        });

    } catch(error) {
        console.error("Error en el registro:", error)
        res.status(500).json({ 
            status: "error", 
            message: "Error interno en el servidor al registrar" 
        });
    }
}

export async function currentUser(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ 
                status: "error", 
                message: "No hay una sesión activa" 
            });
        }
        res.json({
            status: "success",
            payload: {
                id: req.user._id || req.user.id,
                first_name: req.user.first_name,
                email: req.user.email,
                age: req.user.age,
                cart: req.user.cart,
                role: req.user.role
            }
        });
    } catch (error) {
        console.error("Error en currentUser:", error);
        res.status(500).json({ 
            status: "error", 
            message: "Error interno del servidor" 
        });
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
        });
    } catch (error) {
        console.error('Error durante logout:', error)
        return res.status(500).json({ 
            status: "error", 
            message: "No se pudo cerrar la sesión" 
        });
    }
}