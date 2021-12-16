export declare class RedisClient {
    private redis;
    constructor();
    connect(): Promise<void>;
    publish(channel: string, message: string): Promise<number>;
    send(message: string): Promise<number>;
}
export default RedisClient;
