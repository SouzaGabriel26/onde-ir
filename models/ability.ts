import type { UserDataSource } from '@/data/user';
import { user } from '@/models/user';
import { operationResult } from '@/utils/operationResult';

export const ability = Object.freeze({
  hasPermissionTo,
});

type AbilityTypes = 'read' | 'create' | 'delete' | 'update' | 'manage_all';

type HasPermissionToProps = { userId: string; ability: AbilityTypes };

async function hasPermissionTo(
  userDataSource: UserDataSource,
  { userId, ability }: HasPermissionToProps,
) {
  const { data, error } = await user.findById(userDataSource, {
    id: userId,
    select: ['userRole'],
  });

  if (error) return error;

  if (!data) {
    return operationResult.failure({
      message: 'Usuário não encontrado.',
    });
  }

  const { userRole } = data;

  if (permissions[userRole!].includes(ability)) {
    return operationResult.success({});
  }

  return operationResult.failure({
    message: 'Permissão negada.',
  });
}

const userPermissions = ['read', 'create', 'delete', 'update'];
const adminPermissions = ['read', 'create', 'delete', 'update', 'manage_all'];

const permissions = {
  USER: userPermissions,
  ADMIN: adminPermissions,
};
