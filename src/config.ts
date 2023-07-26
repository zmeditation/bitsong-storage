import dotenv from 'dotenv'

type ConfigType = {
  keepAliveTimeout: number
  headersTimeout: number
  fileSizeLimit: number
  logLevel?: string
  ipfsHost: string
  ipfsPort: number
  ipfsProtocol: string
  ipfsApiKey: string
  port: number
  host: string
  enableDefaultMetrics: boolean
  enableRateLimiter: boolean
  rateLimiterDriver: 'memory' | 'redis' | string
  rateLimiterRedisUrl?: string
  rateLimiterSkipOnError?: boolean
  rateLimiterRenderPathMaxReqSec: number
  rateLimiterRedisConnectTimeout: number
  rateLimiterRedisCommandTimeout: number
  requestIdHeader?: string
}

function getOptionalConfigFromEnv(key: string): string | undefined {
  return process.env[key]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getConfigFromEnv(key: string): string {
  const value = getOptionalConfigFromEnv(key)
  if (!value) {
    throw new Error(`${key} is undefined`)
  }
  return value
}

export function getConfig(): ConfigType {
  dotenv.config()

  return {
    keepAliveTimeout: parseInt(getOptionalConfigFromEnv('KEEP_ALIVE_TIMEOUT') || '61', 10),
    headersTimeout: parseInt(getOptionalConfigFromEnv('HEADERS_TIMEOUT') || '65', 10),
    fileSizeLimit: Number(getOptionalConfigFromEnv('FILE_SIZE_LIMIT') || 52428800),
    logLevel: getOptionalConfigFromEnv('LOG_LEVEL') || 'info',
    ipfsHost: getOptionalConfigFromEnv('IPFS_HOST') || 'localhost',
    ipfsPort: parseInt(getOptionalConfigFromEnv('IPFS_PORT') || '5001', 10),
    ipfsProtocol: getOptionalConfigFromEnv('IPFS_PROTOCOL') || 'http',
    ipfsApiKey: getConfigFromEnv('IPFS_API_KEY'),
    host: getOptionalConfigFromEnv('HOST') || '0.0.0.0',
    port: Number(getOptionalConfigFromEnv('PORT')) || 5000,
    enableDefaultMetrics: process.env.ENABLE_DEFAULT_METRICS === 'true',
    enableRateLimiter: process.env.ENABLE_RATE_LIMITER === 'true',
    rateLimiterDriver: getOptionalConfigFromEnv('RATE_LIMITER_DRIVER') || 'memory',
    rateLimiterRedisUrl: getOptionalConfigFromEnv('RATE_LIMITER_REDIS_URL'),
    rateLimiterSkipOnError: process.env.RATE_LIMITER_SKIP_ON_ERROR === 'true',
    rateLimiterRenderPathMaxReqSec: parseInt(
      getOptionalConfigFromEnv('RATE_LIMITER_REDIS_PATH_MAX_REQ_SEC') || '5',
      10
    ),
    rateLimiterRedisConnectTimeout: parseInt(
      getOptionalConfigFromEnv('RATE_LIMITER_REDIS_CONNECT_TIMEOUT') || '2',
      10
    ),
    rateLimiterRedisCommandTimeout: parseInt(
      getOptionalConfigFromEnv('RATE_LIMITER_REDIS_COMMAND_TIMEOUT') || '2',
      10
    ),
    requestIdHeader: getOptionalConfigFromEnv('REQUEST_ID_HEADER'),
  }
}
