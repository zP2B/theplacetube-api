'use strict';

const google = require('googleapis');
const youtube = google.youtube('v3');
let nconf = require('nconf');
nconf
  .argv()
  .env()
  .file({file: './config.json'});

if (!(nconf.get('google_api_key'))) {
  throw new Error('No google api key provided');
}

/**
 * QUOTA IMPACT: 100
 * @param params
 */
exports.getVideosIds = function(params) {
  return new Promise((resolve, reject) => {
    youtube.search.list(
      Object.assign(
        {
          auth: nconf.get('google_api_key'),
          fields: 'items(id/videoId),nextPageToken,pageInfo',
          maxResults: '50',
          order: 'viewCount',
          part: 'snippet',
          type: 'video',
          safeSearch: 'none',
          videoEmbeddable: true
        },
        params
      ),
      function(err, res) {
        return (err) ? reject(err) : resolve(res);
      }
    );
  });
};

/**
 * QUOTA IMPACT: 5
 * @param id
 */
exports.getVideosFromIds = function(id) {
  return new Promise((resolve, reject) => {
    youtube.videos.list(
      {
        auth: nconf.get('google_api_key'),
        part: 'recordingDetails,snippet',
        id: id
      },
      function(err, res) {
        return (err) ? reject(err) : resolve(res);
      }
    );
  });
};

exports.getVideos = function(latitude, longitude, radius, params) {
  const youtubeParams = Object.assign(
    {location: latitude + ',' + longitude, locationRadius: radius + 'm'},
    params
  );

  return this.getVideosIds(youtubeParams)
    .then(function(searchList) {
      let videoId = [];
      searchList.items.map(function(item) {
        videoId.push(item.id.videoId);
      });
      let res = {};
      return this.getVideosFromIds(videoId.join(',')).then(function(videos) {
        res.nextPageToken = searchList.nextPageToken;
        res.pageInfo = searchList.pageInfo;
        res.videos = videos;
        return res;
      });
    }.bind(this));
};
