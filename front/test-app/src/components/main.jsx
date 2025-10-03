import { Link } from 'react-router-dom';
import styles from '../../styles/home.module.css'



function Main() {
    return (
        <main className={styles.homeContent}>
            <div className={styles.intro}>
                <h1>Welcome to <span>Monobib</span></h1>
                <h2>A website collecting high-rated restaurants in Japan</h2>
                <div className={styles.refs}>
                    <p>*The data is collected from:</p>
                    <div className={styles.imagesContainer}>
                        <a href="https://award.tabelog.com/hyakumeiten">
                            <img src="../../public/100stores.png" alt="The link of hyakumeiten" title="https://award.tabelog.com/hyakumeiten" rel="noopener noreferrer" target="_blank" />
                        </a>
                        <a href="https://guide.michelin.com/jp/ja">
                            <img src="../../public/michelin.jpg" alt="The link of guide.michelin" title="https://guide.michelin.com/jp/ja" rel="noopener noreferrer" target="_blank" />
                        </a>
                    </div>
                </div>
            </div>
            <div className={styles.actions}>
                <Link to="/login" className={styles.btn}>Login Now</Link>
                <span>OR</span>
                <Link to="/search" className={styles.btn}>Use Without Login</Link>
            </div>
            <p className={styles.note}>
                If you don't have an account, please create one by clicking <a href="#">"アカウント作成"</a>.
            </p>
        </main>
    );
}
export default Main;