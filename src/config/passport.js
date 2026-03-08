import passport from "passport"
import jwt from 'passport-jwt'
import local from 'passport-local'
import User from "../models/user.model.js"
import Cart from "../models/cart.model.js"
import { verifyPassword } from "../utils/utils.js"

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt
const LocalStrategy = local.Strategy

const cookieExtractor = req => {
    let token = null
    if (req && req.signedCookies) {
        token = req.signedCookies.currentUser
    }
    return token
}

const initializePassport = () => {
    passport.use('register', new LocalStrategy({
        passReqToCallback: true, 
        usernameField: 'email'
    }, async (req, email, password, done) => {
        try {
            const { first_name, last_name, age } = req.body;

            const user = await User.findOne({ email });
            if (user) {
                return done(null, false, { message: "El correo ya está registrado" });
            }

            const newCart = await Cart.create({ products: [] });

            const newUser = await User.create({
                first_name,
                last_name,
                email,
                age,
                password,
                cart: newCart._id
            })

            return done(null, newUser);
        } catch (error) {
            return done(error);
        }
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email })
            
            if (!user) {
                return done(null, false, { message: "Usuario no encontrado" })
            }

            const isValid = await verifyPassword(password, user.password)
            if (!isValid) {
                return done(null, false, { message: "Credenciales inválidas" })
            }

            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET
    }, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id)

            if (!user) {
                return done(null, false, { message: "Usuario no encontrado." })
            }

            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))

}

export default initializePassport