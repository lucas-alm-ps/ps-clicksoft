import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Student from "App/Models/Student";
import StudentValidator from "App/Validators/StudentValidator";
import UpdateStudentValidator from "App/Validators/UpdateStudentValidator";
import {ResponseContract} from '@ioc:Adonis/Core/Response';
import dayjs from "dayjs";

export default class StudentsController {
  public async store({ request, response }: HttpContextContract) {
    const data = request.only(["name", "email", "enrollment", "birthdate"]);

    await request.validate(StudentValidator);

    
    await this.checkIfEnrollmentIsInUse(
      response, 
      data.enrollment
    );

    await this.checkIfEmailIsInUse(response, data.email);

    this.checkIfDateIsValid(response, data.birthdate);
     

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

    if (data.email && data.email !== student.email) 
      await this.checkIfEmailIsInUse(response, data.email);

    if (data.enrollment && data.enrollment !== student.enrollment) 
      await this.checkIfEnrollmentIsInUse(response, data.enrollment);

    if (data.birthdate) this.checkIfDateIsValid(response, data.birthdate);

    student.merge(data);

    await student.save();

    return response.status(204);
  }



  private async checkIfEmailIsInUse(response: ResponseContract, email: string) {
    const student = await Student.findBy("email", email);
    if (student) {
      return response.status(400).json({
        error: "Email already in use",
      });
    }
  }

  private async checkIfEnrollmentIsInUse(response: ResponseContract, enrollment: string) {
    const student = await Student.findBy("enrollment", enrollment);
    if (student) {
      return response.status(400).json({
        error: "Enrollment already in use",
      });
    }
  }

  private checkIfDateIsValid(response: ResponseContract, date: string) {
    const dateIsValid = dayjs(date, "DD/MM/YYYY").isValid();
    if(!dateIsValid) {
      return response.status(400).json({
        error: "Invalid date",
      });
    }
  }
}
