import { cwd } from "process"

let _config
try {
    _config = await import(cwd() + "/config/database.js")
} catch (e: any) {
    console.log(`[database] config: config file not found, applying default config.`)
    _config = {
        NAME: "database.sqlite",
        PATH: "database.sqlite",
        PROVIDER: "sqlite",
        CONFIG: {
            user: 'localhost',
            host: 'localhost',
            database: "database.db",
            password: "",
            port: 5432,
        }
    }
}

export const CONFIG = { ..._config }
