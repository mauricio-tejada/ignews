import { api } from '@/services/api'
import { getStripeJs } from '@/services/stripe-js'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import styles from './styles.module.scss'

interface SubscribeButtonProps {
    priceId: string
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    const { data:session } = useSession()
    const router = useRouter()

    async function handleSubscribe() {
        //verifica se o usuario esta logado, caso não esteja será redirecionado para login 
        if(!session) {
            signIn('github')
            return
        }

        if (session.activeSubscription) {
            router.push('/posts')
            return
        }

        try {
            const response = await api.post('/subscribe')

            const { sessionId } = response.data

            const stripe = await getStripeJs()

            await stripe?.redirectToCheckout({sessionId})
        } catch(err:any) {
            alert(err.message)
        }

    }

    return (
        <button
            type="button"
            className={styles.subscribeButton}
            onClick={handleSubscribe}
        >
            Subscribe now
        </button>
    )
}