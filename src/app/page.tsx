import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl font-cinzel uppercase tracking-wider whitespace-break-spaces md:text-6xl font-extrabold mb-2  bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 text-transparent bg-clip-text box-decoration-clone leading-tight">
          Vanish Vote
        </h1>
        <p className="text-xl md:text-2xl mb-10 text-gray-700 dark:text-gray-200 font-light font-notepen leading-relaxed">
          Create anonymous polls that disappear after a set time. No login
          required...
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Create & Share
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-200 mb-6 leading-relaxed">
              Create multiple-choice polls with unique shareable links that
              expire automatically.
            </p>
            <div className="flex justify-center">
              <svg
                className="w-16 h-16 text-purple-500 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Vote & View Results
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-200 mb-6 leading-relaxed">
              Vote anonymously and see real-time results with reactions.
            </p>
            <div className="flex justify-center">
              <svg
                className="w-16 h-16 text-pink-500 dark:text-pink-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <Link
          className="cursor-pointer p-3 rounded border  bg-white dark:bg-gray-800 "
          href="/create"
        >
          <Button
            variant="link"
            className="px-8 py-4 cursor-pointer text-lg font-semibold rounded-lg transition-all duration-300 hover:transform hover:scale-105 w-fit dark:text-white"
          >
            Create a Poll
          </Button>
        </Link>
      </div>
    </div>
  )
}
