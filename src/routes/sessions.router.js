import { Router } from 'express'
import { loginUser, registerUser, currentUser, logoutUser, updateUser, deleteUser } from '../controllers/user.controller.js'
import { passportAuth } from '../middlewares/passportAuth.js'

const router = Router()

router.post('/login', passportAuth('login'), loginUser)

router.post('/register', passportAuth('register'), registerUser)

router.put('/update', passportAuth('jwt'), updateUser)

router.get('/current', passportAuth('jwt', { session: false }), currentUser)

router.delete('/delete', passportAuth('jwt'), deleteUser)

router.post('/logout', logoutUser)

export default router