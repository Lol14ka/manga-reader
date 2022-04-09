import { useState } from 'react';

import config from '../../config';
import { scan } from '../utils/firebase';
import { getToken } from '../utils/store';
import { SendRequestParams, ServerResponse } from './interfaces/useRequest';

export function useRequest(endpoint: string, endpointOptions?: RequestInit) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState(false);
  const [response, setResponse] = useState<ServerResponse>();

  async function send(params?: SendRequestParams) {
    let response;

    if (error) setError(undefined);
    if (!isLoading) setIsLoading(true);
    if (success) setSuccess(false);
    if (response) setResponse(undefined);

    try {
      let body = "";
      if (params?.data) {
        const scanned = await scan(params.data);
        body = JSON.stringify(scanned);
      }
      const token = await getToken();
      const headers = new Headers();
      headers.set("Content-Type", "application/json");
      if (token) headers.set("Authorization", token);
      const url = config.server + `/${endpoint}`;
      const options: RequestInit = {
        body,
        method: "POST",
        headers,
        ...endpointOptions,
      };
      const res = await fetch(url, options);
      const data = await res.text();
      if (res.status == 200) {
        let parsed: ServerResponse;
        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = data;
        }
        if (params?.callBack) {
          await params.callBack(parsed);
        }
        response = parsed;
        setResponse(parsed);
        setSuccess(true);
      } else {
        throw new Error(data);
      }
    } catch (e) {
      const error = e as Error;
      setError(error.message);
    } finally {
      setIsLoading(false);
    }

    return response;
  }

  return [{ isLoading, error, success, response }, send] as const;
}

export default useRequest;
