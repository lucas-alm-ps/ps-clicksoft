import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Teacher extends BaseModel {
  @column()
  public name: string;

  @column()
  public email: string;

  @column()
  public birthdate: DateTime;

  @column({ isPrimary: true })
  public enrollment: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
