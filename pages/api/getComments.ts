// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Comment } from '../../typings'
import { groq } from 'next-sanity'
import { sanityClient } from '../../lib/sanity'

const commentQuery = groq`
    *[_type == "comment" && references($tweetId)] 
  | order(_createdtAt desc) {
    _id,
    ...
  }
`

type Data = Comment[]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const comments: Comment[] = await sanityClient.fetch(commentQuery, {
    tweetId: req.query.tweetId,
  })
  res.status(200).json(comments)
}
