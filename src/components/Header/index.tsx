import Link from 'next/link';
import Image from 'next/image';
import { SignInButton } from '../SignInButton';
import styles from './styles.module.scss';
import { ActiveLink } from '../ActiveLink';

export function Header() {

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Image src="/images/logo.svg" alt="ig.news" width='100' height='100' />
                <nav>
                    <ActiveLink href="/" activeClassName={styles.active}>
                        Home
                    </ActiveLink>
                    <ActiveLink href="/posts" activeClassName={styles.active} prefetch>
                        Posts
                    </ActiveLink>
                </nav>

                <SignInButton />
            </div>
        </header>
    )
}