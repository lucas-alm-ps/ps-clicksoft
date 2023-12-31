import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "rooms";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer("number").notNullable().primary();
      table.integer("capacity").notNullable();
      table.boolean("available").notNullable();
      table.string("teacher_enrollment").notNullable();

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
