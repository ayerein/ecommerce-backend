import UsersDAO from "../models/dao/UsersDAO.js"

class UsersServices {
    constructor(dao) {
        this.dao = dao
    }

    async updateUserById(id, data) {
        return await this.dao.updateUser(id, data)
    }

    async deleteUserById(id) {
        return await this.dao.deleteUser(id)
    }

    async getUserByEmail(email) {
        return await this.dao.getUser(email)
    }

    async updateUserPassword(id, hashedPassword) {
        return await this.dao.updatePassword(id, { password: hashedPassword })
    }
}

export default new UsersServices(UsersDAO)

