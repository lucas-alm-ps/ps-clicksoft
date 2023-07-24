import { Exception } from "@adonisjs/core/build/standalone";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Teacher from "App/Models/Teacher";
import httpStatus from "http-status";

export interface TeacherAuthRequest extends HttpContextContract {
  teacher: Teacher;
}

export default class TeacherAuth {
  public async handle(ctx: TeacherAuthRequest, next: () => Promise<void>) {
    const { enrollment } = ctx.request.headers();

    if (!enrollment)
      throw new Exception("Missing header", httpStatus.BAD_REQUEST);

    const teacher = await Teacher.findBy("enrollment", enrollment);

    if (!teacher)
      throw new Exception("Teacher not found", httpStatus.NOT_FOUND);

    ctx.teacher = teacher;
    await next();
  }
}
