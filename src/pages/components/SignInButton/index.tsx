import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'
import { signIn, useSession } from 'next-auth/react'


import styles from './styles.module.scss'


export function SignInButton() {
    const { data: session } = useSession()

    return session ? (
        <button className={styles.siginInButton}
            type="button"
        >
            <FaGithub color="#04d361" />
            Thiago Guedes
            <FiX color="#737380" className={styles.closeIcon} />
        </button>
    ) : (
        <button className={styles.siginInButton}
            type="button"
            onClick={() => signIn('github')}
        >
            <FaGithub color="#eba417" />
            Sign in with Github
        </button>

    );


}