import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Student from "App/Models/Student";
import StudentValidator from "App/Validators/StudentValidator";
import UpdateStudentValidator from "App/Validators/UpdateStudentValidator";
import dayjs from "dayjs";
import { Exception } from "@adonisjs/core/build/standalone";
import httpStatus from "http-status";

export default class StudentsController {
  public async store({ request, response }: HttpContextContract) {
    const data = request.only(["name", "email", "enrollment", "birthdate"]);

    await request.validate(StudentValidator);

    await this.checkIfEnrollmentIsInUse(data.enrollment);

    await this.checkIfEmailIsInUse(data.email);

    this.checkIfDateIsValid(data.birthdate);

    await Student.create(data);

    return response.status(201);
  }

  public async show({ params, response }: HttpContextContract) {
    this.checkIdParams(params.id);

    const student = await Student.findBy("enrollment", params.id);

    if (!student)
      throw new Exception("Student not found", httpStatus.NOT_FOUND);

    return response.status(200).json(student);
  }

  public async destroy({ params, response }: HttpContextContract) {
    this.checkIdParams(params.id);

    const student = await Student.findBy("enrollment", params.id);

    if (!student)
      throw new Exception("Student not found", httpStatus.NOT_FOUND);

    await student.delete();

    return response.status(204);
  }

  public async update({ request, response, params }: HttpContextContract) {
    this.checkIdParams(params.id);

    const data = request.only(["name", "email", "enrollment", "birthdate"]);

    await request.validate(UpdateStudentValidator);

    const student = await Student.findBy("enrollment", params.id);

    if (!student)
      throw new Exception("Student not found", httpStatus.NOT_FOUND);

    if (data.email && data.email !== student.email)
      await this.checkIfEmailIsInUse(data.email);

    if (data.enrollment && data.enrollment !== student.enrollment)
      await this.checkIfEnrollmentIsInUse(data.enrollment);

    if (data.birthdate) this.checkIfDateIsValid(data.birthdate);

    await student.merge(data).save();

    await student.save();

    return response.status(204);
  }

  public async getStudentInfo({ params, response }: HttpContextContract) {
    this.checkIdParams(params.enrollment);

    const student = await Student.findBy("enrollment", params.enrollment);

    if (!student)
      throw new Exception("Student not found", httpStatus.NOT_FOUND);

    const rooms = await student
      .related("rooms")
      .query()
      .rightJoin("teachers", "teachers.enrollment", "rooms.teacher_enrollment")
      .select("rooms.*", "teachers.name as teacher_name");

    const formattedRooms = rooms.map((room) => {
      return {
        number: room.number,
        capacity: room.capacity,
        teacher: room.$extras.teacher_name,
      };
    });

    return response.status(200).json({ student, rooms: formattedRooms });
  }

  private checkIdParams(id: string) {
    if (!id)
      throw new Exception(
        "Missing student enrollment param",
        httpStatus.BAD_REQUEST
      );
  }

  private async checkIfEmailIsInUse(email: string) {
    const student = await Student.findBy("email", email);
    if (student)
      throw new Exception("Email already in use", httpStatus.CONFLICT);
  }

  private async checkIfEnrollmentIsInUse(enrollment: string) {
    const student = await Student.findBy("enrollment", enrollment);
    if (student)
      throw new Exception("Enrollment already in use", httpStatus.CONFLICT);
  }

  private checkIfDateIsValid(date: string) {
    const dateIsValid = dayjs(date, "DD/MM/YYYY").isValid();
    if (!dateIsValid)
      throw new Exception("Invalid date", httpStatus.BAD_REQUEST);
  }
}
