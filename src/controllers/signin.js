const shortid = require('shortid');

module.exports = ({ maxdome, redis }) => [
  ['get', ['/signin', async (req, res) => {
    res.sendFile('signin.html', { root: `${__dirname}/../../views/` });
  }]],
  ['post', ['/signin', require('body-parser').urlencoded({ extended: false }), async (req, res) => {
    try {
      const data = await maxdome.post('v1/auth/login', {
        body: {
          userId: req.body.email,
          phrase: req.body.password,
          autoLogin: true,
        },
      });
      const token = shortid.generate();
      const linkedAccount = {
        autoLoginPin: data.autoLoginPin,
        customer: { customerId: data.customer.customerId },
        sessionId: data.sessionId,
      };
      await redis.setJSON(token, linkedAccount);
      res.status(200).send({ token });
    } catch (e) {
      res.status(403).send();
    }
  }]],
];
