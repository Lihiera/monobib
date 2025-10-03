import layout from '../../styles/layout.module.css'
import { Link } from 'react-router-dom';


function Header() {
    return (
        <header>
            <Link to='/'>
            <img className={layout.logo} title="HomePage" src="../public/logo3.png" alt="Home" height="50" />
            </Link>
            <div className={layout.nav}>
                <a className={layout.textLink} href="/">アカウント作成</a>
                <a className={layout.textLink} href="/">ログイン</a>
            </div>
        </header>
    );
}


function Footer() {
    return (
        <footer>
            <div className={layout.footerContent}>
            <Link to='/'>
            <img className={layout.logo} title="HomePage" src="../public/logo3.png" alt="Home" height="50" />
            </Link>
            </div>
        </footer>
    )
}

export { Header, Footer };