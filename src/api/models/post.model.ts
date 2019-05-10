export {};
const mongoose = require('mongoose');
import { transformData, listData } from 'api/utils/ModelUtils';

const schema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
    type: String, // twitter, facebook, etc.
    extPostId: { type: String, index: { unique: true } },
    extAuthorId: String,
    title: String,
    subtitle: String,
    imageUrl: String,
    imageLinkUrl: String,
    content: String,
    likes: { type: Number, default: 0 },
    postedAt: Date, // author's posted time
    createdAt: { type: Date, default: Date.now } // db record createdAt (inserted time)
  },
  { timestamps: true }
);
const ALLOWED_FIELDS = ['id', 'author', 'type', 'title', 'likes', 'postedAt', 'createdAt'];

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

const Model = mongoose.model('Post', schema);
Model.ALLOWED_FIELDS = ALLOWED_FIELDS;

module.exports = Model;
