using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Saycret.Migrations
{
    /// <inheritdoc />
    public partial class MigrationName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Confessions_Users_AuthorUserName",
                table: "Confessions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Users",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Confessions_AuthorUserName",
                table: "Confessions");

            migrationBuilder.DropColumn(
                name: "AuthorUserName",
                table: "Confessions");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<int>(
                name: "AuthorId",
                table: "Confessions",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Users",
                table: "Users",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Confessions_AuthorId",
                table: "Confessions",
                column: "AuthorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Confessions_Users_AuthorId",
                table: "Confessions",
                column: "AuthorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Confessions_Users_AuthorId",
                table: "Confessions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Users",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Confessions_AuthorId",
                table: "Confessions");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "AuthorId",
                table: "Confessions");

            migrationBuilder.AddColumn<string>(
                name: "AuthorUserName",
                table: "Confessions",
                type: "character varying(20)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Users",
                table: "Users",
                column: "UserName");

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
    }
}
