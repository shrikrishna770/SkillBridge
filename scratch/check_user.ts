import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'a@gmail.com' }
  })
  console.log('User found:', user ? 'YES' : 'NO')
  if (user) {
    console.log('Has password:', user.password ? 'YES' : 'NO')
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
