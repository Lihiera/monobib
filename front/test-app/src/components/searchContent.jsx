import styles from '../../styles/search.module.css'
import homeStyles from '../../styles/home.module.css'
import { Link } from 'react-router-dom';

function SearchContent() {
    return (
        <main className={`${homeStyles.homeContent} ${styles.searchContent}`}>
            <h1 className={homeStyles.title}>Choose the region: </h1>
            <h2 className={styles.subtitle}>北海道</h2>
            <h2 className={styles.items}><Link to="/result?region=北海道&source=tabelog" className={`${styles.btn} ${styles.hokkaidou}`}>北海道</Link></h2>
            <h2 className={styles.subtitle}>東北</h2>
            <h2 className={styles.items}><Link to="/result?region=青森県&source=tabelog" className={`${styles.btn} ${styles.touhoku}`}>青森県</Link>  <Link to="/result?region=岩手県&source=tabelog" className={`${styles.btn} ${styles.touhoku}`}>岩手県</Link>  <Link to="/result?region=宮城県&source=tabelog" className={`${styles.btn} ${styles.touhoku}`}>宮城県</Link>  <Link to="/result?region=秋田県&source=tabelog" className={`${styles.btn} ${styles.touhoku}`}>秋田県</Link>  <Link to="/result?region=山形県&source=tabelog" className={`${styles.btn} ${styles.touhoku}`}>山形県</Link>  <Link to="/result?region=福島県&source=tabelog" className={`${styles.btn} ${styles.touhoku}`}>福島県</Link></h2>
            <h2 className={styles.subtitle}>関東</h2>
            <h2 className={styles.items}><Link to="/result?region=茨城県&source=tabelog" className={`${styles.btn} ${styles.kanto}`}>茨城県</Link>  <Link to="/result?region=栃木県&source=tabelog" className={`${styles.btn} ${styles.kanto}`}>栃木県</Link>  <Link to="/result?region=群馬県&source=tabelog" className={`${styles.btn} ${styles.kanto}`}>群馬県</Link>  <Link to="/result?region=埼玉県&source=tabelog" className={`${styles.btn} ${styles.kanto}`}>埼玉県</Link>  <Link to="/result?region=千葉県&source=tabelog" className={`${styles.btn} ${styles.kanto}`}>千葉県</Link>  <Link to="/result?region=東京都&source=tabelog" className={`${styles.btn} ${styles.kanto}`}>東京都</Link>  <Link to="/result?region=神奈川県&source=tabelog" className={`${styles.btn} ${styles.kanto}`}>神奈川県</Link></h2>
            <h2 className={styles.subtitle}>中部</h2>
            <h2  className={styles.items}><Link to="/result?region=新潟県&source=tabelog" className={`${styles.btn} ${styles.chubu}`}>新潟県</Link><Link to="/result?region=富山県&source=tabelog" className={`${styles.btn} ${styles.chubu}`}>富山県</Link>  <Link to="/result?region=石川県&source=tabelog" className={`${styles.btn} ${styles.chubu}`}>石川県</Link>  <Link to="/result?region=福井県&source=tabelog" className={`${styles.btn} ${styles.chubu}`}>福井県</Link>
            <Link to="/result?region=岐阜県&source=tabelog" className={`${styles.btn} ${styles.chubu}`}>岐阜県</Link>  <Link to="/result?region=静岡県&source=tabelog" className={`${styles.btn} ${styles.chubu}`}>静岡県</Link>  <Link to="/result?region=愛知県&source=tabelog" className={`${styles.btn} ${styles.chubu}`}>愛知県</Link>   <Link to="/result?region=山梨県&source=tabelog" className={`${styles.btn} ${styles.chubu}`}>山梨県</Link>  <Link to="/result?region=長野県&source=tabelog" className={`${styles.btn} ${styles.chubu}`}>長野県</Link></h2>
            <h2 className={styles.subtitle}>関西</h2>
            <h2 className={styles.items}><Link to="/result?region=滋賀県&source=tabelog" className={`${styles.btn} ${styles.kinki}`}>滋賀県</Link>  <Link to="/result?region=京都府&source=tabelog" className={`${styles.btn} ${styles.kinki}`}>京都府</Link>  <Link to="/result?region=大阪府&source=tabelog" className={`${styles.btn} ${styles.kinki}`}>大阪府</Link>  <Link to="/result?region=兵庫県&source=tabelog" className={`${styles.btn} ${styles.kinki}`}>兵庫県</Link>  <Link to="/result?region=奈良県&source=tabelog" className={`${styles.btn} ${styles.kinki}`}>奈良県</Link>  <Link to="/result?region=和歌山県&source=tabelog" className={`${styles.btn} ${styles.kinki}`}>和歌山県</Link> <Link to="/result?region=三重県&source=tabelog" className={`${styles.btn} ${styles.kinki}`}>三重県</Link></h2>
            <h2 className={styles.subtitle}>中国</h2>
            <h2 className={styles.items}><Link to="/result?region=鳥取県&source=tabelog" className={`${styles.btn} ${styles.chugoku}`}>鳥取県</Link>  <Link to="/result?region=島根県&source=tabelog" className={`${styles.btn} ${styles.chugoku}`}>島根県</Link>  <Link to="/result?region=岡山県&source=tabelog" className={`${styles.btn} ${styles.chugoku}`}>岡山県</Link>  <Link to="/result?region=広島県&source=tabelog" className={`${styles.btn} ${styles.chugoku}`}>広島県</Link>  <Link to="/result?region=山口県&source=tabelog" className={`${styles.btn} ${styles.chugoku}`}>山口県</Link></h2>
            <h2 className={styles.subtitle}>四国</h2>
            <h2 className={styles.items}><Link to="/result?region=徳島県&source=tabelog" className={`${styles.btn} ${styles.shikoku}`}>徳島県</Link>  <Link to="/result?region=香川県&source=tabelog" className={`${styles.btn} ${styles.shikoku}`}>香川県</Link>  <Link to="/result?region=愛媛県&source=tabelog" className={`${styles.btn} ${styles.shikoku}`}>愛媛県</Link>  <Link to="/result?region=高知県&source=tabelog" className={`${styles.btn} ${styles.shikoku}`}>高知県</Link></h2>
            <h2 className={styles.subtitle}>九州</h2>
            <h2 className={styles.items}><Link to="/result?region=福岡県&source=tabelog" className={`${styles.btn} ${styles.kyushu}`}>福岡県</Link>  <Link to="/result?region=佐賀県&source=tabelog" className={`${styles.btn} ${styles.kyushu}`}>佐賀県</Link>  <Link to="/result?region=長崎県&source=tabelog" className={`${styles.btn} ${styles.kyushu}`}>長崎県</Link>  <Link to="/result?region=熊本県&source=tabelog" className={`${styles.btn} ${styles.kyushu}`}>熊本県</Link>  <Link to="/result?region=大分県&source=tabelog" className={`${styles.btn} ${styles.kyushu}`}>大分県</Link>  <Link to="/result?region=宮崎県&source=tabelog" className={`${styles.btn} ${styles.kyushu}`}>宮崎県</Link>  <Link to="/result?region=鹿児島県&source=tabelog" className={`${styles.btn} ${styles.kyushu}`}>鹿児島県</Link></h2>
            <h2 className={styles.subtitle}>沖縄</h2>
            <h2 className={styles.items}><Link to="/result?region=沖縄県&source=tabelog" className={`${styles.btn} ${styles.okinawa}`}>沖縄県</Link></h2>
        </main>
    );
}

export default SearchContent;