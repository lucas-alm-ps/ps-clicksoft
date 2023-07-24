import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Room from "App/Models/Room";
import Teacher from "App/Models/Teacher";
import CreateRoomValidator from "App/Validators/CreateRoomValidator";

export default class RoomsController {
  public async store({ request, response }: HttpContextContract) {
    await request.validate(CreateRoomValidator);

    const data = request.only([
      "number",
      "capacity",
      "available",
      "enrollment",
    ]);

    if (!this.checkIfUserIsTeacher(data.enrollment)) {
      return response.status(400).json({
        error: "User is not a teacher",
      });
    }

    await Room.create(data);

    return response.status(201);
  }

  private async checkIfUserIsTeacher(enrollment: string) {
    const teacher = Teacher.findBy("enrollment", enrollment);

    if (!teacher) {
      return false;
    }
    return true;
  }
}
