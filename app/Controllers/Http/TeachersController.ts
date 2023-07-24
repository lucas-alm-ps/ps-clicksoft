import { Exception } from "@adonisjs/core/build/standalone";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Teacher from "App/Models/Teacher";
import TeacherValidator from "App/Validators/TeacherValidator";
import UpdateStudentValidator from "App/Validators/UpdateStudentValidator";
import dayjs from "dayjs";
import httpStatus from "http-status";

export default class TeachersController {
  public async store({ request, response }: HttpContextContract) {
    const data = request.only(["name", "email", "enrollment", "birthdate"]);

    await request.validate(TeacherValidator);

    await this.checkIfEmailIsInUse(data.email);
    await this.checkIfEnrollmentIsInUse(data.enrollment);

    this.checkIfDateIsValid(data.birthdate);

    await Teacher.create(data);

    return response.status(201);
  }

  public async show({ params, response }: HttpContextContract) {
    if (!params.id)
      return response.status(400).json({ error: "Missing teacher enrollment" });

    const teacher = await Teacher.findBy("enrollment", params.id);

    if (!teacher) {
      return response.status(404).json({
        error: "Teacher not found",
      });
    }

    return response.status(200).json(teacher);
  }

  public async destroy({ params, response }: HttpContextContract) {
    if (!params.id)
      return response.status(400).json({ error: "Missing teacher enrollment" });

    const teacher = await Teacher.findBy("enrollment", params.id);

    if (!teacher) {
      return response.status(404).json({
        error: "Teacher not found",
      });
    }

    await teacher.delete();

    return response.status(204);
  }

  public async update({ request, response, params }: HttpContextContract) {
    if (!params.id)
      return response.status(400).json({ error: "Missing teacher enrollment" });

    const data = request.only(["name", "email", "enrollment", "birthdate"]);

    await request.validate(UpdateStudentValidator);

    const teacher = await Teacher.findBy("enrollment", params.id);
    if (!teacher)
      throw new Exception("Teacher not found", httpStatus.NOT_FOUND);

    if (data.email && data.email !== teacher.email)
      await this.checkIfEmailIsInUse(data.email);

    if (data.enrollment && data.enrollment !== teacher.enrollment)
      await this.checkIfEnrollmentIsInUse(data.enrollment);

    if (data.birthdate) this.checkIfDateIsValid(data.birthdate);

    teacher.merge(data);
    await teacher.save();
    return response.status(204);
  }

  private async checkIfEmailIsInUse(email: string) {
    const teacher = await Teacher.findBy("email", email);
    if (teacher)
      throw new Exception("Email already in use", httpStatus.CONFLICT);
  }

  private async checkIfEnrollmentIsInUse(enrollment: string) {
    const teacher = await Teacher.findBy("enrollment", enrollment);
    if (teacher)
      throw new Exception("Enrollment already in use", httpStatus.CONFLICT);
  }

  private checkIfDateIsValid(date: string) {
    const dateIsValid = dayjs(date, "DD/MM/YYYY").isValid();
    if (!dateIsValid)
      throw new Exception("Invalid date", httpStatus.BAD_REQUEST);
  }
}
