using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Saycret.Migrations
{
    /// <inheritdoc />
    public partial class fkForConfession1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AutherId",
                table: "Confessions",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "AuthorUserName",
                table: "Confessions",
                type: "character varying(20)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Confessions_AuthorUserName",
                table: "Confessions",
                column: "AuthorUserName");

            migrationBuilder.AddForeignKey(
                name: "FK_Confessions_Users_AuthorUserName",
                table: "Confessions",
                column: "AuthorUserName",
                principalTable: "Users",
                principalColumn: "UserName",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Confessions_Users_AuthorUserName",
                table: "Confessions");

            migrationBuilder.DropIndex(
                name: "IX_Confessions_AuthorUserName",
                table: "Confessions");

            migrationBuilder.DropColumn(
                name: "AutherId",
                table: "Confessions");

            migrationBuilder.DropColumn(
                name: "AuthorUserName",
                table: "Confessions");
        }
    }
}
