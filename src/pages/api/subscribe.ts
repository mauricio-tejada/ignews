import { fauna } from '@/services/fauna';
import { query as q } from 'faunadb'
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { stripe } from '../../services/stripe';

type User = {
    ref: {
        id: string
    },
    data: {
        stripe_customer_id: string
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
    //verifica se o metodo é post
    if(req.method === 'POST') {
        //pegamos as informações do usuario logado atraves dos cookies
        const session = await getSession({ req })

        //busca o usuario no Fauna
        const user = await fauna.query<User>(
            q.Get(
                q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(session!.user!.email!)
                )
            )
        )

        let customerId = user.data.stripe_customer_id

        if (!customerId) {
            //cria o customer no Stripe, se não tiver
            const stripeCustomer = await stripe.customers.create({
                email: session!.user!.email!,
            })

            //insere o customer ID do Stripe no Fauna
            await fauna.query(
                q.Update(
                    q.Ref(q.Collection('users'), user.ref.id),
                    {
                        data: {
                            stripe_customer_id: stripeCustomer.id
                        }
                    }
                )
            )

            customerId = stripeCustomer.id
        }




        //método de criação de inscrição do Stripe
        const stripeCheckoutSession =  await stripe.checkout.sessions.create({
            customer: customerId, //este id se refere ao id criado no stripe, não no Fauna
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [
                { price:  'price_1MZ1EmFJJ4ojwkQs6Kw02Z6x', quantity: 1}
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCCESS_URL!,
            cancel_url: process.env.STRIPE_CANCEL_URL
        })

        return res.status(200).json({sessionId: stripeCheckoutSession.id})

    } else {
        //se não for POST, vai devolver para o front a mensagem
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method not allowed')
    }
}