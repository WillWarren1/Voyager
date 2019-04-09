using Microsoft.EntityFrameworkCore.Migrations;

namespace content.Migrations
{
    public partial class ChangedPlayerAndTreasureTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPlayers",
                table: "Treasures");

            migrationBuilder.AddColumn<string>(
                name: "BelongsToPlayer",
                table: "Treasures",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PlayerId",
                table: "Treasures",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Treasures_PlayerId",
                table: "Treasures",
                column: "PlayerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Treasures_Players_PlayerId",
                table: "Treasures",
                column: "PlayerId",
                principalTable: "Players",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Treasures_Players_PlayerId",
                table: "Treasures");

            migrationBuilder.DropIndex(
                name: "IX_Treasures_PlayerId",
                table: "Treasures");

            migrationBuilder.DropColumn(
                name: "BelongsToPlayer",
                table: "Treasures");

            migrationBuilder.DropColumn(
                name: "PlayerId",
                table: "Treasures");

            migrationBuilder.AddColumn<bool>(
                name: "IsPlayers",
                table: "Treasures",
                nullable: false,
                defaultValue: false);
        }
    }
}
