import { prisma } from '../../../../lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const transactionId = req.query.id
    const {
      title,
      description,
      amount,
      fromAccount,
      toAccount,
    } = req.body

    if (req.method === 'PUT') {
      const updatedTransaction = await prisma.transaction.update({
        where: {
          id: Number(transactionId)
        },
        data: {
          title,
          description,
          amount: Number(amount),
          fromAccount,
          toAccount,
        }
      })

      res.status(200).json(updatedTransaction)
    }
  } catch (err) {
    console.error(`#transaction_api_update Error: ${err}`)
    res.status(500)
  }
}
