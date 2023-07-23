import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Student from "App/Models/Student";
import StudentValidator from "App/Validators/StudentValidator";
import dayjs from "dayjs";

export default class StudentsController {
  public async store({ request, response }: HttpContextContract) {
    const data = request.only(["name", "email", "enrollment", "birthdate"]);

    await request.validate(StudentValidator);

    const emailAlreadyInUse = await this.checkIfEmailIsInUse(data.email);
    const enrollmentAlreadyInUse = await this.checkIfEnrollmentIsInUse(
      data.enrollment
    );

    if (emailAlreadyInUse) {
      return response.status(400).json({
        error: "Email already in use",
      });
    }

    if (enrollmentAlreadyInUse) {
      return response.status(400).json({
        error: "Enrollment already in use",
      });
    }

    data.birthdate = dayjs(data.birthdate, "DD/MM/YYYY").toDate();

    await Student.create(data);

    return response.status(201);
  }

  // RF02: Permitir que aluno edite seus dados de cadastro
  // RF03: Permitir que aluno exclua seus dados de cadastro
  // RF04: Permitir que aluno consulte seus dados de cadastro

  private async checkIfEmailIsInUse(email: string) {
    const student = await Student.findBy("email", email);
    if (student) return true;
    return false;
  }

  private async checkIfEnrollmentIsInUse(enrollment: string) {
    const student = await Student.findBy("enrollment", enrollment);
    if (student) return true;
    return false;
  }
}
