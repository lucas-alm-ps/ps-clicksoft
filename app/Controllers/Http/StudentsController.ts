import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Student from "App/Models/Student";
import StudentValidator from "App/Validators/StudentValidator";
import UpdateStudentValidator from "App/Validators/UpdateStudentValidator";
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

    if (!this.checkIfDateIsValid(data.birthdate)) {
      return response.status(400).json({
        error: "Invalid date",
      });
    }

    await Student.create(data);

    return response.status(201);
  }

  public async show({ params, response }: HttpContextContract) {
    if (!params.id)
      return response.status(400).json({ error: "Missing student enrollment" });

    const student = await Student.findBy("enrollment", params.id);

    if (!student) {
      return response.status(404).json({
        error: "Student not found",
      });
    }

    return response.status(200).json(student);
  }

  public async destroy({ params, response }: HttpContextContract) {
    if (!params.id)
      return response.status(400).json({ error: "Missing student enrollment" });

    const student = await Student.findBy("enrollment", params.id);

    if (!student) {
      return response.status(404).json({
        error: "Student not found",
      });
    }

    await student.delete();

    return response.status(204);
  }

  public async update({ request, response, params }: HttpContextContract) {
    if (!params.id)
      return response.status(400).json({ error: "Missing student enrollment" });

    const data = request.only(["name", "email", "enrollment", "birthdate"]);

    await request.validate(UpdateStudentValidator);

    const student = await Student.findBy("enrollment", params.id);

    if (!student) {
      return response.status(404).json({
        error: "Student not found",
      });
    }

    if (data.email && data.email !== student.email) {
      const emailAlreadyInUse = await this.checkIfEmailIsInUse(data.email);
      if (emailAlreadyInUse) {
        return response.status(400).json({
          error: "Email already in use",
        });
      }
    }

    if (data.enrollment && data.enrollment !== student.enrollment) {
      const enrollmentAlreadyInUse = await this.checkIfEnrollmentIsInUse(
        data.enrollment
      );
      if (enrollmentAlreadyInUse) {
        return response.status(400).json({
          error: "Enrollment already in use",
        });
      }
    }

    if (data.birthdate && !this.checkIfDateIsValid(data.birthdate)) {
      return response.status(400).json({
        error: "Invalid date",
      });
    }

    student.merge(data);

    await student.save();

    return response.status(204);
  }

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

  private checkIfDateIsValid(date: string) {
    const dateIsValid = dayjs(date, "DD/MM/YYYY").isValid();
    return dateIsValid;
  }
}
