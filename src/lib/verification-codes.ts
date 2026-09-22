// src/lib/verification-codes.ts
// 内存存储，dev 够用；部署多实例时换 DB/Redis
const codes = new Map<string, { code: string; expiresAt: number }>()
const lastSent = new Map<string, number>()

export function tooFrequent(key: string) {
  return Date.now() - (lastSent.get(key) ?? 0) < 60_000
}

export function saveCode(key: string, code: string) {
  codes.set(key, { code, expiresAt: Date.now() + 10 * 60_000 })
  lastSent.set(key, Date.now())
}

// 校验成功即消费（一次性）；失败不消费，允许重试
export function checkCode(key: string, input: string) {
  const rec = codes.get(key)
  if (!rec) return false
  const ok = rec.code === input && Date.now() <= rec.expiresAt
  if (ok) codes.delete(key)
  return ok
}
