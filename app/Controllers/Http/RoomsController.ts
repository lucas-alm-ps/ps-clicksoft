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

    const teacherExists = await await Teacher.findBy(
      "enrollment",
      data.enrollment
    );
    if (!teacherExists) {
      return response.status(400).json({
        error: "User is not a teacher",
      });
    }

    const roomAlreadyExists = await Room.findBy("number", data.number);
    if (roomAlreadyExists) {
      return response.status(400).json({
        error: "Room number is already in use",
      });
    }

    await Room.create({
      number: data.number,
      capacity: data.capacity,
      available: data.available,
    });

    return response.status(201);
  }
}
