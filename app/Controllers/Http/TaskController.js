'use strict'
const Task = use('App/Models/Task');
const Antl = use('Antl')

const searchInFields = [
    'name',
    'details'
]
class TaskController {

    async index({ request, response, view }) {
        let page = 1;
        let pageSize = 5;

        if (request.input('page')) {
            page = request.input('page')
        }
        if (request.input('pageSize')) {
            pageSize = request.input('pageSize')
        }

        const search = request.input('search')
        const orderBy = request.input('orderBy')
        const orderDirection = request.input('orderDirection')

        const query = Task.query()

        if (orderBy && orderDirection) {
            query.orderBy(`${orderBy}`, orderDirection)
        }
        if (search) {
            searchInFields.forEach(filed => {
                query.whereRaw(`${filed} LIKE '%${search}%'`)
            })
        }

        if (request.input('filters')) {
            const filters = JSON.parse(request.input('filters'))
            filters.forEach(filter => {
                query.whereRaw(`${filter.name} LIKE '%${filter.value}%'`)
            })
        }

        const result = await query.paginate(page, pageSize)


        if (result) {
            return response.status(200).send(result)
        } else {
            return response.status(404).send({
                message: Antl.formatMessage('response.not_found', { name: "Task" })
            })
        }
    }

    async store({ request, response }) {
        const query = new Task()
        if (query) {
            query.user_id = request.input('user_id')
            query.name = request.input('name')
            query.details = request.input('details')

            const result = await query.save()
            if (result) {
                return response.status(200).send({
                    message: Antl.formatMessage('response.create_success', { name: "Task" })
                })
            } else {
                return response.status(500).send({
                    message: Antl.formatMessage('response.something_went_wrong')
                })
            }

        } else {
            return response.status(404).send({
                message: Antl.formatMessage('response.not_found', { name: "Task" })
            })
        }
    }

    async show({ params, request, response, view }) {
        const query = await Task.query().with('user').where('id', params.id).first()
        if (query) {
            return response.status(200).send(query)
        } else {
            return response.status(404).send({
                message: Antl.formatMessage('response.not_found', { name: "Task" })
            })
        }
    }

    async update({ params, request, response }) {
        let query = await Task.find(params.id)
        if (query) {
            query.user_id = request.input('user_id')
            query.name = request.input('name')
            query.details = request.input('details')
            const result = await query.save()
            if (result) {
                return response.status(200).send({
                    message: Antl.formatMessage('response.update_success', { name: "Task" })
                })
            } else {
                return response.status(500).send({
                    message: Antl.formatMessage('response.something_went_wrong')
                })
            }
        } else {
            return response.status(404).send({
                message: Antl.formatMessage('response.not_found', { name: "Task" })
            })
        }
    }

    async destroy({ params, request, response }) {
        let query = await Task.find(params.id)
        if (query) {
            const result = await query.delete()
            if (result) {
                return response.status(200).send({
                    message: Antl.formatMessage('response.delete_success', { name: "Task" })
                })
            } else {
                return response.status(500).send({
                    message: Antl.formatMessage('response.something_went_wrong')
                })
            }
        } else {
            return response.status(404).send({
                message: Antl.formatMessage('response.not_found', { name: "Task" })
            })
        }
    }
}

module.exports = TaskController
