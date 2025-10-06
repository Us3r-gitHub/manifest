import { Injectable } from '@nestjs/common'
import { ThrottlerGuard, ThrottlerRequest } from '@nestjs/throttler'
import { Request } from 'express'

// See: https://github.com/nestjs/throttler/blob/v6.4.0/src/throttler.guard.ts#L148-L200
@Injectable()
export class TenantBasedThrottlerGuard extends ThrottlerGuard {
  /**
   * Throttles incoming HTTP requests.
   * All the outgoing requests will contain RFC-compatible RateLimit headers.
   * @see https://tools.ietf.org/id/draft-polli-ratelimit-headers-00.html#header-specifications
   * @throws {ThrottlerException}
   */
  protected async handleRequest(
    requestProps: ThrottlerRequest
  ): Promise<boolean> {
    const {
      context,
      limit,
      ttl,
      throttler,
      blockDuration,
      getTracker,
      generateKey
    } = requestProps

    // Here we start to check the amount of requests being done against the ttl.
    const { req, res } = this.getRequestResponse(context)
    const ignoreUserAgents =
      throttler.ignoreUserAgents ?? this.commonOptions.ignoreUserAgents
    // Return early if the current user agent should be ignored.
    if (Array.isArray(ignoreUserAgents)) {
      for (const pattern of ignoreUserAgents) {
        if (pattern.test(req.headers['user-agent'])) {
          return true
        }
      }
    }
    const tracker = await getTracker(req, context)
    const key = generateKey(context, tracker, throttler.name)
    const { totalHits, timeToExpire, isBlocked, timeToBlockExpire } =
      await this.storageService.increment(
        key,
        ttl,
        limit,
        blockDuration,
        throttler.name
      )

    const getThrottlerSuffix = (name: string) =>
      name === 'default' ? '' : `-${name}`

    // Throw an error when the user reached their limit.
    if (isBlocked) {
      res.header(
        `Retry-After${getThrottlerSuffix(throttler.name)}`,
        timeToBlockExpire
      )
      await this.throwThrottlingException(context, {
        limit,
        ttl,
        key,
        tracker,
        totalHits,
        timeToExpire,
        isBlocked,
        timeToBlockExpire
      })
    }

    res.header(
      `${this.headerPrefix}-Limit${getThrottlerSuffix(throttler.name)}`,
      limit
    )
    // We're about to add a record so we need to take that into account here.
    // Otherwise the header says we have a request left when there are none.
    res.header(
      `${this.headerPrefix}-Remaining${getThrottlerSuffix(throttler.name)}`,
      Math.max(0, limit - totalHits)
    )
    res.header(
      `${this.headerPrefix}-Reset${getThrottlerSuffix(throttler.name)}`,
      timeToExpire
    )

    return true
  }
}
