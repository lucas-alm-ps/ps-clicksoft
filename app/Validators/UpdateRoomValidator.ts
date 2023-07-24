import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class UpdateRoomValidator {
  constructor(protected ctx: HttpContextContract) {}

  get validateAll() {
    return true;
  }

  public async fails(errorMessages: any[]) {
    return this.ctx.response.status(400).json(errorMessages);
  }

  public schema = schema.create({
    number: schema.number.optional(),
    capacity: schema.number.optional(),
    available: schema.boolean.optional(),
    teacherEnrollment: schema.string(),
  });

  public messages: CustomMessages = {
    "enrollment.required": "Campo enrollment é obrigatório",
  };
}
