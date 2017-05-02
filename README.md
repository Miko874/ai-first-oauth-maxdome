[![Dependency Status](https://david-dm.org/dragonprojects/ai-oauth-maxdome.svg)](https://david-dm.org/dragonprojects/ai-oauth-maxdome)
[![devDependency Status](https://david-dm.org/dragonprojects/ai-oauth-maxdome/dev-status.svg)](https://david-dm.org/dragonprojects/ai-oauth-maxdome?type=dev)

OAuth 2.0 connector for the implicit workflow which generates tokens for stored maxdome sessions and provide getting customer information. 


# Documentation

## Setup for `api.ai`

![](https://raw.githubusercontent.com/dragonprojects/ai-oauth-maxdome/master/docs/api.ai.png)

* `Client ID` and `Client Secret` will be ignored
* Supported `Grant type` is `Implicit`
* `Authorization URL` is the URL to the deployed service with the path `/signin`

## Get the `linkedAccount` by the token

```javascript
const Request = require('drequest').Request;

const linkedAccount = async (accessToken) => {
  if (!accessToken) {
    return;
  }
  return await new Request().post('https://ai-oauth-maxdome.herokuapp.com/linkedAccount', { body: { accessToken } });
};
```

### `linkedAccount` structure

```javascript
const linkedAccount = {
  autoLoginPin: 'autoLoginPin',
  customer: { customerId: 'customerId' },
  sessionId: 'sessionId',
}
```

* `autoLoginPin`: Can be ignored, will be used by the service during the `/linkedAccount` to renew the session
* `customerId` and `sessionId` are needed to make a sessioned Heimdall request

## Use the `linkedAccount` for Heimdall requests, e.g. add an asset to the notepad

```javascript
const maxdome = require('drequest-maxdome').getRequestBuilder();
const SessionOptions = require('drequest-maxdome').SessionOptions;

const assetId = 'assetId';

await maxdome.post('v1/mxd/notepad/%customerId%', [
  { body: { contentId: assetId } },
  new SessionOptions(linkedAccount),
]);
```
