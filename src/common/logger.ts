
export class Logger {

    /**
     * Common logger to log all related warnings or errors
     * @param message message to log
     */
    static Log(...message: string[]) {
        if (process.env.NODE_ENV === 'dev')
            console.log(message);
    }
}