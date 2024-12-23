
export default abstract class BaseSeeder {
    public async run() {}

    public static async runSeeder(seederName: string, seeder: BaseSeeder) {
        /** 
         * the mode can be set from command line interface by writing `{tableName}` after the `seeders` 
         * script
         */
        const shouldRun = process.argv[2].split(',').includes(`${seederName}`)
    
        if (shouldRun) {
            try {
                await seeder.run()
                console.log(`[database] info: seeder ${seederName} successfully applied.`)
            } catch (e: any) {
                console.error(`[database] error: an error occurred during ${seederName} seeder running: ${e.message}`)
            }
        }
    }    
}
