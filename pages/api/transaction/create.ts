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

    res.status(200).json({message: 'Transaction Complete'})
  } catch (err) {
    console.error(`#transaction_api_create: ${err}`)
    res.status(500)
  }
}
