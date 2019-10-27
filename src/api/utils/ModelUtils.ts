import { getQuery, getPageQuery, queryPromise } from 'api/utils/Utils';

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

// list data with pagination support
// return a promise for chaining. (e.g. list then transform)
export function listData(context: any, query: any, allowedFields: string[]) {
  const queryObj = getQuery(query, allowedFields); // allowed filter fields
  const { page = 1, perPage = 30, limit, offset, sort } = getPageQuery(query);

  // query.populate is an array like: ['author:_id,firstName', 'withUrlData:_id,url']
  const populateArr: any = [];
  if (query.populate) {
    query.populate.map((str: string) => {
      const arr = str.split(':');
      // only populate fields belong to "allowedFields"
      if (arr && arr.length === 2 && allowedFields.indexOf(arr[0]) >= 0) {
        populateArr.push({
          path: arr[0],
          select: arr[1].split(',')
        });
      }
    });
  }
  // console.log('--- query: ', query);
  // console.log('--- allowedFields: ', allowedFields);
  // console.log('--- populateArr: ', populateArr);
  // const populateArr = [
  //   {
  //     path: 'author',
  //     select: ['_id', 'firstName', 'lastName', 'category', 'avatarUrl']
  //   }
  // ];
  let result = context.find(queryObj).sort(sort);

  if (query.limit || query.perPage) {
    result
      .skip(typeof offset !== 'undefined' ? offset : perPage * (page - 1))
      .limit(typeof limit !== 'undefined' ? limit : perPage);
  }

  populateArr.forEach((item: any) => {
    result = result.populate(item);
  });

  const execRes = result.exec();
  return queryPromise(execRes);
}
