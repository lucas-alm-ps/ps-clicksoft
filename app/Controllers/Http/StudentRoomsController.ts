import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StudentsController from './StudentsController';

export default class StudentRoomsController extends StudentsController {
    public async index({request, response, params}: HttpContextContract) {

    }

    
}