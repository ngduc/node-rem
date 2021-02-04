import { getMongoQuery, getPageQuery, queryPromise } from '../../api/utils/Utils';

// transform every record (only respond allowed fields and "&fields=" in query)
export function transformData(context: any, query: any, allowedFields: string[]) {
  const queryParams = getPageQuery(query);
  const transformed: any = {};
  allowedFields.forEach((field: string) => {
    if (queryParams && queryParams.fields && queryParams.fields.indexOf(field) < 0) {
      return; // if "fields" is set => only include those fields, return if not.
    }
    transformed[field] = context[field];
  });
  return transformed;
}

// example: URL queryString = '&populate=author:_id,firstName&populate=withUrlData:_id,url'
// => queryArray = ['author:_id,firstName', 'withUrlData:_id,url']
// return array of fields we want to populate (MongoDB spec)
const getPopulateArray = (queryArray: [], allowedFields: string[]) => {
  if (!queryArray) {
    return [];
  }
  const ret: any[] = [];
  queryArray.map((str: string = '') => {
    const arr = str.split(':');
    // only populate fields belong to "allowedFields"
    if (arr && arr.length === 2 && allowedFields.indexOf(arr[0]) >= 0) {
      ret.push({
        path: arr[0],
        select: arr[1].split(',')
      });
    }
  });
  // example of returned array (MongoDB spec):
  // ret = [
  //   {
  //     path: 'author',
  //     select: ['_id', 'firstName', 'lastName', 'category', 'avatarUrl']
  //   }
  // ];
  return ret;
};

const queryPagination = (mongoQuery: any, query: any) => {
  const { page = 1, perPage = 30, limit, offset, sort } = getPageQuery(query);

  mongoQuery.sort(sort);

  // 2 ways to have pagination using: offset & limit OR page & perPage
  if (query.perPage) {
    mongoQuery.skip(perPage * (page - 1)).limit(perPage);
  }
  if (typeof offset !== 'undefined') {
    mongoQuery.skip(offset);
  }
  if (typeof limit !== 'undefined') {
    mongoQuery.limit(limit);
  }
};

// list data with pagination support
// return a promise for chaining. (e.g. list then transform)
export function listData(context: any, query: any, allowedFields: string[]) {
  const mongoQueryObj = getMongoQuery(query, allowedFields); // allowed filter fields

  // console.log('--- query: ', query);
  // console.log('--- allowedFields: ', allowedFields);
  // console.log('--- populateArr: ', query.populate);
  let result = context.find(mongoQueryObj);

  queryPagination(result, query);

  const queryPopulate = Array.isArray(query.populate) ? query.populate : [query.populate]; // to array.
  const populateArr = getPopulateArray(queryPopulate, allowedFields); // get Mongo-spec's populate array.
  populateArr.forEach((item: any) => {
    result = result.populate(item); // Mongo's populate() to populate nested object.
  });

  const execRes = result.exec();
  return queryPromise(execRes);
}
