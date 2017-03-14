const SessionOptions = require('drequest-maxdome').SessionOptions;

module.exports = ({ maxdome, redis }) => [
  ['post', ['/linkedAccount', require('body-parser').json(), async (req, res) => {
    try {
      const token = req.body.token;
      if (!token) {
        throw new Error('missing token');
      }
      const linkedAccount = await redis.getJSON(token);
      if (!linkedAccount) {
        throw new Error('incorrect token');
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
        await redis.setJSON(token, newLinkedAccount);
        res.status(200).send(newLinkedAccount);
      }
    } catch (e) {
      res.status(403).send();
    }
  }]],
];
