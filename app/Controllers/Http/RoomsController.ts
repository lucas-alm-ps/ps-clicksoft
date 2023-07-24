import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Room from "App/Models/Room";
import Teacher from "App/Models/Teacher";
import CreateRoomValidator from "App/Validators/CreateRoomValidator";
import {ResponseContract} from '@ioc:Adonis/Core/Response';
import UpdateRoomValidator from "App/Validators/UpdateRoomValidator";

export default class RoomsController {
  public async store({ request, response }: HttpContextContract) {
    await request.validate(CreateRoomValidator);

    const data = request.only([
      "number",
      "capacity",
      "available",
      "enrollment",
    ]);

    this.checkIfUserIsTeacher(response, data.enrollment);
    this.checkIfRoomNumberIsInUse(response, data.number as number);
    
    await Room.create({
      number: data.number,
      capacity: data.capacity,
      available: data.available,
    });

    return response.status(201);
  }

  public async update({request, response, params}: HttpContextContract){
    
    this.checkIdParams(response, params.id);

    const data = request.only(['enrollment', 'number', 'available', 'capacity']);

    await request.validate(UpdateRoomValidator);

    this.checkIfUserIsTeacher(response, data.enrollment);

    if(data.number) this.checkIfRoomNumberIsInUse(response, data.number);

    const room = await Room.findBy('number', params.id);

    if(!room) return response.status(404);

    await room.merge(data);

    return response.status(204);
  }

  private checkIdParams(response: ResponseContract, id: string) {
    if (!id)
      return response.status(400).json({ error: "Missing room number" });
  }

  private async checkIfRoomNumberIsInUse(response: ResponseContract, number: number) {
    const roomAlreadyExists = await Room.findBy("number", number);
    if (roomAlreadyExists) {
      return response.status(400).json({
        error: "Room number is already in use",
      });
    }
  }

  private async checkIfUserIsTeacher(response: ResponseContract, enrollment: string) {
    const teacherExists = await Teacher.findBy(
      "enrollment",
      enrollment
    );
    if (!teacherExists) {
      return response.status(400).json({
        error: "User is not a teacher",
      });
    }
  }
}
