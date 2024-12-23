import Knex from "knex"
import sqlite from "sqlite3"


import { CONFIG } from "../config"
import { getCreateTableSqlScript } from "../helpers"
import { AlterTable, CreateTable, DatabaseProviderInterface, Table, ModelObject, Conditions } from "../types"


const knex = Knex({
    client: 'sqlite3',
    connection: {
        filename: `file:${CONFIG.PATH}`,
        flags: ['OPEN_URI', 'OPEN_SHAREDCACHE'],
    },
    useNullAsDefault: true,
})

export default class SQLiteDatabaseProvider implements DatabaseProviderInterface {
    private _db?: sqlite.Database
    private _dbPath: string = CONFIG.PATH

    get db() {
        return this._db
    }

    get dbPath() {
        return this._dbPath
    }
    
    public connectDb () {
        this._db = new sqlite.Database(this.dbPath, err => {
            if (err) {
                throw new Error(`[database] error: cannot connect ${this.dbPath} database : ${err.name} : ${err.message}`)
            }
        })
    }
    
    public closeConnection() {
        if(!this._db) return

        this._db.close((err) => {
            if (err) {
                throw new Error(`[database] error: cannot close connection with ${this.dbPath} : ${err.message}`)
            }
        })
    }

    public async query (table: Table) {
        return knex(table.name)
    }

    public async createTable (table: CreateTable): Promise<void> {
        return new Promise(async (resolve, reject) => {
            this.connectDb()

            const q = getCreateTableSqlScript(table)
            this._db!.serialize(() => {
                this.db!.run(q, async (_: any, err: any) => {
                    if (err) {
                        reject(`[database] error: cannot create table ${table.name} : ${err.name}, ${err.message}`)
                    }

                    this.closeConnection()
                    resolve()
                })
            })
        })
    }

    /**
     * Not implemented yet
     */
    public async alterTable (table: AlterTable): Promise<void> {
        throw new Error("[database] error: not implemented yet.")
    }

    public async dropTable (table: Table): Promise<void> {
        return new Promise(async (resolve, reject) => {
            this.connectDb()
        
            this._db!.serialize(() => {
                this._db!.run(`DROP TABLE ${table.name};`, async (_: any, err: any) => {
                    if (err) {
                        reject(`[database] error: cannot drop table ${table.name} : ${err.name}, ${err.message}`)
                    }
                    
                    this.closeConnection()
                    resolve()
                })
            })
        })
    }

    public async select<T extends ModelObject> (table: Table, condition: Conditions = {}): Promise<T[]> {
        const conditionsCols = Object.keys(condition)
        const conditionsVals = Object.values(condition)

        if (conditionsCols.length > 0) {
            let q = knex(table.name)
                .select(table.columns ?? '*')
                .where(conditionsCols[0], conditionsVals[0])
            
            for (let i = 1; i < conditionsCols.length; i++) {
                q = q.andWhere(conditionsCols[i], conditionsVals[i])
            }

            return await q
        }

        return await knex(table.name).select(table.columns ?? '*') as T[]
    }

    public async insert<T extends ModelObject> (table: Table, value: T): Promise<T> {
        await knex(table.name).insert(value)
        return value
    }

    public async update<T extends ModelObject> (table: Table, condition: Conditions, value: T): Promise<T> {
        const conditionsCols = Object.keys(condition)
        const conditionsVals = Object.values(condition)

        if (conditionsCols.length > 0) {
            let q = knex(table.name)
                .update(value)
                .where(conditionsCols[0], conditionsVals[0])
            
            for (let i = 1; i < conditionsCols.length; i++) {
                q = q.andWhere(conditionsCols[i], conditionsVals[i])
            }

            await q

            return value
        }

        return await new Promise((_, reject) => reject("[database] error: you must specify conditions for editing your rows."))
    }

    public async delete<T extends ModelObject> (table: Table, condition: Conditions): Promise<T[]> {
        const conditionsCols = Object.keys(condition)
        const conditionsVals = Object.values(condition)

        if (conditionsCols.length > 0) {
            const q = knex(table.name)
                .where(conditionsCols[0], conditionsVals[0])
            
            for (let i = 1; i < conditionsCols.length; i++) {
                q.andWhere(conditionsCols[i], conditionsVals[i])
            }

            return await q.del() as T[]
        }
        
        return await knex(table.name).del() as T[]
    }
}
