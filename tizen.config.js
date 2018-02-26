module.exports = {
  displayName: 'Transit Tracker',
  projectId: 'uk1A2xnaIo',
  signatureName: 'JohnCulviner',
  deviceIp: '192.168.50.89:26101',

  // https://developer.tizen.org/ko/development/training/web-application/understanding-tizen-programming/security-and-api-privileges
  // Section: Wearable Web API Privileges
  privileges: [
    'internet',
    'power'
  ],

  // https://developer.tizen.org/ko/development/training/web-application/understanding-tizen-programming/application-filtering?langredirect=1
  // Table: Available requirements for wearable Web Device APIs
  features: []
}