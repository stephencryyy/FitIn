import * as admin from 'firebase-admin';

const MAX_REQUESTS_PER_HOUR = 10;
const WINDOW_MS = 60 * 60 * 1000;

export async function checkRateLimit(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  const db = admin.firestore();
  const ref = db.collection('rateLimits').doc(userId);

  return db.runTransaction(async (tx) => {
    const doc = await tx.get(ref);
    const now = Date.now();

    let requests: number[] = [];
    if (doc.exists) {
      requests = (doc.data()?.requests || []) as number[];
      requests = requests.filter((ts) => now - ts < WINDOW_MS);
    }

    if (requests.length >= MAX_REQUESTS_PER_HOUR) {
      return { allowed: false, remaining: 0 };
    }

    requests.push(now);
    tx.set(ref, { requests });

    return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - requests.length };
  });
}
