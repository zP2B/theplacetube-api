'use strict'
let assert = require('assert');

module.exports = function (Video) {
  Video.initFromYoutubeCollection = function(records, skipNotLocated = true) {
    let serialized = [];
    for (let i = 0; i < records.items.length; i++) {
      console.log(records.items[i]);
      if (!skipNotLocated || (records.items[i].recordingDetails && records.items[i].recordingDetails.location.longitude && records.items[i].recordingDetails.location.longitude)) {
        console.log('e');
        serialized.push(this.initFromYoutube(records.items[i]));
      }
    }
    return serialized;
  };

  /**
   * @param record Search Resource youtube#searchResult
   * @returns {{youtubeId: string, title: string, description: (*|string|description|{type, trim}|string|string), tags: string, place: {name: string, city: string, state: string, country: string, location: {type: string, coordinates: [null,null]}}, publisher: {username: string, place: string, avatar: string}, date: string, owner: boolean}}
   */
  Video.initFromYoutube = function(record) {
    assert.equal(record.kind, 'youtube#video', 'Unexpected object in youtube to video serializer');
    return new Video({
      'youtubeId': record.id,
      'title': record.snippet.title,
      'description': record.snippet.description,
      'category_id': record.snippet.categoryId,
      'tags': record.snippet.tags,
      'date': record.snippet.publishedAt,
      'author': record.snippet.channelTitle,
      'location': {
        'lat': record.recordingDetails.location.latitude,
        'lng': record.recordingDetails.location.longitude
      }
    });
  }
}
