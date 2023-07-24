import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class UpdateStudentValidator {
  constructor(protected ctx: HttpContextContract) {}

  get validateAll() {
    return true;
  }

  public async fails(errorMessages: any[]) {
    return this.ctx.response.status(400).json(errorMessages);
  }

  public schema = schema.create({
    name: schema.string.optional(),
    email: schema.string.optional({}, [rules.email()]),
    enrollment: schema.string.optional(),
    birthDate: schema.date.optional({ format: "dd/MM/yyyy" }),
  });
}
