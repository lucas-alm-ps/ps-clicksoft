import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Room from "App/Models/Room";
import Teacher from "App/Models/Teacher";
import CreateRoomValidator from "App/Validators/CreateRoomValidator";
import UpdateRoomValidator from "App/Validators/UpdateRoomValidator";
import { Exception } from "@adonisjs/core/build/standalone";
import httpStatus from "http-status";

export default class RoomsController {
  public async store({ request, response }: HttpContextContract) {
    try {
      await request.validate(CreateRoomValidator);

      const data = request.only([
        "number",
        "capacity",
        "available",
        "teacherEnrollment",
      ]);

      await this.checkIfUserIsTeacher(data.teacherEnrollment);
      await this.checkIfRoomNumberIsInUse(data.number as number);

      await Room.create(data);

      return response.status(201);
    } catch (error) {
      return response.status(error.status || 500).json({
        error: error.message || "Something went wrong",
      });
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    this.checkIdParams(params.id);

    const data = request.only([
      "teacherEnrollment",
      "number",
      "available",
      "capacity",
    ]);

    await request.validate(UpdateRoomValidator);

    await this.checkIfUserIsTeacher(data.teacherEnrollment);

    if (data.number) this.checkIfRoomNumberIsInUse(data.number);

    const room = await Room.findBy("number", params.id);

    if (!room) return response.status(404);

    await room.merge(data);

    return response.status(204);
  }

  public async destroy({ request, response, params }: HttpContextContract) {
    await this.checkIdParams(params.id);

    await request.validate(UpdateRoomValidator);

    const data = request.only(["enrollment"]);

    await this.checkIfUserIsTeacher(data.enrollment);

    const room = await Room.findBy("number", params.id);
    if (!room) return response.status(404);

    await room.delete();

    return response.status(204);
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

  private async checkIfUserIsTeacher(enrollment: string) {
    const teacherExists = await Teacher.findBy("enrollment", enrollment);
    if (!teacherExists)
      throw new Exception("Teacher not found", httpStatus.NOT_FOUND);
  }
}
