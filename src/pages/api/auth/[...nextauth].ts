import NextAuth, { User } from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { query as q } from 'faunadb'

import {fauna} from '../../../services/fauna'

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
],
  scope: 'read:user',
  callbacks: {
    async signIn (user, account, profile) {
        const { email } = user.user

        try {
        await fauna.query(
            q.If(
                q.Not(
                    q.Exists(
                        q.Match(
                            q.Index('user_by_email'),
                            user.user.email
                        )
                    )
                ),
                q.Create(
                    q.Collection('users'),
                    { data: { email } }
                ),
                q.Get(
                    q.Match(
                        q.Index('user_by_email'),
                        user.user.email
                    )
                )
            )
        )
        console.log(`email: ${email}`)
        return true
        }
        catch {
            return false
        }
    }
  }
}
export default NextAuth(authOptions)