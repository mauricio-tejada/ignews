import Head from 'next/head'
import styles from './home.module.scss'

import { Roboto } from '@next/font/google'
import { SubscribeButton } from '@/components/SubscribeButton'
import { GetServerSideProps } from 'next'
import { stripe } from '../services/stripe'

const roboto = Roboto({weight: ['400', '700'],style: ['normal'],subsets:['latin']})

interface HomeProps {
  product: {
    priceId: string,
    amount: number
  }
}

export default function Home({ product }: HomeProps) {

  return (
    <div className={roboto.className}>
      <Head>
        <title>Home | ig.news</title>
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
      </Head>

      <main  className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about <span>React</span> world.</h1>
          <p>
            Get access to all publications <br /> 
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId}/>
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const price = await stripe.prices.retrieve('price_1MZ1EmFJJ4ojwkQs6Kw02Z6x')

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount! / 100),
  }
  
  return {
    props: {
      product
    }
  }
}
