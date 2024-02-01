import {
  ChangeEvent,
  FormEvent,
  useState,
} from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { Inter } from 'next/font/google'
import { prisma } from '../../lib/prisma'

const inter = Inter({ subsets: ['latin'] })

interface ITransaction {
  title: string
  description: string
  amount: string
  fromAccount: string
  toAccount: string
}

interface IProps {
  transaction: ITransaction 
  error?: string
}

export default function Home({ transaction }: IProps) {
  const [updatedTransaction, setUpdatedTransaction] = useState<ITransaction>(transaction)
  const router = useRouter()
  const { id } = router.query

  const handleUpdate = async (nextTransaction: ITransaction) => {
    try {
      await fetch(`http://localhost:3000/api/transaction/${id}/update`, {
        body: JSON.stringify(nextTransaction),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PUT',
      })

      router.push('/')
    } catch (err) {
      console.error(`#index_handleUpdate Error: ${err}`)
    }
  }

  const handleChange = (
    evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: string
  ) => {
    setUpdatedTransaction({
      ...updatedTransaction,
      [fieldName]: evt.target.value,
    })
  }

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()

    try {
      await handleUpdate(updatedTransaction)
    } catch (err) {
      console.error(`#index_handleSubmit Error: ${err}`)
    }
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div>
        <h2>Update Transaction</h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col"
        >
          <input
            type="text"
            placeholder="title"
            value={updatedTransaction.title}
            onChange={(evt) => handleChange(evt, 'title')}
          />

          <textarea
            placeholder="description"
            value={updatedTransaction.description}
            onChange={(evt) => handleChange(evt, 'description')}
          />

          <input
            type="text"
            placeholder="amount"
            value={updatedTransaction.amount}
            onChange={(evt) => handleChange(evt, 'amount')}
          />

          <input
            type="text"
            placeholder="From Account"
            value={updatedTransaction.fromAccount}
            onChange={(evt) => handleChange(evt, 'fromAccount')}
          />

          <input
            type="text"
            placeholder="To Account"
            value={updatedTransaction.toAccount}
            onChange={(evt) => handleChange(evt, 'toAccount')}
          />

          <button
            type="submit"
          >
            Update
          </button>
        </form>
      </div>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query
  try {
    const transaction = await prisma.transaction.findUnique({
      select: {
        title: true,
        description: true,
        amount: true,
        fromAccount: true,
        toAccount: true,
      },
      where: {
        id: Number(id) || undefined,
      },
    })

    return {
      props: {
        transaction,
      },
    }
  } catch (err) {
    console.error(`#index_getServerSideProps Error: ${err}`)
    return {
      props: {
        transaction: {},
        error: 'Error fetching data',
      },
    }
  }
}
