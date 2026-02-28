import passport from "passport"

export const passportAuth = (strategy) => {
    return async(req, res, next) => {
        passport.authenticate(strategy, {session: false}, (error, user, info) => {
            if (error){
                console.error('Auth error:', error)
                return res.status(500).json({ status: "error", message: "Internal server error during auth" })
            }
            
            if (!user) {
                return res.status(401).json({ 
                    status: "error", 
                    message: info?.message || info?.toString() || "Unauthorized" 
                })
            }
            
            req.user = user
            
            next()
        }) (req, res, next)
    } 
}