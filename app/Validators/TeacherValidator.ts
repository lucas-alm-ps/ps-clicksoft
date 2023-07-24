import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class TeacherValidator {
  constructor(protected ctx: HttpContextContract) {}

  get validateAll() {
    return true;
  }

  public async fails(errorMessages: any[]) {
    return this.ctx.response.status(400).json(errorMessages);
  }

  public schema = schema.create({
    name: schema.string(),
    email: schema.string({}, [rules.email()]),
    enrollment: schema.string(),
    birthdate: schema.date({ format: "dd/MM/yyyy" }),
  });

  public messages: CustomMessages = {
    "name.required": "Campo name é obrigatório",
    "email.required": "Campo email é obrigatório",
    "enrollment.required": "Campo enrollment é obrigatório",
    "birthdate.required": "Campo birthDate é obrigatório",
  };
}
