using Microsoft.EntityFrameworkCore.Migrations;

namespace Cursos.Api.Migrations
{
    public partial class FkLog : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Log_CursoId",
                table: "Log");

            migrationBuilder.AlterColumn<string>(
                name: "Descricao",
                table: "Curso",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Log_CursoId",
                table: "Log",
                column: "CursoId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Log_CursoId",
                table: "Log");

            migrationBuilder.AlterColumn<string>(
                name: "Descricao",
                table: "Curso",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Log_CursoId",
                table: "Log",
                column: "CursoId");
        }
    }
}
