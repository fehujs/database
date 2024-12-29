![Fehujs](https://raw.githubusercontent.com/fehujs/logos/refs/heads/main/fehu-banner.png)

# @fehujs/database

This module permits you to interact with a database, to handle your migrations and your models.

For now on, only the SQLite database provider is implemented, but you can implement other providers on your own using the API (more info at the bottom of this file).

It uses [Knex](https://knexjs.org/) under the hood, but maybe I'll create a homemade SQL query builder (one day).

Please note that foreign keys aren't planned to be implemented. If you want to link two tables create a field in the first one that contains the second table primary key.

DISCLAIMER: some features are not fully available or tested (alter table, findByWithSQL, SQL injection avoider), please consider test them yourselves before using these features.

Note: you can install the SQLite Viewer VS code extension (from Florian Klampfer) to view your database directly from the IDE.

[Documentation](https://fehujs.github.io/docs/modules/database)

Licence: [MIT](https://github.com/fehujs/database/blob/main/LICENSE)
