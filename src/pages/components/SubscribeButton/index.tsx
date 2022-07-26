import { signIn, useSession } from 'next-auth/react';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
    priceId: string;
}


export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    const { data: session } = useSession();

    async function handleSubscribe() {
        if (!session) {
            signIn('github')
            return;
        }
        try {
            console.log(session);
            const respose = await api.post('/subscribe')

            const { sessionId } = respose.data;

            const stripe = await getStripeJs()


            stripe.redirectToCheckout({ sessionId })
        } catch (err) {

            alert(err.message);
        }
    }
    return (
        <button type="button"
            className={styles.subscribeButton}
            onClick={handleSubscribe}
        >
            Subscribe now
        </button>
    )

}