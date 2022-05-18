import React, { FormEvent, useEffect, useState } from 'react'
import { Comment, CommentBody, Tweet } from '../typings'
import TimeAgo from 'react-timeago'
import {
  ChatAlt2Icon,
  SwitchHorizontalIcon,
  HeartIcon,
  UploadIcon,
} from '@heroicons/react/outline'
import { fetchComments } from '../lib/fetchComments'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

interface Props {
  tweet: Tweet
}

function Tweet({ tweet }: Props) {
  const [comments, setComments] = useState<Comment[]>([])
  const [commentBoxVisible, setCommentBoxVisible] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')

  const { data: session } = useSession()

  useEffect(() => {
    refreshComments()
  }, [])

  const refreshComments = async () => {
    const comments = await fetchComments(tweet._id)
    setComments(comments)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const commentToast = toast.loading('Posting comment...')

    const commentInfo: CommentBody = {
      comment: input,
      username: session?.user?.name || 'Unknown User',
      profileImg: session?.user?.image || 'https://links.papareact.com/gll',
      tweetId: tweet._id,
    }

    const result = await fetch('/api/addComment', {
      body: JSON.stringify(commentInfo),
      method: 'POST',
    })

    await result.json()

    toast.success('Comment Posted!', {
      id: commentToast,
    })

    setInput('')
    setCommentBoxVisible(false)
    refreshComments()
  }

  return (
    <div className="flex flex-col space-x-3 border-y border-gray-100 p-5">
      <div className="flex space-x-3">
        <img
          className="h-10 w-10 rounded-full object-cover"
          src={tweet.profileImg}
          alt=""
        />

        <div>
          <div className="flex items-center space-x-1">
            <p className="mr-1 font-bold">{tweet.username}</p>
            <p className="hidden text-sm text-gray-500 sm:inline">
              @{tweet.username.replace(/\s+/g, '').toLowerCase()} .
            </p>

            <TimeAgo
              className="text-xs text-gray-500"
              date={tweet._createdAt}
            />
          </div>

          <p className="pt-1">{tweet.text}</p>

          {tweet.image && (
            <img
              className="m-5 ml-0 mb-1 max-h-60 w-full rounded-lg object-cover shadow-sm"
              src={tweet.image}
              alt=""
            />
          )}
        </div>
      </div>

      <div className="mt-5 flex justify-between">
        <div
          onClick={() => session && setCommentBoxVisible(!commentBoxVisible)}
          className="flex cursor-pointer items-center space-x-3 text-gray-400"
        >
          <ChatAlt2Icon className="h-5 w-5" />
          <p>{comments.length}</p>
        </div>

        <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
          <SwitchHorizontalIcon className="h-5 w-5" />
        </div>

        <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
          <HeartIcon className="h-5 w-5" />
        </div>

        <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
          <UploadIcon className="h-5 w-5" />
        </div>
      </div>

      {/* comment box logic */}
      {commentBoxVisible && (
        <form onSubmit={handleSubmit} className="mt-3 flex">
          <input
            className="flex-1 rounded-lg bg-gray-100 p-2 outline-none"
            type="text"
            placeholder="Write a comment..."
            value={input}
            onChange={(ev) => setInput(ev.target.value)}
          />
          <button
            disabled={!input}
            type="submit"
            className="ml-3 font-semibold text-twitter disabled:cursor-not-allowed disabled:text-gray-300"
          >
            Post
          </button>
        </form>
      )}

      {comments.length > 0 && (
        <div className="my-2 mt-5 max-h-44 space-y-5 overflow-scroll border-t border-gray-100 p-5 scrollbar-thin scrollbar-thumb-gray-300">
          {comments.map((cmt) => (
            <div className="relative flex space-x-2" key={cmt._id}>
              <hr className="absolute top-9 left-5 h-8 border-x border-twitter/30" />
              <img
                className="h-8 w-8 rounded-full object-cover"
                src={cmt.profileImg}
                alt=""
              />

              <div>
                <div className="flex items-center space-x-1">
                  <p className="mr-1 whitespace-nowrap text-sm font-bold">
                    {cmt.username}
                  </p>
                  <p className="hidden text-sm text-gray-500 md:inline">
                    @{cmt.username.replace(/\s+/g, '').toLowerCase()} .
                  </p>

                  <TimeAgo
                    date={cmt._createdAt}
                    className="text-xs text-gray-500"
                  />
                </div>

                <p>{cmt.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Tweet
