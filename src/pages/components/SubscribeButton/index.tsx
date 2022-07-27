import { Console } from 'console';
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
        const stripe = require('stripe')('sk_test_51LGx5YFyhmVLaoPJtOnq7O8X5kBvYYLHqewNwPduJwuPe6oQgLxB63iOgTi7n2iizjz1Jm75fOvkNUdFIYf5i8qU00j2hdZFPi');
        if (!session) {
            signIn('github')
            return;
        }
        try {
            const respose = await api.post('/subscribe')

            const { sessionId } = respose.data;




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