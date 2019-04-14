﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using content;

namespace content.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    [Migration("20190413204726_AddedUserIdColumn")]
    partial class AddedUserIdColumn
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
                .HasAnnotation("ProductVersion", "2.2.0-rtm-35687")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            modelBuilder.Entity("Voyager.Models.Player", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("AmountOfTreasure");

                    b.Property<string>("Name");

                    b.Property<int>("Renown");

                    b.Property<string>("userId");

                    b.HasKey("Id");

                    b.ToTable("Players");
                });

            modelBuilder.Entity("Voyager.Models.Treasure", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("BelongsToPlayer");

                    b.Property<bool>("IsCaptured");

                    b.Property<double?>("Latitude");

                    b.Property<double?>("Longitude");

                    b.Property<int?>("PlayerId");

                    b.Property<int>("Value");

                    b.HasKey("Id");

                    b.HasIndex("PlayerId");

                    b.ToTable("Treasures");
                });

            modelBuilder.Entity("Voyager.Models.Treasure", b =>
                {
                    b.HasOne("Voyager.Models.Player")
                        .WithMany("CapturedTreasure")
                        .HasForeignKey("PlayerId");
                });
#pragma warning restore 612, 618
        }
    }
}