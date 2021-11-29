import Pino from 'pino';

/**
 * Class to log application processes
 */
class Logger {
    static readonly logger = Pino({
        level: 'debug',
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: true,
                colorize: true
            }
        }
    });

    static debug(message: string): void {
        Logger.logger.debug(message);
    }

    static error(message: string): void {
        Logger.logger.error(message);
    }

    static info(message: string): void {
        Logger.logger.info(message);
    }

    static warn(message: string): void {
        Logger.logger.warn(message);
    }
}

export default Logger;
