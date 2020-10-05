import limiter from './limiter';

function decorator(httpHandler) {
  return async (request, response) => {
    const next = () => httpHandler(request, response);
    /**
     * This could be anything, even a combination between ip and resources.
     */
    const key = request.connection.remoteAddress;

    try {
      await limiter.consume(key);
    } catch (e) {
      response.status(429).json({
        error: 'API Rate Limit',
        detail: `IP [${request.connection.remoteAddress}] cannot access resource`,
      });
      return;
    }

    next();
  };
}

export default decorator;
