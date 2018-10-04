const mstime = require('mstime');
import { NextFunction, Request, Response, Router } from 'express';
import { ITEMS_PER_PAGE } from 'api/utils/Const';

export function startTimer(req: any) {
  mstime.start(req.originalUrl);
}

export function endTimer(req: any) {
  const end = mstime.end(req.originalUrl);
  if (end) {
    console.log(`avg time - ${end.avg} (ms)`);
    return end;
  }
  return null;
}

// from "sort" string (URL param) => build sort object (mongoose), e.g. "sort=name:desc,age"
export function getSortQuery(sortStr: string, defaultKey = 'createdAt') {
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
}

// from "req" (req.query) => transform to: query object, e.g. { limit: 5, sort: { name: 1 } }
export function getPageQuery(reqQuery: any) {
  const output: any = {};
  if (reqQuery.page) {
    output.perPage = reqQuery.perPage || ITEMS_PER_PAGE; // if page is set => take (or set default) perPage
  }

  const numParams = ['page', 'perPage', 'limit', 'offset'];
  numParams.forEach(field => {
    if (reqQuery[field]) {
      output[field] = parseInt(reqQuery[field], 10);
    }
  });
  output.sort = getSortQuery(reqQuery.sort, 'createdAt');
  return output;
}

// function to decorate a promise with useful helpers like: .transform(), etc.
// @example: return queryPromise( this.find({}) )
export function queryPromise(mongoosePromise: any) {
  return new Promise(async resolve => {
    const items = await mongoosePromise;

    // decorate => transform() on the result
    items.transform = () => items.map((item: any) => (item.transform ? item.transform() : item));
    resolve(items);
  });
}

type apiJsonTypes = {
  req: Request;
  res: Response;
  data: any | any[]; // data can be object or array
  model?: any; // e.g. "listModal: User" to get meta.totalCount (User.countDocuments())
  meta?: any;
  json?: boolean; // retrieve JSON only (won't use res.json(...))
};
/**
 * prepare a standard API Response, e.g. { meta: {...}, data: [...], errors: [...] }
 * @param param0
 */
export async function apiJson({ req, res, data, model, meta = {}, json = false }: apiJsonTypes) {
  const queryObj = getPageQuery(req.query);
  const metaData = { ...queryObj, ...meta };

  if (model) {
    // if pass in "model" => query for totalCount & put in "meta"
    const isPagination = req.query.limit || req.query.page;
    if (isPagination && model.countDocuments) {
      const totalCount = await model.countDocuments();
      metaData.totalCount = totalCount;
      if (queryObj.perPage) {
        metaData.pageCount = Math.ceil(totalCount / queryObj.perPage);
      }
    }
  }
  // add Timer data
  const timer = endTimer(req);
  if (timer) {
    metaData.timer = timer.last;
    metaData.timerAvg = timer.avg;
  }
  console.log(111, timer);

  const output = { data, meta: metaData };
  if (json) {
    return output;
  }
  return res.json(output);
}
