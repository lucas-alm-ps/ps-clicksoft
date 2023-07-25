import { DateTime } from "luxon";
import {
  BaseModel,
  ManyToMany,
  column,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import Student from "./Student";

export default class Room extends BaseModel {
  @column({ isPrimary: true })
  public number: number;

  @column()
  public capacity: number;

  @column()
  public available: boolean;

  @column()
  public teacherEnrollment: string;

  @manyToMany(() => Student)
  public students: ManyToMany<typeof Student>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
