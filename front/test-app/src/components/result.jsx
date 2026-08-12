import styles from '../../styles/result.module.css'
import  {useSearchParams} from 'react-router-dom'
import {useState} from  "react"
import Setting from "./setting"
import { useQuery } from '@tanstack/react-query';
import Map from "./map"

const API_BASE_URL = 'https://mono-back.onrender.com';


function Items({count}) {
    const [searchParams, setSearchParams] = useSearchParams()
    const page = +searchParams.get('page')||0
    const region = searchParams.get('region')||"北海道"
    const source = searchParams.get('source')||"tabelog"
    const prevDisabled = (page===0)
    function gotoPage(page) {
    setSearchParams(prevParams => {
      prevParams.set('page', page.toString());
      return prevParams;
    });
  };
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['result', region, source, page],
    queryFn: async () => {
        const requestOptions ={
            method: 'POST',
        }
        const res =  await fetch(`${API_BASE_URL}/result?region=${encodeURIComponent(region)}&source=${encodeURIComponent(source)}&page=${page}`, requestOptions);
        if (!res.ok) {
            throw new Error(`Request failed with status ${res.status}`);
        }
        return res.json();
    }
  });
    const nextDisabled = ((page+1)*10 >= count)
    const end = Math.min((page + 1) * 10, count)
    return (
        <>
        {isLoading?
            <div className={styles.load}>Loading restaurants...</div>:
            (isError?
            <div className={styles.error}>{`Could not load restaurants. ${error.message}`}</div>:
            (!data || data.length === 0?
            <div className={styles.empty}>No restaurants found for this page.</div>:
            <>
        <p>{page*10+1} ~ {end} of {count} results</p>
        <div className={styles.ContentContainer}>
        {data.map((res) => <div key={res.id} className={styles.resContainer}>
            <a href={res.url} target="_blank" rel="noopener noreferrer">
                <div className={styles.imageContainer}>
                    <img className={styles.images} src={res.img} alt={res.name} ></img>
                </div>
                <div className={styles.detailContainer}>
                    <h1>{res.name}</h1>
                    <ul>
                        <li>{res.city_area}  {res.region}</li>
                        <li>Categories: {res.cuisines[0]}</li>
                        <li>Stars: {res.rank}</li>
                        <li>Price: {res.price_range}</li>
                    </ul>
                </div>
            </a>
        </div>)}
        </div>
        <div className={styles.pagination}>
            <button disabled={prevDisabled} onClick={()=>{gotoPage(page-1)}}>Previous Page</button>
            <button disabled={nextDisabled} onClick={()=>{gotoPage(page+1)}}>Next Page</button>
        </div>
        </>))}
        </>
        )
}




function Result() {
    const [searchParams] = useSearchParams()
    const region = searchParams.get('region')||"北海道"
    const source = searchParams.get('source')||"tabelog"
    const [mode, setMode] = useState(true)
    const settings = {region, source}
    const { data, error, isLoading, isError } = useQuery({
    queryKey: ['metadata', region, source],
    queryFn: async () => {
        const requestOptions ={
            method: 'POST',
        }
        const res =  await fetch(`${API_BASE_URL}/metadata?region=${encodeURIComponent(region)}&source=${encodeURIComponent(source)}`, requestOptions);
        if (!res.ok) {
            throw new Error(`Request failed with status ${res.status}`);
        }
        return res.json();
    }
  });
    return (
        <section>
            <Setting settings={settings} mode={mode} setMode={setMode} />
            {isLoading?
            <div className={styles.load}>Loading map data...</div>:
            (isError?
            <div className={styles.error}>{`Could not load map data. ${error.message}`}</div>:
            (!data || data.count === 0?
            <div className={styles.empty}>No restaurants found in {region}.</div>:
            <div className={styles.resultContent}>
                <div className={styles.resItems}>
                    <Items count={data.count}/>
                </div>
                <div className={styles.map}>
                    <Map data={data.data}/>
                </div>
            </div>))}
        </section>
    )
}



export default Result;
