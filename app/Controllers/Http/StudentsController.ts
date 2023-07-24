import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Student from "App/Models/Student";
import StudentValidator from "App/Validators/StudentValidator";
import UpdateStudentValidator from "App/Validators/UpdateStudentValidator";
import NotFoundException from "App/Exceptions/NotFoundException";
import BadRequestException from "App/Exceptions/BadRequestException";
import ConflictException from "App/Exceptions/ConflictException";
import dayjs from "dayjs";

export default class StudentsController {
  public async store({ request, response }: HttpContextContract) {
    const data = request.only([
      "name",
      "email",
      "teacherEnrollment",
      "birthdate",
    ]);

    await request.validate(StudentValidator);

    await this.checkIfEnrollmentIsInUse(data.teacherEnrollment);

    await this.checkIfEmailIsInUse(data.email);

    this.checkIfDateIsValid(data.birthdate);

    await Student.create(data);

    return response.status(201);
  }

  public async show({ params, response }: HttpContextContract) {
    if (!params.id)
      return response.status(400).json({ error: "Missing student enrollment" });

    const student = await Student.findBy("enrollment", params.id);

    if (!student) throw new NotFoundException("Student not found");

    return response.status(200).json(student);
  }

  public async destroy({ params, response }: HttpContextContract) {
    if (!params.id)
      return response.status(400).json({ error: "Missing student enrollment" });

    const student = await Student.findBy("enrollment", params.id);

    if (!student) throw new NotFoundException("Student not found");

    await student.delete();

    return response.status(204);
  }

  public async update({ request, response, params }: HttpContextContract) {
    if (!params.id)
      throw new BadRequestException("Missing student enrollment param");

    const data = request.only([
      "name",
      "email",
      "teacherEnrollment",
      "birthdate",
    ]);

    await request.validate(UpdateStudentValidator);

    const student = await Student.findBy("enrollment", params.id);

    if (!student) throw new NotFoundException("Student not found");

    if (data.email && data.email !== student.email)
      await this.checkIfEmailIsInUse(data.email);

    if (data.teacherEnrollment && data.teacherEnrollment !== student.enrollment)
      await this.checkIfEnrollmentIsInUse(data.teacherEnrollment);

    if (data.birthdate) this.checkIfDateIsValid(data.birthdate);

    student.merge(data);

    await student.save();

    return response.status(204);
  }

  private async checkIfEmailIsInUse(email: string) {
    const student = await Student.findBy("email", email);
    if (student) throw new ConflictException("Email already in use");
  }

  private async checkIfEnrollmentIsInUse(enrollment: string) {
    const student = await Student.findBy("enrollment", enrollment);
    if (student) throw new ConflictException("Enrollment already in use");
  }

  private checkIfDateIsValid(date: string) {
    const dateIsValid = dayjs(date, "DD/MM/YYYY").isValid();
    if (!dateIsValid) throw new BadRequestException("Invalid date");
  }
}
