export {};
const mongoose = require('mongoose');
import { transformData, listData } from '../../api/utils/ModelUtils';

const userNoteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, default: '' },
    note: String,
    likes: { type: Number, default: 0 }
  },
  { timestamps: true }
);
const ALLOWED_FIELDS = ['id', 'user', 'title', 'note', 'likes', 'createdAt'];

userNoteSchema.method({
  // query is optional, e.g. to transform data for response but only include certain "fields"
  transform({ query = {} }: { query?: any } = {}) {
    // transform every record (only respond allowed fields and "&fields=" in query)
    return transformData(this, query, ALLOWED_FIELDS);
  }
});

userNoteSchema.statics = {
  list({ query }: { query: any }) {
    return listData(this, query, ALLOWED_FIELDS);
  }
};

const Model = mongoose.model('UserNote', userNoteSchema);
Model.ALLOWED_FIELDS = ALLOWED_FIELDS;

module.exports = Model;
