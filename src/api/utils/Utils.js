class Utils {
  static getSortQuery(sortStr, defaultKey = 'createdAt') {
    let arr = [sortStr || defaultKey];
    if (sortStr && sortStr.indexOf(',')) {
      arr = sortStr.split(',');
    }
    let ret = {};
    for (let i = 0; i < arr.length; i += 1) {
      let order = 1; // default: ascending (a-z)
      let keyName = arr[i];
      if (keyName.indexOf(':')) {
        const [keyStr, orderStr] = keyName.split(':'); // e.g. "name:desc"
        keyName = keyStr;
        order = orderStr === 'desc' || orderStr === '-1' ? -1 : 1;
      }
      ret = { ...ret, [keyName]: order };
    }
    return ret;
  }

  // from "req" (req.query) => transform to: query object, e.g. { limit: 5, sort: { name: 1 } }
  static getPageQuery(reqQuery) {
    const output = {};
    const numParams = ['page', 'perPage', 'limit', 'offset'];
    numParams.forEach(field => {
      if (reqQuery[field]) {
        output[field] = parseInt(reqQuery[field], 10);
      }
    });
    output.sort = Utils.getSortQuery(reqQuery.sort, 'createdAt');
    return output;
  }

  // prepare a standard API Response, e.g. { meta: {...}, data: [...], errors: [...] }
  static async buildResponse({ req, data, meta, listEntity }) {
    const metaData = { ...Utils.getPageQuery(req.query), ...meta };
    if (listEntity) {
      // if pass in "listEntity" => query for totalCount & put in "meta"
      if (req.query.limit && listEntity.count) {
        metaData.totalCount = await listEntity.count();
      }
    }
    return { meta: metaData, data };
  }
}

module.exports = Utils;
