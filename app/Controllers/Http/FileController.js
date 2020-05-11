'use strict'
const Helpers = use('Helpers')
const Drive = use('Drive')
const Env = use('Env')

class FileController {
    async document({ request, response }) {
        const validationOptions = {
            types: ['pdf', 'doc', 'docx'],
            size: '2mb'
        }

        try {
            const document = request.file('file', validationOptions)
            await document.move(Helpers.publicPath('/upload/'), {
                name: document.clientName,
                overwrite: true
            })
            if (!document.moved()) {
                return document.error()
            } else {
                const exists = await Drive.exists(Helpers.publicPath('/upload/') + document.clientName)
                if (exists) {
                    const result = `${Env.get('APP_URL')}/upload/${document.clientName}`
                    if (result) {
                        return response.status(200).send({ message: 'File upload successfully', result: result })
                    } else {
                        return response.status(500).send({ message: 'File uploading failed' })
                    }
                } else {
                    return response.status(500).send({ message: 'File not found' })
                }
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async image({ request, response }) {
        const validationOptions = {
            types: ['png', 'jpg', 'jpeg', 'svg'],
            size: '1mb'
        }

        try {
            const document = request.file('file', validationOptions)
            await document.move(Helpers.publicPath('/upload/'), {
                name: document.clientName,
                overwrite: true
            })
            if (!document.moved()) {
                return document.error()
            } else {
                const exists = await Drive.exists(Helpers.publicPath('/upload/') + document.clientName)
                if (exists) {
                    const result = `${Env.get('APP_URL')}/upload/${document.clientName}`
                    if (result) {
                        return response.status(200).send({ message: 'File upload successfully', result: result })
                    } else {
                        return response.status(500).send({ message: 'File uploading failed' })
                    }
                } else {
                    return response.status(500).send({ message: 'File not found' })
                }
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

module.exports = FileController
