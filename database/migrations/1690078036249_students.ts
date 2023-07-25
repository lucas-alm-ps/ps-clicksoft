import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "students";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string("name").notNullable();
      table.string("email").notNullable();
      table.string("birthdate").notNullable();
      table.string("enrollment").notNullable().unique().primary();

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
