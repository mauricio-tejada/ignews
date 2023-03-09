import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";

//Extends LinkProps para o componente poder receber todas as propriedades do Link
interface ActiveLinkProps extends LinkProps {
    children: string
    activeClassName: string
}

export function ActiveLink({children, activeClassName, ...rest }: ActiveLinkProps) {
    const { asPath } = useRouter()

    const className = asPath === rest.href
    ? activeClassName
    : ''

    return (
        <Link {...rest} className={className}>
            {children}
        </Link>
    )
}