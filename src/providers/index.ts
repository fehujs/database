import { CONFIG } from "../config"
import { DatabaseProviderInterface } from "../types"
import SQLiteDatabaseProvider from "./sqlite"


let _provider: DatabaseProviderInterface

switch (CONFIG.modules.database.PROVIDER) {
    case "sqlite":
    default:
        _provider = new SQLiteDatabaseProvider()
        break
}

export const provider = _provider
export {
    SQLiteDatabaseProvider,
}
