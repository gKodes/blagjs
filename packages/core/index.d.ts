export interface URLMatch {
  host: string;
  pathname: string;
  hash: string;
  protocol: string;
  query: object;
}

export interface RequestOptions {
  url: string;
  method: string;
  baseURL: string;
  headers: Object;
  params: Object;
  data: Object | string;
  type: 'default' | 'xhr' | 'fetch';
}
