import {
  ChangeEvent,
  FormEvent,
  useState,
} from 'react'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

interface ITransaction {
  title: string
  description: string
  amount: string
  fromAccount: string
  toAccount: string
}

export default function Home() {
  const [transaction, setTransaction] = useState<ITransaction>({
    title: '',
    description: '',
    amount: '',
    fromAccount: '',
    toAccount: '',
  })

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
    } catch (err) {
      console.error(`#index_handleCreate Error: ${err}`)
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
          className="flex flex-col"
        >
          <input
            type="text"
            placeholder="title"
            value={transaction.title}
            onChange={(evt) => handleChange(evt, 'title')}
          />

          <textarea
            placeholder="description"
            value={transaction.description}
            onChange={(evt) => handleChange(evt, 'description')}
          />

          <input
            type="text"
            placeholder="amount"
            value={transaction.amount}
            onChange={(evt) => handleChange(evt, 'amount')}
          />

          <input
            type="text"
            placeholder="From Account"
            value={transaction.fromAccount}
            onChange={(evt) => handleChange(evt, 'fromAccount')}
          />

          <input
            type="text"
            placeholder="To Account"
            value={transaction.toAccount}
            onChange={(evt) => handleChange(evt, 'toAccount')}
          />

          <button
            type="submit"
            className="text-white"
          >
            Save
          </button>
        </form>
      </div>
    </main>
  )
}
