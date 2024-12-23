/**
 * DISCLAMER: here I use a third-party library (`sqlite3`) but NodeJS plans to add an equivalent on next
 * versions (aka node v22).
 * 
 * The current LTS version of NodeJS at this time is the v20.17.0.
 * 
 * Maybe I'll do the refactor when the v22 will be LTS.
 */

import BaseMigration from "./base-migration"
import BaseModel from "./base-model"
import BaseSeeder from "./base-seeder"
import SQLiteDatabaseProvider from "./providers/sqlite"
import type {
    AlterTable,
    Column,
    CreateTable,
    DatabaseProviderInterface,
    MigrationActions,
    ModelObject,
    Operator,
    PrimaryKey,
    Serialize,
    SqlOperator,
    Table
} from "./types"


type DatabaseConfig = {
    NAME: string,
    PATH: string,
    PROVIDER: "sqlite"
    DB_CONFIG?: any
} 

export {
    AlterTable,
    BaseMigration,
    BaseModel,
    BaseSeeder,
    Column,
    CreateTable,
    DatabaseConfig,
    DatabaseProviderInterface,
    MigrationActions,
    ModelObject,
    Operator,
    PrimaryKey,
    Serialize,
    SQLiteDatabaseProvider,
    SqlOperator,
    Table,
}
