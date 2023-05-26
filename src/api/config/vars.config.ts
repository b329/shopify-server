export const DATA_SOURCES = {
    mySqlDataSource: {
        DB_HOST: process.env.MY_SQL_DB_HOST || '127.0.0.1',
        DB_USER: process.env.MY_SQL_DB_USER || 'root',
        DB_PASSWORD: process.env.MY_SQL_DB_PASSWORD || '1111',
        DB_PORT: process.env.MY_SQL_DB_PORT || 3315,
        DB_DATABASE: process.env.MY_SQL_DB_DATABASE || 'locations_system',
        DB_CONNECTION_LIMIT: process.env.MY_SQL_DB_CONNECTION_LIMIT ? parseInt(process.env.MY_SQL_DB_CONNECTION_LIMIT) : 4,
    }
};