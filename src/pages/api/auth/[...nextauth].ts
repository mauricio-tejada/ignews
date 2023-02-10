import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      scope: 'read:user',
    }),
    // ...add more providers here
  ],
}
export default NextAuth(authOptions)