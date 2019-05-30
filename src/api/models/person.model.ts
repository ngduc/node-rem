export {};
const mongoose = require('mongoose');
import { transformData, listData } from 'api/utils/ModelUtils';

const schema = new mongoose.Schema(
  {
    category: String,
    firstName: String,
    middleName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    bio: { type: String, default: '' },
    githubId: { type: String, default: '' },
    twitterId: { type: String, default: '' },
    facebookId: { type: String, default: '' },
    linkedinId: { type: String, default: '' },
    instagramId: { type: String, default: '' },
    company: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    blogUrl: { type: String, default: '' },
    email: { type: String, default: '' },
    lastPostText: { type: String, default: '' }, // excerpt text of the last post
    lastPostTime: { type: Date, default: Date.now },
    lastFetch: { type: Date, default: Date.now },
    avgPerDay: { type: Number, default: 0 },
    avgPerWeek: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    addedBy: { type: [String], default: [] }, // array of clientUuids who added this person, so it's only visible to those.
    isPublic: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);
const ALLOWED_FIELDS = ['_id', 'category', 'firstName', 'lastName', 'avatarUrl', 'bio', 'twitterId'];

schema.method({
  // query is optional, e.g. to transform data for response but only include certain "fields"
  transform({ query = {} }: { query?: any } = {}) {
    // transform every record (only respond allowed fields and "&fields=" in query)
    return transformData(this, query, ALLOWED_FIELDS);
  }
});

schema.statics = {
  list({ query }: { query: any }) {
    return listData(this, query, ALLOWED_FIELDS);
  }
};

const Model = mongoose.model('Person', schema);
Model.ALLOWED_FIELDS = ALLOWED_FIELDS;

module.exports = Model;
