import User from "../user.model.js"

class UsersDAO {
    async updateUser(id, data) {
        return await User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select("-password")
    }

    async deleteUser(id) {
        return await User.findByIdAndDelete(id)
    }
    
    async getUser(email) {
        return await User.findOne({ email })
    }

    async updatePassword(id, data) {
        return await User.findByIdAndUpdate(id, data)
    }
    
}

export default new UsersDAO()