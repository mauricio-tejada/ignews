import { getPrismicClient } from '@/services/prismic'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import styles from './styles.module.scss'
import * as prismicH from '@prismicio/helpers'
import * as Prismic from "@prismicio/client"
import Link from 'next/link'

type Post = {
    slug: string,
    title: string,
    exerpt: string,
    updatedAt: string,
}

interface PostProps {
    posts: Post[]
}

export default function Posts({ posts }: PostProps) {
    return (
        <>
            <Head>
                <title>Posts | Ignews</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    { posts.map(post => (
                        <Link key={post.slug} href={`/posts/${post.slug}`}>
                            <time>{post.updatedAt}</time>
                            <strong>{post.title}</strong>
                            <p>{post.exerpt}</p>
                        </Link>
                    )) }
                </div>
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient()

    const response = await prismic.get(
        { 
            predicates: Prismic.predicate.at('document.type', 'post'),  
            fetch: ['post.title', 'post.content'],
            pageSize: 100,
        },
    
    )

    const posts = response.results.map(post => {
        return {
            slug: post.uid,
            title: prismicH.asText(post.data.title),
            exerpt: post.data.content.find((content: { type: string }) => content.type === 'paragraph')?.text ?? '',
            updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }
    })

    return {
        props: { posts }
    }
}