import { existsSync, readFileSync, writeFileSync } from "fs"
import { MigrationActions, Table } from "./types"

export default abstract class BaseMigration {
    protected abstract table: Table
    public static migrationsFilePath: string = "migrations.json"

    public getTable() {
        return this.table
    }

    /** create/alter table */
    public async up() {}

    /** delete/alter back table */
    public async down() {}

    public static async runMigration(migrationName: string, migration: BaseMigration): Promise<void> {
        /** 
         * the mode can be set from command line interface by writing `{tableName}={mode}` after the `migrate` 
         * script
         */
        let mode: MigrationActions

        /**
         * if there's no other params specified, up all migrations not runned, else, run only the migrations
         * in args (depending on their mode).
         */

        if(process.argv[2].split(",").length === 1) {  // the only arg specified is the command name (aka `migrate`)
            mode = BaseMigration.checkIfMigrationWasAlreadyRunned(migrationName)
        } else {
            mode = process.argv[2].split(",").includes(`${migrationName}=down`) 
                ? "down"
                : process.argv[2].split(",").includes(`${migrationName}=up`)
                    ? "up"
                    : "pass"
        }
        
        try {
            switch (mode) {
                case "up":
                    try {
                        await migration.up()
                        BaseMigration.saveMigrationRunned(migrationName, "up")
                        console.log(`[database] info: migration ${migrationName} successfully applied.`)
                    } catch (err: any) {
                        console.log(err.message)
                    }
                    
                    break
                case "down":
                    try {
                        await migration.down()
                        BaseMigration.saveMigrationRunned(migrationName, 'down')
                        console.log(`[database] info: migration ${migrationName} successfully downed.`)    
                    } catch (err) {
                        console.log(err)
                    }

                    break
            }
        } catch (e: any) {
            console.error(`[database] error: an error occurred during ${migrationName} migration running: ${e.message}`)
        }
    }

    private static checkIfMigrationWasAlreadyRunned(migrationName: string): MigrationActions {
        return this.fetchMigrationsFile().includes(migrationName) ? "pass" : "up"
    }

    private static fetchMigrationsFile(): string[] {
        const migrationFilePath = BaseMigration.migrationsFilePath
        if (existsSync(migrationFilePath))
            return JSON.parse(readFileSync(migrationFilePath, { encoding: "utf8" }))
        else {
            writeFileSync(migrationFilePath, "[]")
            return []
        }
    }

    private static saveMigrationRunned(migrationName: string, action: MigrationActions): void {
        const migrationFilePath = BaseMigration.migrationsFilePath
        let migrationsRunned = this.fetchMigrationsFile()

        if (action === "up" && !migrationsRunned.includes(migrationName)) {
            migrationsRunned.push(migrationName)
        } else if (action === "down") {
            migrationsRunned = migrationsRunned.filter(m => m !== migrationName)
        }
        
        writeFileSync(migrationFilePath, JSON.stringify(migrationsRunned, undefined, "  "))
    }
}
