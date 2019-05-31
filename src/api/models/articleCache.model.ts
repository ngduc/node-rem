export {};
const mongoose = require('mongoose');
import { transformData, listData } from 'api/utils/ModelUtils';

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    url: String,
    response: Object,
    createdAt: { type: Date, default: Date.now },
    size: { type: Number, default: 0 }
  },
  { timestamps: true }
);
const ALLOWED_FIELDS = ['_id', 'user', 'url', 'response', 'size', 'createdAt'];

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

const Model = mongoose.model('ArticleCache', schema);
Model.ALLOWED_FIELDS = ALLOWED_FIELDS;

module.exports = Model;
