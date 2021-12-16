import Redis from "../services/redis";
import * as CONFIG from "../../config";

export class RedisClient {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: CONFIG.SV_HOST,
      port: CONFIG.REDIS.PORT,
      password: CONFIG.REDIS.PASS,
      channel: CONFIG.REDIS.CHANNEL
    });
  }

  public async connect(): Promise<void> {
    await this.redis.connect();
  }

  public async publish(channel: string, message: string): Promise<number> {
    return await this.redis.publish(channel, message);
  }

  public async send(message: string): Promise<number> {
    return await this.redis.send(message);
  }
}

export default RedisClient;
