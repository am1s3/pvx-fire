import { hash, compare } from 'bcrypt-ts'

// Хешируем пароль перед тем, как пихнуть его в базу
export async function hashPassword(password: string) {
  return hash(password, 12)
}

// Сверяем введенный пароль с тем, что лежит в базе
export async function verifyPassword(password: string, hash: string) {
  return compare(password, hash)
}
