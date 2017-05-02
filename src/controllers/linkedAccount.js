const SessionOptions = require('drequest-maxdome').SessionOptions;

module.exports = ({ maxdome, redis }) =>
  ['post', ['/linkedAccount', require('body-parser').json(), async (req, res) => {
    try {
      const accessToken = req.body.accessToken;
      if (!accessToken) {
        throw new Error('missing accessToken');
      }
      const linkedAccount = await redis.getJSON(accessToken);
      if (!linkedAccount) {
        throw new Error('incorrect accessToken');
      }
      try {
        await maxdome.post('v1/auth/keepalive', new SessionOptions(linkedAccount));
        res.status(200).send(linkedAccount);
      } catch (e) {
        const data = await maxdome.post('v1/autologin_portal', {
          body: { autoLoginPin: linkedAccount.autoLoginPin },
        });
        const newLinkedAccount = {
          autoLoginPin: data.autoLoginPin,
          customer: { customerId: data.customer.customerId },
          sessionId: data.sessionId,
        };
        await redis.setJSON(accessToken, newLinkedAccount);
        res.status(200).send(newLinkedAccount);
      }
    } catch (e) {
      res.status(403).send();
    }
  }]];
