import { readdirSync } from 'fs'
import { join } from 'path'
import { cwd } from 'process'
import { pathToFileURL } from 'url'

import BaseMigration from './base-migration'
import BaseSeeder from './base-seeder'
import type { CreateTable, NameInterface } from "./types"


export function getCreateTableSqlScript(table: CreateTable) {
    let q = `CREATE TABLE IF NOT EXISTS ${table.name} (`

    for (const col of table.columns) {
        q += `${col.name}
            ${col.type} 
            ${col.isPrimaryKey ? 'PRIMARY KEY' : ''} 
            ${col.isUnique ? 'UNIQUE' : ''} 
            ${col.isNotNull ? 'NOT NULL' : ''} 
            ${col.isAutoIncrement ? 'AUTOINCREMENT' : ''} 
            ${col.default ? `DEFAULT ${col.default}` : ''}, `
    }

    q = q.slice(0, q.length - 2)
    q += ");"

    return q
}

function isSubclassOf(childConstructor: Function, parentConstructor: Function): boolean {
    let currentConstructor = childConstructor
    
    while (currentConstructor) {
        if (currentConstructor.name === parentConstructor.name) {
            return true
        }
        currentConstructor = Object.getPrototypeOf(currentConstructor)
    }
  
    return false
}

async function loadAndInstanciate<T extends (BaseMigration | BaseSeeder)>(path: string, parentConstructor: Function) {
    const dirPathForImport = pathToFileURL(path)

    let resolvedCls: Record<string, T> = {}

    return await new Promise<Record<string, T>>(async (resolve) => {
        const files = readdirSync(path)

        for (const file of files) {
            if (file.endsWith('.js')) {
                const module = await import(`${dirPathForImport}/${file}`)

                for (const exportedClass in module) {
                    const cls = module[exportedClass]
                    
                    // verifies that the class is a parentConstructor child
                    if (!isSubclassOf(cls, parentConstructor))
                        continue

                    const instance = new cls()
                    resolvedCls[instance.name] = instance
                }
            }
        }
        resolve(resolvedCls)
    })
}

export async function loadAndInstanciateMigrations() {
    const path = join(cwd(), "build", "migrations")
    return (await loadAndInstanciate(path, BaseMigration)) as Record<string, BaseMigration>
}

export async function loadAndInstanciateSeeders() {
    const path = join(cwd(), "build", "seeders")
    return (await loadAndInstanciate(path, BaseSeeder)) as Record<string, BaseSeeder>
}
