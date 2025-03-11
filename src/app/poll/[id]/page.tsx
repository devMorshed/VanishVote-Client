/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"

import { formatTimeLeft } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function PollPage() {
  const { id } = useParams()
  const [poll, setPoll] = useState<any>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [hasReacted, setHasReacted] = useState(false)
  const [timeLeft, setTimeLeft] = useState("")
  const [newComment, setNewComment] = useState("")
  const [showComments, setShowComments] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch poll data from the backend
  useEffect(() => {
    const fetchPoll = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/polls/${id}`
        )
        if (!response.ok) throw new Error("Poll not found")
        const { data } = await response.json()
        setPoll(data)
        setHasVoted(localStorage.getItem(`poll_${id}_voted`) === "true")
        setHasReacted(localStorage.getItem(`poll_${id}_reacted`) === "true")
      } catch (error) {
        setError("Failed to load poll. Please try again.")
        toast.error("Failed to load poll.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchPoll()
  }, [id])

  // Update time left every second
  useEffect(() => {
    if (!poll) return
    const timer = setInterval(() => {
      setTimeLeft(formatTimeLeft(new Date(poll.expiresAt)))
    }, 1000)
    return () => clearInterval(timer)
  }, [poll])

  // Handle voting
  const handleVote = async () => {
    if (selectedOption === null || !poll) return
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/polls/${id}/vote`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ optionIndex: selectedOption }),
        }
      )
      if (!response.ok) throw new Error("Failed to vote")
      const updatedPoll = await response.json()
      setPoll(updatedPoll.data)
      setHasVoted(true)
      localStorage.setItem(`poll_${id}_voted`, "true")
      toast.success("Vote submitted!")
    } catch (error) {
      toast.error("Failed to submit vote.")
    }
  }

  // Handle reactions (only one reaction per user)
  const handleReaction = async (type: "trending" | "likes") => {
    if (hasReacted) {
      toast.error("You have already reacted.")
      return
    }
    if (!poll) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/polls/${id}/reaction`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type }),
        }
      )
      if (!response.ok) throw new Error("Failed to add reaction")
      const updatedPoll = await response.json()
      setPoll(updatedPoll.data)
      setHasReacted(true)
      localStorage.setItem(`poll_${id}_reacted`, "true")
      toast.success("Reaction added!")
    } catch (error) {
      toast.error("Failed to add reaction.")
    }
  }

  // Handle adding comments
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !poll) return
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/polls/${id}/comment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: newComment }),
        }
      )
      if (!response.ok) throw new Error("Failed to add comment")
      const updatedPoll = await response.json()
      setPoll(updatedPoll.data)
      setNewComment("")
      toast.success("Comment posted!")
    } catch (error) {
      toast.error("Failed to add comment.")
    }
  }

  // Copy poll link to clipboard
  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Link copied to clipboard!")
  }

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    )
  }

  if (error || !poll) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 dark:text-red-400">
        {error || "Poll not found."}
      </div>
    )
  }

  const totalVotes = poll.options.reduce(
    (sum: number, option: any) => sum + option.votes,
    0
  )
  const isPollExpired = new Date() > new Date(poll.expiresAt)
  const showResults = poll.showResults || hasVoted || isPollExpired

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text"
        >
          VanishVote
        </Link>
      </div>

      {/* Poll Container */}
      <div className="max-w-2xl mx-auto w-full">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {poll.question}
            </h1>
            <span className="text-sm font-medium text-orange-500 dark:text-orange-400">
              {timeLeft}
            </span>
          </div>

          {/* Options */}
          <div className="mb-6">
            {poll.options.map((option: any, index: number) => (
              <div
                key={index}
                className="relative mb-3 border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700"
              >
                {showResults && (
                  <div
                    className="absolute top-0 left-0 h-full bg-purple-100 dark:bg-purple-900/30 z-0"
                    style={{
                      width: `${(option.votes / Math.max(totalVotes, 1)) * 100}%`,
                    }}
                  />
                )}
                <div className="relative z-10 flex items-center p-4">
                  <input
                    type="radio"
                    id={`option-${index}`}
                    name="poll-option"
                    value={index}
                    checked={selectedOption === index}
                    onChange={() => !hasVoted && setSelectedOption(index)}
                    disabled={hasVoted || isPollExpired}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600"
                  />
                  <label
                    htmlFor={`option-${index}`}
                    className={`ml-3 block w-full text-gray-800 dark:text-gray-200 ${hasVoted ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <div className="flex justify-between">
                      <span>{option.text}</span>
                      {showResults && (
                        <span className="font-medium">
                          {(
                            (option.votes / Math.max(totalVotes, 1)) *
                            100
                          ).toFixed(1)}
                          %{" "}
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                            ({option.votes}{" "}
                            {option.votes === 1 ? "vote" : "votes"})
                          </span>
                        </span>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* Vote Button */}
          {!isPollExpired && !hasVoted && (
            <div className="flex justify-end mb-6">
              <Button
                onClick={handleVote}
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Submit Vote
              </Button>
            </div>
          )}

          {/* Expired Notice */}
          {isPollExpired && (
            <div className="text-center p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-md mb-6">
              This poll has expired. Voting is no longer available.
            </div>
          )}

          {/* Reactions and Share */}
          <div className="flex justify-between items-center border-t pt-4 dark:border-gray-700">
            <div className="flex gap-2">
              <button
                onClick={() => handleReaction("trending")}
                disabled={hasReacted}
                className={`flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100  dark:bg-gray-700  text-gray-800 dark:text-gray-200 ${hasReacted ? "cursor-default text-muted" : "cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"}`}
              >
                🔥 {poll.reactions.trending}
              </button>
              <button
                onClick={() => handleReaction("likes")}
                disabled={hasReacted}
                className={`flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100  dark:bg-gray-700  text-gray-800 dark:text-gray-200 ${hasReacted ? "cursor-default text-muted" : "cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"}`}
              >
                👍 {poll.reactions.likes}
              </button>
            </div>
            <button
              onClick={copyLinkToClipboard}
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              Share Poll
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 font-medium mb-4 text-purple-600 dark:text-purple-400"
          >
            <span>Comments ({poll.comments.length})</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-4 h-4 transition-transform ${showComments ? "rotate-180" : ""}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>

          {showComments && (
            <>
              <form onSubmit={handleAddComment} className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add an anonymous comment..."
                    className="flex-1 p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 dark:text-gray-200"
                  />
                  <Button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    Post
                  </Button>
                </div>
              </form>

              <div className="space-y-4">
                {poll.comments.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No comments yet. Be the first to comment!
                  </div>
                ) : (
                  poll.comments.map((comment: any) => (
                    <div
                      key={comment.id}
                      className="border-b pb-3 dark:border-gray-700 last:border-0"
                    >
                      <div className="text-sm mb-1 text-gray-800 dark:text-gray-200">
                        {comment.text}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(comment.createdAt).toLocaleTimeString()} •
                        Anonymous
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
