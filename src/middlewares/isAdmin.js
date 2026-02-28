

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next()
    } else {
        res.status(403).json({ status: "error", message: "Acceso denegado: Se requiere rol de Administrador" })
    }
}