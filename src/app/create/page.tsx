"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export default function CreatePoll() {
  const router = useRouter()
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState(["", ""])
  const [pollType, setPollType] = useState<"multiple-choice" | "yes-no">(
    "multiple-choice"
  )
  const [expiration, setExpiration] = useState("3600") // in seconds
  const [hideResults, setHideResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const addOption = () => {
    setOptions([...options, ""])
  }

  const removeOption = (index: number) => {
    if (options.length <= 2) return
    const newOptions = [...options]
    newOptions.splice(index, 1)
    setOptions(newOptions)
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!question.trim()) {
      toast.error("Please enter a question")
      return
    }

    if (
      pollType === "multiple-choice" &&
      options.some((option) => !option.trim())
    ) {
      toast.error("Please fill in all options")
      return
    }

    setIsLoading(true)

    try {
      const expiresInHours = parseInt(expiration) / 3600 // Convert seconds to hours

      const payload = {
        question,
        options: pollType === "multiple-choice" ? options : undefined,
        type: pollType,
        expiresInHours,
        showResults: !hideResults,
      }

      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/polls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to create poll")
      }

      const { data } = await response.json()
      const pollId = data.id

      toast.success("Poll created successfully!")

      router.push(`/poll/${pollId}`)
    } catch (error) {
      console.error("Failed to create poll:", error)
      toast.error("Failed to create poll. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-8">
        <Link
          href="/"
          className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 text-transparent bg-clip-text hover:opacity-80 transition-opacity"
        >
          VanishVote
        </Link>
      </div>

      <div className="max-w-2xl mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Create a New Poll
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label
              htmlFor="question"
              className="block text-base font-semibold text-gray-700 dark:text-gray-200 mb-2"
            >
              Your Question
            </label>
            <input
              type="text"
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="What do you want to ask?"
              required
            />
          </div>

          <div>
            <label
              htmlFor="pollType"
              className="block text-base font-semibold text-gray-700 dark:text-gray-200 mb-2"
            >
              Poll Type
            </label>
            <select
              id="pollType"
              value={pollType}
              onChange={(e) =>
                setPollType(e.target.value as "multiple-choice" | "yes-no")
              }
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            >
              <option value="multiple-choice">Multiple Choice</option>
              <option value="yes-no">Yes/No</option>
            </select>
          </div>

          {pollType === "multiple-choice" && (
            <div>
              <label className="block text-base font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Options
              </label>
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="flex-1 p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder={`Option ${index + 1}`}
                      required
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="ml-2 p-3 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        aria-label="Remove option"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                onClick={addOption}
                variant="outline"
                className="mt-3 text-purple-600 dark:text-purple-400 border-purple-600 dark:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                Add Option
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label
                htmlFor="expiration"
                className="block text-base font-semibold text-gray-700 dark:text-gray-200 mb-2"
              >
                Poll Duration
              </label>
              <select
                id="expiration"
                value={expiration}
                onChange={(e) => setExpiration(e.target.value)}
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              >
                <option value="3600">1 hour</option>
                <option value="43200">12 hours</option>
                <option value="86400">24 hours</option>
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hideResults"
                  checked={hideResults}
                  onChange={(e) => setHideResults(e.target.checked)}
                  className="h-5 w-5 text-purple-600 dark:text-purple-400 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded transition-colors"
                />
                <label
                  htmlFor="hideResults"
                  className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Hide results until poll ends
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 dark:from-purple-500 dark:to-pink-500 dark:hover:from-purple-600 dark:hover:to-pink-600 text-white transition-all"
            >
              {isLoading ? "Creating..." : "Create Poll"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
