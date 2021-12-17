import * as NodeRedis from "redis";
import type { modules } from "redis";
import type { RedisClientType } from "@node-redis/client/dist/lib/client/index";
import * as logger from "../lib/logger";

enum ERRORS {
  ENOINIT = "Redis not initialized",
  ECONNECT = "Redis connection error",
}

export interface IRedisSettings {
  host: string;
  port: number;
  password: string;
  timeout?: number;

  channel?: string;
}

export class Redis {
  protected _settings: IRedisSettings;
  protected _client: RedisClientType<typeof modules>;

  constructor(settings: IRedisSettings) {
    this._settings = settings;
    this._client = NodeRedis.createClient({
      url: `redis://${this._settings.host}:${this._settings.port}`,
      password: this._settings.password,
    });
  }

  public async connect(): Promise<void> {
    if (!this._client) {
      throw new Error(ERRORS.ENOINIT);
    }

    try {
      await this._client.connect();
      logger.log("Redis connected");
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  /**
   * 
   * @returns  All clients that received the message
   */
  public async publish(channel: string, message: string): Promise<number> {
    return await this._client.publish(channel, message)
  }

  /**
   * 
   * @returns All clients that received the message
   */
  public async send(message: string): Promise<number> {
    if (!this._client) {
      throw new Error(ERRORS.ENOINIT);
    }

    if (!this._settings.channel) {
      throw new Error(ERRORS.ENOINIT);
    }

    try {
      return await this.publish(this._settings.channel, message);
    } catch (e) {
      logger.error(ERRORS.ECONNECT);
    }
  }
}

export default Redis;
