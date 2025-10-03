import styles from '../../styles/result.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'

function JumpTo({region, source, settings, setSettings, disabled, children}) {
    const navigate = useNavigate();
    const handleClick = (e) => {
        setSettings({...settings, region, source});
        navigate(`/result?region=${region}&source=${source}`)
    };
    return (
        <button onClick={handleClick} className={`${styles.btn}`} disabled={disabled}>{children}</button>
    )
}

function Setting({settings, setSettings, mode, setMode}) {
    const [regionVisit, setRegionVisit] = useState(false);
    const [sourceVisit, setSourceVisit] = useState(false);
    const regionBtn = useRef(null);
    const regionChoose = useRef(null);
    const sourceBtn = useRef(null);
    const sourceChoose = useRef(null);
    const colorRegion = regionVisit?styles.color:"";
    const colorSource = sourceVisit?styles.color:"";
    const remind = !mode?"Disabled because of map mode":""
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
    console.log(settings)


    return (
        <div className={styles.settings}>
            <div className={styles.mode}>
            <span>Use Map Mode:</span>
                <label className={styles.switch}>
                    <input type="checkbox" value={mode} onChange={()=>setMode(mode=>!mode)} />
                    <span className={styles.slider}></span>
                </label>
            </div>
            <div className={styles.formContainer}>
            <div>Area:</div>
            <button className={`${styles.region} ${styles.settingItem} ${colorRegion}` } ref={regionBtn} onClick={()=>{setRegionVisit(!regionVisit)}} disabled={!mode} title={remind}>{settings.region}</button>
            <div>Source:</div>
            <div className={`${styles.source} ${styles.settingItem} ${colorSource}`}  ref={sourceBtn} onClick={()=>{setSourceVisit(!sourceVisit)}}>{settings.source}</div>
            <div>Cuisines:</div>
            <div className={`${styles.cuisines} ${styles.settingItem}`}>{settings.cuisines}</div>
            <div>Price Range:</div>
            <div className={`${styles.priceRange} ${styles.settingItem}`}>{settings.priceRange.low}~{settings.priceRange.high===-1?"":settings.priceRange.high}</div>
            </div>
            {regionVisit?
            ((settings.source==="tabelog")?
            <div className={`${styles.regionChoose}`} ref={regionChoose}>
                <div className={`${styles.cancel}`} onClick={()=>{setRegionVisit(!regionVisit)}}>×</div>
                <h1>Choose the region: </h1>
                <div className={styles.subtitle}>北海道</div>
                <div className={styles.items}>{["北海道"].map((region) => <JumpTo region={region} source={settings.source} settings={settings} setSettings={setSettings} disabled={region === settings.region}>{region}</JumpTo>)} </div>
                <div className={styles.subtitle}>東北</div>
                <div className={styles.items}>{["青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"].map((region) => <JumpTo region={region} source={settings.source} settings={settings} setSettings={setSettings} disabled={region === settings.region}>{region}</JumpTo>)}</div>
                <div className={styles.subtitle}>関東</div>
                <div className={styles.items}>{["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"].map((region) => <JumpTo region={region} source={settings.source} settings={settings} setSettings={setSettings} disabled={region === settings.region}>{region}</JumpTo>)}</div>
                <div className={styles.subtitle}>中部</div>
                <div className={styles.items}>{["新潟県", "富山県", "石川県", "福井県", "岐阜県", "静岡県", "愛知県", "山梨県", "長野県"].map((region) => <JumpTo region={region} source={settings.source} settings={settings} setSettings={setSettings} disabled={region === settings.region}>{region}</JumpTo>)}</div>
                <div className={styles.subtitle}>関西</div>
                <div className={styles.items}>{["滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県", "三重県"].map((region) => <JumpTo region={region} source={settings.source} settings={settings} setSettings={setSettings} disabled={region === settings.region}>{region}</JumpTo>)}</div>
                <div className={styles.subtitle}>中国</div>
                <div className={styles.items}>{["鳥取県", "島根県", "岡山県", "広島県", "山口県"].map((region) => <JumpTo region={region} source={settings.source} settings={settings} setSettings={setSettings} disabled={region === settings.region}>{region}</JumpTo>)}</div>
                <div className={styles.subtitle}>四国</div>
                <div className={styles.items}>{["徳島県", "香川県", "愛媛県", "高知県"].map((region) => <JumpTo region={region} source={settings.source} settings={settings} setSettings={setSettings} disabled={region === settings.region}>{region}</JumpTo>)}</div>
                <div className={styles.subtitle}>九州</div>
                <div className={styles.items}>{["福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県"].map((region) => <JumpTo region={region} source={settings.source} settings={settings} setSettings={setSettings} disabled={region === settings.region}>{region}</JumpTo>)}</div>
                <div className={styles.subtitle}>沖縄</div>
                <div className={styles.items}>{["沖縄県"].map((region) => <JumpTo region={region} source={settings.source} settings={settings} setSettings={setSettings} disabled={region === settings.region} >{region}</JumpTo>)}</div>
            </div>:
                <div className={`${styles.regionChoose}`} ref={regionChoose}>
                <div className={`${styles.cancel}`} onClick={()=>{setRegionVisit(!regionVisit)}}>×</div>
                <h1>Choose the region: </h1>
                <div className={styles.items}>{["東京"].map((region) => <JumpTo region={region} source={settings.source} settings={settings} setSettings={setSettings} disabled={region === settings.region}>{region}</JumpTo>)} </div>
                <div className={styles.items}>{["大阪"].map((region) => <JumpTo region={region} source={settings.source} settings={settings} setSettings={setSettings} disabled={region === settings.region}>{region}</JumpTo>)} </div>

                <div className={styles.items}>{["京都"].map((region) => <JumpTo region={region} source={settings.source} settings={settings} setSettings={setSettings} disabled={region === settings.region}>{region}</JumpTo>)} </div>

                <div className={styles.items}>{["奈良"].map((region) => <JumpTo region={region} source={settings.source} settings={settings} setSettings={setSettings} disabled={region === settings.region}>{region}</JumpTo>)} </div>
            </div>
        ):<></>}
            {sourceVisit?
                 <div className={`${styles.sourceChoose}`} ref={sourceChoose}>
                    <div className={`${styles.cancel}`} onClick={()=>{setSourceVisit(!sourceVisit)}}>×</div>
                    <h1>Choose the restaurant source: </h1>
                    <div className={styles.sourceBtn}>
                        <div className={styles.items}><JumpTo region="北海道" source={"tabelog"} settings={settings} setSettings={setSettings} disabled={settings.source==="tabelog"}>tabelog</JumpTo></div>
                        <div className={styles.items}><JumpTo region="東京" source={"michelin"} settings={settings} setSettings={setSettings} disabled={settings.source==="michelin"}>michelin</JumpTo></div>
                    </div>

                </div>:<></>
            }
            </div>)
}



export default Setting