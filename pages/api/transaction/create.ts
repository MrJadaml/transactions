import { prisma } from '../../../lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    title,
    description,
    amount,
    fromAccount,
    toAccount,
  } = req.body

  try {
    await prisma.transaction.create({
      data: {
        title,
        description,
        amount: Number(amount),
        fromAccount,
        toAccount,
      }
    })

    // Placed in create for expediencey during the interview.
    // I would create a separate endpoint for this transaction-create+accounts-update

    // psudeo code for sum function - represent either a Prisma function that allows
    // for summing a value with provided field without having to make the extra query to pull the value first
    // or a raw sql command which would do the same if Prisma does not provide an api for the above.

    // From Account
    await prisma.account.update({
      where: {
        in: fromAccount,
      },
      data: {
        balance: sum('balance', -amount)
      }
    })

    // To Account
    await prisma.account.update({
      where: {
        in: toAccount,
      },
      data: {
        balance: sum('balance', amount)
      }
    })

    res.status(200).json({message: 'Transaction Complete'})
  } catch (err) {
    console.error(`#transaction_api_create: ${err}`)
    res.status(500)
  }
}
