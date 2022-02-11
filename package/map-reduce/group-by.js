export function groupBy(list, cb) {
  const result = {};
  for (const item of list) {
    const bucketCategory = cb(item).toString();
    const bucket = result[bucketCategory];
    if (bucket) {
      result[bucketCategory].push(item);
    } else {
      result[bucketCategory] = [item];
    }
  }
  return result;
}
