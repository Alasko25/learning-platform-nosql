const db = require('../db');
const { MongoClient } = require('mongodb');
const redis = require('redis');

jest.mock('mongodb');
jest.mock('redis');

describe('Database connection tests', () => {
  beforeAll(() => {
    // Configurer les mocks avant de commencer les tests
    MongoClient.prototype.connect = jest.fn().mockResolvedValue(true);
    redis.createClient.mockReturnValue({
      connect: jest.fn().mockResolvedValue(true),
      quit: jest.fn().mockResolvedValue(true),
    });
  });

  it('should successfully connect to MongoDB', async () => {
    await db.connectMongo();
    expect(MongoClient.prototype.connect).toHaveBeenCalled();
  });

  it('should successfully connect to Redis', async () => {
    await db.connectRedis();
    expect(redis.createClient).toHaveBeenCalled();
  });

  it('should throw error if MongoDB connection fails', async () => {
    MongoClient.prototype.connect = jest.fn().mockRejectedValue(new Error('MongoDB error'));
    await expect(db.connectMongo()).rejects.toThrow('MongoDB connection failed during tests');
  });

  it('should throw error if Redis connection fails', async () => {
    redis.createClient.mockReturnValue({
      connect: jest.fn().mockRejectedValue(new Error('Redis error')),
    });
    await expect(db.connectRedis()).rejects.toThrow('Redis connection failed during tests');
  });
});
