const Const = require('api/utils/Const');

// from "sort" string (URL param) => build sort object (mongoose), e.g. "sort=name:desc,age"
exports.getSortQuery = (sortStr, defaultKey = 'createdAt') => {
  let arr = [sortStr || defaultKey];
  if (sortStr && sortStr.indexOf(',')) {
    arr = sortStr.split(',');
  }
  let ret = {};
  for (let i = 0; i < arr.length; i += 1) {
    let order = 1; // default: ascending (a-z)
    let keyName = arr[i].trim();
    if (keyName.indexOf(':') >= 0) {
      const [keyStr, orderStr] = keyName.split(':'); // e.g. "name:desc"
      keyName = keyStr.trim();
      order = orderStr.trim() === 'desc' || orderStr.trim() === '-1' ? -1 : 1;
    }
    ret = { ...ret, [keyName]: order };
  }
  return ret;
};

// from "req" (req.query) => transform to: query object, e.g. { limit: 5, sort: { name: 1 } }
exports.getPageQuery = reqQuery => {
  const output = {};
  if (reqQuery.page) {
    output.perPage = reqQuery.perPage || Const.ITEMS_PER_PAGE; // if page is set => take (or set default) perPage
  }

  const numParams = ['page', 'perPage', 'limit', 'offset'];
  numParams.forEach(field => {
    if (reqQuery[field]) {
      output[field] = parseInt(reqQuery[field], 10);
    }
  });
  output.sort = this.getSortQuery(reqQuery.sort, 'createdAt');
  return output;
};

// prepare a standard API Response, e.g. { meta: {...}, data: [...], errors: [...] }
exports.buildResponse = async ({ req, data, meta, listModel }) => {
  const queryObj = this.getPageQuery(req.query);
  const metaData = { ...queryObj, ...meta };
  if (listModel) {
    // if pass in "listModel" => query for totalCount & put in "meta"
    const isPagination = req.query.limit || req.query.page;
    if (isPagination && listModel.countDocuments) {
      const totalCount = await listModel.countDocuments();
      metaData.totalCount = totalCount;
      if (queryObj.perPage) {
        metaData.pageCount = Math.ceil(totalCount / queryObj.perPage);
      }
    }
  }
  return { meta: metaData, data };
};

// e.g. return Utils.queryPromise( this.find(options) )
exports.queryPromise = promise =>
  new Promise(async resolve => {
    const items = await promise;

    // decorate => transform() on the result
    items.transform = () => items.map(item => (item.transform ? item.transform() : item));
    resolve(items);
  });
