import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "students_rooms";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .string("student_enrollment")
        .unsigned()
        .references("students.enrollment")
        .onDelete("CASCADE");
      table
        .integer("room_number")
        .unsigned()
        .references("rooms.number")
        .onDelete("CASCADE");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
