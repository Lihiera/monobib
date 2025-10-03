import styles from '../../styles/result.module.css'
import  {useSearchParams, useParams} from 'react-router-dom'
import {useState} from  "react"
import Setting from "./setting"
import { useQuery } from '@tanstack/react-query';
import Map from "./map"



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
    queryKey: ['region', region, page],
    queryFn: async () => {
        const formData = new URLSearchParams()
        // settings.cuisines.forEach((c) => {
        //     formData.append('cuisines', c)
        // })
        const requestOptions ={
            method: 'POST',
            body: formData
        }
        const res =  await fetch(`http://localhost:8080/result?region=${region}&source=${source}&page=${page}`, requestOptions);
        return res.json();
    }
  });
    const nextDisabled = ((page+1)*10 >= count)
    return (
        <>
        {isLoading?
            <div className={styles.load}>Loading...</div>:
            (isError?
            <div className={styles.error}>{`Error: ${error.message}`}</div>:
            <>
        <p>{page*10+1} ~ {page*10+10} of {count} results</p>
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
        </>)}
        </>
        )
}




function Result() {
    const [searchParams, setSearchParams] = useSearchParams()
    const region = searchParams.get('region')||"北海道"
    const source = searchParams.get('source')||"tabelog"
    const [settings, setSettings] = useState({region: region, source: source, cuisines: ['All'], priceRange:{low:0, high: -1}});
    const [mode, setMode] = useState(true)
    const { data, error, isLoading, isError } = useQuery({
    queryKey: ['region', region],
    queryFn: async () => {
        const formData = new URLSearchParams()
        settings.cuisines.forEach((c) => {
            formData.append('cuisines', c)
        })
        const requestOptions ={
            method: 'POST',
            body: formData
        }
        const res =  await fetch(`http://localhost:8080/metadata?region=${settings.region}&priceLow=${settings.priceRange.low}&priceHigh=${settings.priceRange.high}&source=${settings.source}`, requestOptions);
        return res.json();
    }
  });
//   const errorMessage = `Error: ${error.message}`
    return (
        <section>
            <Setting settings={settings} setSettings={setSettings} mode={mode} setMode={setMode} />
            {isLoading?
            <div className={styles.load}>Loading...</div>:
            (isError?
            <div className={styles.error}>{`Error: ${error.message}`}</div>:
            <div className={styles.resultContent}>
                <div className={styles.resItems}>
                    <Items count={data.count}/>
                </div>
                <div className={styles.map}>
                    <Map data={data.data}/>
                </div>
            </div>)}
        </section>
    )
}



export default Result;