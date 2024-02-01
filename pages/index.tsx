import {
  ChangeEvent,
  FormEvent,
  useState,
} from 'react'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Inter } from 'next/font/google'
import { prisma } from '../lib/prisma'

const inter = Inter({ subsets: ['latin'] })

interface ITransaction {
  title: string
  description: string
  amount: string
  fromAccount: string
  toAccount: string
}

interface IProps {
  transactions: (
    ITransaction & {
      id: string
    }
  )[]
  error?: string
}

export default function Home({ transactions = [] }: IProps) {
  const [transaction, setTransaction] = useState<ITransaction>({
    title: '',
    description: '',
    amount: '',
    fromAccount: '',
    toAccount: '',
  })

  const router = useRouter()

  const pageRefresh = () => {
    router.replace(router.asPath)
  }

  const handleCreate = async (transaction: ITransaction) => {
    try {
      await fetch('http://localhost:3000/api/transaction/create', {
        body: JSON.stringify(transaction),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      setTransaction({
        title: '',
        description: '',
        amount: '',
        fromAccount: '',
        toAccount: '',
      })

      pageRefresh()
    } catch (err) {
      console.error(`#index_handleCreate Error: ${err}`)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:3000/api/transaction/${id}/delete`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE'
      })

      pageRefresh()
    } catch (err) {
      console.error(`#index_handleDelete Error: ${err}`)
    }
  }

  const handleChange = (
    evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: string
  ) => {
    setTransaction({
      ...transaction,
      [fieldName]: evt.target.value,
    })
  }

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()

    try {
      await handleCreate(transaction)
    } catch (err) {
      console.error(`#index_handleSubmit Error: ${err}`)
    }
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div>
        <h2>Add Transaction</h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-3"
        >
          <input
            type="text"
            placeholder="title"
            value={transaction.title}
            onChange={(evt) => handleChange(evt, 'title')}
            className="border-2 rounded p-1"
          />

          <textarea
            placeholder="description"
            value={transaction.description}
            onChange={(evt) => handleChange(evt, 'description')}
            className="border-2 rounded p-1"
          />

          <input
            type="text"
            placeholder="amount"
            value={transaction.amount}
            onChange={(evt) => handleChange(evt, 'amount')}
            className="border-2 rounded p-1"
          />

          <input
            type="text"
            placeholder="From Account"
            value={transaction.fromAccount}
            onChange={(evt) => handleChange(evt, 'fromAccount')}
            className="border-2 rounded p-1"
          />

          <input
            type="text"
            placeholder="To Account"
            value={transaction.toAccount}
            onChange={(evt) => handleChange(evt, 'toAccount')}
            className="border-2 rounded p-1"
          />

          <button
            type="submit"
            className="border-2 rounded bg-green-500 p-1"
          >
            Save
          </button>
        </form>
      </div>

      <div>
        <h2>Transactions</h2>

        <table className="table-auto">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Amount</th>
              <th>From Account</th>
              <th>To Account</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map(transaction => 
              <tr key={transaction.id}>
                <td>{transaction.title}</td>
                <td>{transaction.description}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.fromAccount}</td>
                <td>{transaction.toAccount}</td>
                <td className="bg-blue-500 rounded">
                  <Link href={`/transaction/${transaction.id}`}>Edit</Link>
                </td>
                <td className="bg-red-500 rounded">
                  <button onClick={() => handleDelete(transaction.id)}>Delete</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const transactions = await prisma.transaction.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        amount: true,
        fromAccount: true,
        toAccount: true,
      },
      orderBy: { transactionDate: 'desc' },
    })

    return {
      props: {
        transactions,
      },
    }
  } catch (err) {
    console.error(`#index_getServerSideProps Error: ${err}`)
    return {
      props: {
        transactions: [],
        error: 'Error fetching data',
      },
    }
  }
}
