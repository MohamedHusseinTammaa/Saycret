using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Saycret.Migrations
{
    /// <inheritdoc />
    public partial class nullproblem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Confessions_Confessions_ParentId",
                table: "Confessions");

            migrationBuilder.DropForeignKey(
                name: "FK_Confessions_Users_AuthorId",
                table: "Confessions");

            migrationBuilder.DropIndex(
                name: "IX_Confessions_AuthorId",
                table: "Confessions");

            migrationBuilder.DropColumn(
                name: "AuthorId",
                table: "Confessions");

            migrationBuilder.AlterColumn<long>(
                name: "ParentId",
                table: "Confessions",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.CreateIndex(
                name: "IX_Confessions_AutherId",
                table: "Confessions",
                column: "AutherId");

            migrationBuilder.AddForeignKey(
                name: "FK_Confessions_Confessions_ParentId",
                table: "Confessions",
                column: "ParentId",
                principalTable: "Confessions",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Confessions_Users_AutherId",
                table: "Confessions",
                column: "AutherId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Confessions_Confessions_ParentId",
                table: "Confessions");

            migrationBuilder.DropForeignKey(
                name: "FK_Confessions_Users_AutherId",
                table: "Confessions");

            migrationBuilder.DropIndex(
                name: "IX_Confessions_AutherId",
                table: "Confessions");

            migrationBuilder.AlterColumn<long>(
                name: "ParentId",
                table: "Confessions",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AuthorId",
                table: "Confessions",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Confessions_AuthorId",
                table: "Confessions",
                column: "AuthorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Confessions_Confessions_ParentId",
                table: "Confessions",
                column: "ParentId",
                principalTable: "Confessions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Confessions_Users_AuthorId",
                table: "Confessions",
                column: "AuthorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
