import { PrismaClient } from '@prisma/client';

// Next.js dev মোডে hot-reload এর কারণে বারবার নতুন PrismaClient তৈরি
// হওয়া ঠেকাতে globalThis এ ক্যাশ করা হয়েছে।
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
