import type { RedisClientType } from "@node-redis/client/dist/lib/client/index";
export interface IRedisSettings {
    host: string;
    port: number;
    password: string;
    timeout?: number;
    channel?: string;
}
export declare class Redis {
    protected _settings: IRedisSettings;
    protected _client: RedisClientType;
    constructor(settings: IRedisSettings);
    connect(): Promise<void>;
    /**
     *
     * @returns  All clients that received the message
     */
    publish(channel: string, message: string): Promise<number>;
    /**
     *
     * @returns All clients that received the message
     */
    send(message: string): Promise<number>;
}
export default Redis;
