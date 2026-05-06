export function validateEnv(config: Record<string, unknown>){
    const requiredVars = [
        'PORT',
        'DATABASE_URL',
        'MONGO_URI',
        'REDIS_HOST',
        'REDIS_PORT',
        'JWT_SECRET',
        'JWT_EXPIRES_IN',
        'EMAIL_USER',
        'EMAIL_PASS'
    ];

    for (const key of requiredVars) {
        if (!config[key]) {
            throw new Error(`Missing environment variable: ${key}`);
        }
    };

    return config;

}