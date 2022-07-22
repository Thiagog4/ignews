import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { fauna } from "../services/fauna";
import { query as q } from 'faunadb'
import { stripe } from "../services/stripe";


type User = {
    ref: {
        id: string;
    }
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'POST') {
        const session = await getSession({ req })


        const stripeCustomer = await stripe.customers.create({
            email: session.user.email
            //metadata
        })

        const user = await fauna.query<User>(
            q.Get(
                q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(session.user.email)
                )
            )
        )

        await fauna.query(
            q.Update(
                q.Ref(q.Collections('users'), user.ref.id),
                {
                    data: {
                        stripe_customer_id: stripeCustomer.id,
                    }
                }
            )
        )

        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: stripeCustomer.id,
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [
                { price: 'price_1LGx7SFyhmVLaoPJaW7i3zxQ', quantity: 1 }
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: 'http://localhost:3000/posts',
            cancel_url: 'http://localhost:3000/'
        })

        return res.status(200).json({ sessionId: stripeCheckoutSession.id })
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method not allowed')
    }
}