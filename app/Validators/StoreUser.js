'use strict'

class StoreUser {

  get rules() {
    const id = this.ctx.params.id
    if (id) {
      return {
        email: `required|email|unique:users,email,id,${id}`,
        password: 'required'
      }
    } else {
      return {
        email: `required|email|unique:users,email`,
        password: 'required'
      }
    }
  }

  get validateAll() {
    return true
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).send(errorMessages)
  }
}

module.exports = StoreUser
