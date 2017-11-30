'use strict';
const youtubeClient = require('../lib/youtube/client');

module.exports = function(Videoslist) {
  /**
   * Allow to get videos by location and radius from youtube
   * @param {number} latitude latitude of geolocation
   * @param {number} longitude longitude of geolocation
   * @param {number} radius distance from geolocation provided
   * @param {Function(Error, array)} callback
   */
  Videoslist.search = function (latitude, longitude, radius, callback) {
    youtubeClient.getVideos(latitude, longitude, radius)
      .then(function (res){
        const videosYoutube = res.videos;
        const nextPageToken = res.nextPageToken;
        const pageInfo = res.pageInfo;
        const videos = Videoslist.app.models.Video.initFromYoutubeCollection(videosYoutube);
        console.log(videos);

        const videosList = {
          videos: Videoslist.app.models.Video.initFromYoutubeCollection(videosYoutube),
          nextPageToken: nextPageToken,
          pageInfo: pageInfo
        }
        console.log(videosList.nextPageToken);
        return callback(null, videosList)
      })
      .catch(function (error) {
        return callback(error)
      })
  }
};
