import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Room from "App/Models/Room";
import Teacher from "App/Models/Teacher";
import CreateRoomValidator from "App/Validators/CreateRoomValidator";
import UpdateRoomValidator from "App/Validators/UpdateRoomValidator";
import { Exception } from "@adonisjs/core/build/standalone";
import httpStatus from "http-status";
import { TeacherAuthRequest } from "App/Middleware/TeacherAuth";

export default class RoomsController {
  public async store({ request, response, teacher }: TeacherAuthRequest) {
    await request.validate(CreateRoomValidator);

    const data = request.only(["number", "capacity", "available"]);

    await this.checkIfRoomNumberIsInUse(data.number as number);

    await Room.create({ ...data, teacherEnrollment: teacher.enrollment });

    return response.status(201);
  }

  public async update({ request, response, params }: HttpContextContract) {
    this.checkIdParams(params.id);

    const data = request.only(["number", "available", "capacity"]);

    await request.validate(UpdateRoomValidator);

    if (data.number) await this.checkIfRoomNumberIsInUse(data.number);

    const room = await Room.findBy("number", params.id);

    if (!room) return response.status(404);

    await room.merge(data).save();

    return response.status(204);
  }

  public async destroy({ request, response, params }: HttpContextContract) {
    await this.checkIdParams(params.id);

    await request.validate(UpdateRoomValidator);

    const room = await Room.findBy("number", params.id);
    if (!room) return response.status(404);

    await room.delete();

    return response.status(204);
  }

  public async show({ request, response, params }: HttpContextContract) {
    await this.checkIdParams(params.id);

    const room = await Room.findBy("number", params.id);
    if (!room) throw new Exception("Room not found", httpStatus.NOT_FOUND);

    return response.status(200).json(room);
  }

  private checkIdParams(id: string) {
    if (!id)
      throw new Exception("Missing room number param", httpStatus.BAD_REQUEST);
  }

  private async checkIfRoomNumberIsInUse(number: number) {
    const roomAlreadyExists = await Room.findBy("number", number);
    if (roomAlreadyExists)
      throw new Exception("Room number is in use", httpStatus.CONFLICT);
  }
}
