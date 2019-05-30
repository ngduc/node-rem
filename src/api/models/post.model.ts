export {};
const mongoose = require('mongoose');
import { transformData, listData } from 'api/utils/ModelUtils';

// import { getQuery, getPageQuery, queryPromise } from 'api/utils/Utils';

const schema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
    authorFullName: String,
    authorCategory: String,
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
const ALLOWED_FIELDS = [
  '_id',
  'author',
  'authorFullName',
  'authorCategory',
  'type',
  'title',
  'likes',
  'postedAt',
  'createdAt'
];

// schema.pre('find', function(next: any) {
//   this.populate('author');
//   next();
// });

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

    // const queryObj = getQuery(query, ALLOWED_FIELDS); // allowed filter fields
    // const { page = 1, perPage = 30, limit, offset, sort } = getPageQuery(query);

    // // TODO: support "&populate=author:id,firstName,lastName&populate=more..."
    // const populateArr = [
    //   {
    //     path: 'author',
    //     select: ['id', 'firstName', 'lastName', 'category', 'avatarUrl']
    //   }
    // ];

    // let result = this.find(queryObj)
    //   .sort(sort)
    //   .skip(typeof offset !== 'undefined' ? offset : perPage * (page - 1))
    //   .limit(typeof limit !== 'undefined' ? limit : perPage);

    // populateArr.forEach(item => {
    //   result = result.populate(item);
    // });

    // const execRes = result.exec();
    // return queryPromise(execRes);
  }
};

const Model = mongoose.model('Post', schema);
Model.ALLOWED_FIELDS = ALLOWED_FIELDS;

module.exports = Model;
