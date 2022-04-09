export type ServerResponse = Object | string;

export interface SendRequestParams {
  data?: Object;
  callBack?: (res: ServerResponse) => Promise<void>;
}
