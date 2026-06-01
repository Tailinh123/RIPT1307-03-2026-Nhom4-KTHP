import type { AuthUser } from '../types/auth.types';

type UnknownRecord = Record<string, unknown>;

function pickString(source: UnknownRecord, keys: string[]) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }

  return '';
}

function pickNumber(source: UnknownRecord, keys: string[]) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'number') {
      return value;
    }
  }

  return undefined;
}

export function extractAccessToken(payload: unknown) {
  if (typeof payload === 'string') {
    return payload;
  }

  if (typeof payload !== 'object' || payload === null) {
    return '';
  }

  const data = payload as UnknownRecord;

  return pickString(data, ['accessToken', 'access_token', 'token', 'jwt']);
}

export function extractUserFromAuthPayload(payload: unknown) {
  if (typeof payload !== 'object' || payload === null) {
    return null;
  }

  const data = payload as UnknownRecord;
  const user = data.user;

  if (typeof user === 'object' && user !== null) {
    return user as UnknownRecord;
  }

  return null;
}

export function extractRoleName(profile: UnknownRecord) {
  const directRole = pickString(profile, ['role', 'roleName']);
  if (directRole) {
    return directRole.toUpperCase();
  }

  const nestedRole = profile.roleInfo ?? profile.roleDetail ?? profile.roleDto ?? profile.roleResponse;
  if (typeof nestedRole === 'object' && nestedRole !== null) {
    const roleName = pickString(nestedRole as UnknownRecord, ['name', 'roleName']);
    if (roleName) {
      return roleName.toUpperCase();
    }
  }

  const roleObject = profile.role;
  if (typeof roleObject === 'object' && roleObject !== null) {
    const roleName = pickString(roleObject as UnknownRecord, ['name', 'roleName']);
    if (roleName) {
      return roleName.toUpperCase();
    }
  }

  return 'CANDIDATE';
}

export function mapProfileToAuthUser(profile: UnknownRecord): AuthUser {
  return {
    id: pickNumber(profile, ['id', 'userId']),
    email: pickString(profile, ['email']),
    name: pickString(profile, ['name', 'fullName']),
    roleName: extractRoleName(profile),
    rawProfile: profile
  };
}
