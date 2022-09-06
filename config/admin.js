const AdminJS = require('adminjs')
const AdminJSMongoose = require('@adminjs/mongoose')
const mongoose = require('mongoose')
AdminJS.registerAdapter(AdminJSMongoose)
const models = require('../model')
const adminJs = new AdminJS({
    databases: [mongoose],
    rootPath: '/admin',
    resources: models.model
})
module.exports = adminJs