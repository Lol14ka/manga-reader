import { useRequest } from './useRequest';

export function useFunction(name: string) {
  return useRequest("execute/" + name);
}

export default useFunction;
