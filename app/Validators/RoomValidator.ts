import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class RoomValidator {
  constructor(protected ctx: HttpContextContract) {}

  get validateAll() {
    return true;
  }

  public async fails(errorMessages: any[]) {
    return this.ctx.response.status(400).json(errorMessages);
  }

  public schema = schema.create({
    number: schema.number(),
    capacity: schema.number(),
    available: schema.boolean(),
    teacherEnrollment: schema.string(),
  });

  public messages: CustomMessages = {
    "number.required": "Campo name é obrigatório",
    "capacity.required": "Campo email é obrigatório",
    "available.required": "Campo enrollment é obrigatório",
  };
}
