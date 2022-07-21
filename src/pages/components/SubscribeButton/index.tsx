import { signIn, useSession } from 'next-auth/react';
import { api } from '../../services/api';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
    priceId: string;
}
export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    const { data:session}  = useSession();
   async function handleSubscribe(){
        if(!session){
            signIn('github')
            return;
        }
        try{
            const respose = await api.post('/subscribe')

            const {sessionID} = respose.data;
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