import { Link } from 'react-router-dom';
import styles from '../../styles/home.module.css'
import stores from '../assets/100stores.png'
import michelin from '../assets/michelin.jpg'



function Main() {
    return (
        <main className={styles.homeContent}>
            <div className={styles.intro}>
                <h1>Welcome to <span>Monobib</span></h1>
                <h2>A website collecting high-rated restaurants in Japan</h2>
                <div className={styles.refs}>
                    <p>*The data is collected from two sources:</p>
                    <div className={styles.imagesContainer}>
                        <a href="https://award.tabelog.com/hyakumeiten" target="_blank" rel="noopener noreferrer">
                            <img src={stores} alt="The link of hyakumeiten" title="https://award.tabelog.com/hyakumeiten" />
                        </a>
                        <a href="https://guide.michelin.com/jp/ja" target="_blank" rel="noopener noreferrer">
                            <img src={michelin} alt="The link of guide.michelin" title="https://guide.michelin.com/jp/ja" />
                        </a>
                    </div>
                </div>
            </div>
            <div className={styles.actions}>
                <Link to="/search" className={styles.btn}>Use Without Login</Link>
            </div>
        </main>
    );
}
export default Main;
