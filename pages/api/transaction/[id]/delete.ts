import { prisma } from '../../../../lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const transactionId = req.query.id

    if (req.method === 'DELETE') {
      const transaction = await prisma.transaction.delete({
        where: { id: Number(transactionId)},
      })

      res.status(200).json(transaction)
    }
  } catch (err) {
    console.error(`#transaction_api_delete Error: ${err}`)
    res.status(500)
  }
}
