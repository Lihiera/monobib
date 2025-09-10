import layout from '../../styles/layout.module.css'


function Header() {
    return (
        <header>
            <a href='/'>
            <img className={layout.logo} title="HomePage" src="../public/logo3.png" alt="Home" height="50" />
            </a>
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
            <a href='/'>
            <img className={layout.logo} title="HomePage" src="../public/logo3.png" alt="Home" height="50" />
            </a>
            </div>
        </footer>
    )
}

export { Header, Footer };