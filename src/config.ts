import { cwd } from "process"
import { join } from "path"
import { pathToFileURL } from "url"


let _config
try {
    const configPath = pathToFileURL(join(cwd(), "src", "config", "database.js")).href
    _config = (await import(configPath)).default
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
