export {};
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cacheSchema = new Schema(
  {
    type: String,
    query: Object,
    response: Object,
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const DBCache = mongoose.model('DBCache', cacheSchema);

DBCache.cache = async (type: string, query: any, response: any) => {
  const cacheItem = {
    type,
    query,
    response
  };
  return await new DBCache(cacheItem).save();
};

export default DBCache;
