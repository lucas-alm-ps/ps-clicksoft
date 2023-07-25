import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class AssignRoomValidator {
  constructor(protected ctx: HttpContextContract) {}

  get validateAll() {
    return true;
  }

  public async fails(errorMessages: any[]) {
    return this.ctx.response.status(400).json(errorMessages);
  }

  public schema = schema.create({
    studentEnrollment: schema.number(),
  });

  public messages: CustomMessages = {
    "studentEnrollment.required": "Campo studentEnrollment é obrigatório",
  };
}
