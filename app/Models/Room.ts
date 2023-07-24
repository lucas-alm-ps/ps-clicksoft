import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Room extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public number: number;

  @column()
  public capacity: number;

  @column()
  public available: boolean;

  @column()
  public teacherEnrollment: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
