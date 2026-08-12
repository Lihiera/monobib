import styles from '../../styles/result.module.css'
import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { michelinRegions, tabelogRegions } from '../data/regions'

function JumpTo({region, source, disabled, children}) {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/result?region=${region}&source=${source}`)
    };
    return (
        <button onClick={handleClick} className={`${styles.btn}`} disabled={disabled}>{children}</button>
    )
}

function Setting({settings, mode, setMode}) {
    const [regionVisit, setRegionVisit] = useState(false);
    const [sourceVisit, setSourceVisit] = useState(false);
    const regionBtn = useRef(null);
    const regionChoose = useRef(null);
    const sourceBtn = useRef(null);
    const sourceChoose = useRef(null);
    const colorRegion = regionVisit?styles.color:"";
    const colorSource = sourceVisit?styles.color:"";
    const remind = !mode?"Turn on Area Selector to change regions":""
    useEffect(()=> {
        const cancelRegion = (event) => {
            if (regionBtn.current &&
                !regionBtn.current.contains(event.target) &&
                regionChoose.current &&
                !regionChoose.current.contains(event.target)) {
                setRegionVisit(false);}}
            if (regionVisit) {
        document.addEventListener('mousedown', cancelRegion);}
        return () => {
      document.removeEventListener('mousedown', cancelRegion);
    };
    }, [regionVisit])

    useEffect(()=> {
        const cancelSource = (event) => {
            if (sourceBtn.current &&
                !sourceBtn.current.contains(event.target) &&
                sourceChoose.current &&
                !sourceChoose.current.contains(event.target)) {
                setSourceVisit(false);}}
            if (sourceVisit) {
        document.addEventListener('mousedown', cancelSource);}
        return () => {
      document.removeEventListener('mousedown', cancelSource);
    };
    }, [sourceVisit])
    const regionGroups = settings.source === 'tabelog' ? tabelogRegions : michelinRegions


    return (
        <div className={styles.settings}>
            <div className={styles.mode}>
            <span>Area Selector:</span>
                <label className={styles.switch}>
                    <input type="checkbox" checked={mode} onChange={()=>setMode(mode=>!mode)} />
                    <span className={styles.slider}></span>
                </label>
            </div>
            <div className={styles.formContainer}>
            <div>Area:</div>
            <button className={`${styles.region} ${styles.settingItem} ${colorRegion}` } ref={regionBtn} onClick={()=>{setRegionVisit(!regionVisit)}} disabled={!mode} title={remind}>{settings.region}</button>
            <div>Source:</div>
            <div className={`${styles.source} ${styles.settingItem} ${colorSource}`}  ref={sourceBtn} onClick={()=>{setSourceVisit(!sourceVisit)}}>{settings.source}</div>
            </div>
            {regionVisit?
            <div className={`${styles.regionChoose}`} ref={regionChoose}>
                <div className={`${styles.cancel}`} onClick={()=>{setRegionVisit(!regionVisit)}}>×</div>
                <h1>Choose the region: </h1>
                {regionGroups.map((group) => (
                    <div key={group.name}>
                        <div className={styles.subtitle}>{group.name}</div>
                        <div className={styles.items}>
                            {group.prefectures.map((region) => (
                                <JumpTo key={region} region={region} source={settings.source} disabled={region === settings.region}>{region}</JumpTo>
                            ))}
                        </div>
                    </div>
                ))}
            </div>:<></>}
            {sourceVisit?
                 <div className={`${styles.sourceChoose}`} ref={sourceChoose}>
                    <div className={`${styles.cancel}`} onClick={()=>{setSourceVisit(!sourceVisit)}}>×</div>
                    <h1>Choose the restaurant source: </h1>
                    <div className={styles.sourceBtn}>
                        <div className={styles.items}><JumpTo region="北海道" source={"tabelog"} disabled={settings.source==="tabelog"}>tabelog</JumpTo></div>
                        <div className={styles.items}><JumpTo region="東京" source={"michelin"} disabled={settings.source==="michelin"}>michelin</JumpTo></div>
                    </div>

                </div>:<></>
            }
            </div>)
}



export default Setting
