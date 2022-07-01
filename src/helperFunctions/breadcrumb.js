const isRootPath = (path) =>
  String(path)
    .split("/")
    .filter((e) => e).length === 1;

export function replaceWithGenerics(generics, path) {
  let str = path;

  for (const [param, regexString] of Object.entries(generics)) {
    str = str.replace(`{${param}}`, regexString);
  }

  return isRootPath(str) ? `^${str}` : str;
}

export const pathParamsRegex = {
  id: `(\\w|\\d)+`,
};

export function predicateBreadcrumbFromUrl(pattern, url) {
  const breadcrumbs = [];

  for (const [title, path] of Object.entries(pattern)) {
    const regexStr = replaceWithGenerics(pathParamsRegex, path);
    const regex = new RegExp(regexStr, "i");
    if (regex.test(url)) {
      breadcrumbs.push(title);
    }
  }

  return breadcrumbs;
}
