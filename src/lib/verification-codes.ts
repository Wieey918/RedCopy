// src/lib/verification-codes.ts
import { db } from '@/lib/db'

const CODE_TTL_MS = 10 * 60_000 // 10 分钟有效

const verificationCodeClient = (db as any).verificationCode

// 限频留内存：Serverless 下仅尽力而为（每实例独立），不影响正确性
const lastSent = new Map<string, number>()

export function tooFrequent(key: string) {
  return Date.now() - (lastSent.get(key) ?? 0) < 60_000
}

export async function saveCode(key: string, code: string) {
  lastSent.set(key, Date.now())
  const expiresAt = new Date(Date.now() + CODE_TTL_MS)
  if (!verificationCodeClient) return
  await verificationCodeClient.upsert({
    where: { key },
    update: { code, expiresAt },
    create: { key, code, expiresAt },
  })
}

// 校验成功即消费（一次性）；失败不消费，允许重试
export async function checkCode(key: string, input: string) {
  if (!verificationCodeClient) return false
  const rec = await verificationCodeClient.findUnique({ where: { key } })
  if (!rec) return false
  if (rec.expiresAt.getTime() <= Date.now()) return false
  if (rec.code !== input) return false
  await verificationCodeClient.delete({ where: { key } }).catch(() => {})
  return true
}
