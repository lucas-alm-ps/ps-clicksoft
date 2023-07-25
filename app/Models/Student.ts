import { DateTime } from "luxon";
import {
  BaseModel,
  ManyToMany,
  column,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import Room from "./Room";

export default class Student extends BaseModel {
  @column()
  public name: string;

  @column()
  public email: string;

  @column()
  public birthdate: DateTime;

  @column({ isPrimary: true })
  public enrollment: string;

  @manyToMany(() => Room, {
    pivotTable: "students_rooms",
    localKey: "enrollment",
    pivotForeignKey: "student_enrollment",
    relatedKey: "number",
    pivotRelatedForeignKey: "room_number",
  })
  public rooms: ManyToMany<typeof Room>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
