import styles from '../../styles/search.module.css'
import homeStyles from '../../styles/home.module.css'
import { Link } from 'react-router-dom';
import { tabelogRegions } from '../data/regions';
import japanMap from '../assets/japan06.png';

function SearchContent() {
    return (
        <main className={`${homeStyles.homeContent} ${styles.searchContent}`} style={{ '--search-map': `url(${japanMap})` }}>
            <h1 className={homeStyles.title}>Choose the region: </h1>
            {tabelogRegions.map((group) => (
                <section key={group.name} className={styles.regionGroup}>
                    <h2 className={styles.subtitle}>{group.name}</h2>
                    <div className={styles.items}>
                        {group.prefectures.map((region) => (
                            <Link
                                key={region}
                                to={`/result?region=${region}&source=tabelog`}
                                className={`${styles.btn} ${styles[group.className]}`}
                            >
                                {region}
                            </Link>
                        ))}
                    </div>
                </section>
            ))}
        </main>
    );
}

export default SearchContent;
