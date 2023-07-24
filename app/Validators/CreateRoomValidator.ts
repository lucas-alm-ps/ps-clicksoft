import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateRoomValidator {
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
    enrollment: schema.string(),
  });

  public messages: CustomMessages = {
    "number.required": "Campo number é obrigatório",
    "capacity.required": "Campo capacity é obrigatório",
    "available.required": "Campo available é obrigatório",
    "enrollment.required": "Campo enrollment é obrigatório",
  };
}
