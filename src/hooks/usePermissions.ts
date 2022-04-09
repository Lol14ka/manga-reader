import { Permission } from './dto/permission';
import useFunction from './useFunction';

export function usePermissions() {
  const [permissions, sendPermissions] = useFunction("usuario_permisos");

  function requestPermission(name: string, onFallBack: () => void) {
    if (permissions.success) {
      const userPermissions = permissions.response as Permission[];
      if (userPermissions.find((per) => per.clave == name) == undefined) {
        onFallBack();
      }
    }
  }

  function hasPermission(name: string) {
    if (permissions.success) {
      const userPermissions = permissions.response as Permission[];
      return !(userPermissions.find((per) => per.clave == name) == undefined);
    }
  }

  return [
    permissions,
    { requestPermission, hasPermission, sendPermissions },
  ] as const;
}

export default usePermissions;
