import { Router } from 'express'
import { loginUser, registerUser, currentUser, logoutUser } from '../controllers/user.controller.js'
import { passportAuth } from '../middlewares/passportAuth.js'

const router = Router()

router.post ('/login', loginUser)

router.post ('/register', registerUser)

router.get('/current', passportAuth('jwt'), currentUser)

router.post('/logout', logoutUser)

export default router