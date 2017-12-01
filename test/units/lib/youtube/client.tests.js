const assert = require('assert');
const youtubeClient = require('../../../../server/lib/youtube/client');

describe('Youtube Client Lib', function() {
  describe('#getVideos', function() {
    it('should returns videos', function() {
      this.timeout(0);
      return youtubeClient.getVideos({latitude: 200, longitude: 400}).then(function (res) {
        assert.ok(res.nextPageToken);
      });
    });
  });
});
