import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import styles from '../../styles/result.module.css'
import  {useSearchParams, useParams} from 'react-router-dom'
import { useEffect } from 'react'

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const location = {
    "北海道": [43.46722,	142.8278],
    "青森県":	[40.78028,	140.8319],
    "岩手県":	[39.59139,	141.3625],
    "宮城県":	[38.44556,	140.9281],
    "秋田県":	[39.7475,	140.4086],
    "山形県": 	[38.44639,	140.1028],
    "福島県":	[37.37889,	140.2253],
    "茨城県":	[36.30639,	140.3186],
    "栃木県":	[36.68917,	139.8192],
    "群馬県":	[36.50389,	138.9853],
    "埼玉県":	[35.99667,	139.3478],
    "千葉県":	[35.51278,	140.2039],
    "東京都":	[35.01833,	139.5986],
    "東京":	[35.01833,	139.5986],
    "神奈川県":	[35.41417,	139.3403],
    "新潟県":	[37.51889,	138.9172],
    "富山県":	[36.63611,	137.2681],
    "石川県":	[36.76583,	136.7714],
    "福井県":	[35.84667,	136.2272],
    "山梨県":	[35.61222,	138.6117],
    "長野県":	[36.13,	138.0439],
    "岐阜県":	[35.7775,	137.055],
    "静岡県":	[35.01694,	138.33],
    "愛知県":	[35.03444,	137.215],
    "三重県":	[34.51361,	136.3814],
    "滋賀県":	[35.21528,	136.1381],
    "京都府":	[35.25194,	135.4458],
    "京都":	[35.25194,	135.4458],
    "大阪府":	[34.62278,	135.5111],
    "大阪":	[34.62278,	135.5111],
    "兵庫県":	[35.03694,	134.8286],
    "奈良県":	[34.31556,	135.8714],
    "奈良":	[34.31556,	135.8714],
    "和歌山県":	[33.90944,	135.5133],
    "鳥取県": [35.36056,	133.8517],
    "島根県":	[35.07306,	132.5594],
    "岡山県":	[34.90083,	133.8153],
    "広島県":	[34.60361,	132.7875],
    "山口県":	[34.19861,	131.575],
    "徳島県":	[33.91806,	134.2431],
    "香川県":	[34.24306,	133.9967],
    "愛媛県":	[33.62194,	132.8558],
    "高知県":	[33.42111,	133.3667],
    "福岡県":	[33.5225,	130.6681],
    "佐賀県":	[33.28528,	130.1169],
    "長崎県":	[33.2275,	129.6142],
    "熊本県":	[32.615,	130.7564],
    "大分県":	[33.19917,	131.4342],
    "宮崎県":	[32.19083,	131.3006],
    "鹿児島県":	[31.01278,	130.4242],
    "沖縄県":	[25.77111,	126.64],
}

const zoom = {
    "北海道": 7,
    "青森県":	8,
    "岩手県":	8,
    "宮城県":	8,
    "秋田県":	8,
    "山形県": 	8,
    "福島県":	8,
    "茨城県":	8,
    "栃木県":	8,
    "群馬県":	8,
    "埼玉県":	8,
    "千葉県":	8,
    "東京都":	8,
    "東京":	8,
    "神奈川県":	8,
    "新潟県":	8,
    "富山県":	8,
    "石川県":	8,
    "福井県":	8,
    "山梨県":	8,
    "長野県":	8,
    "岐阜県":	8,
    "静岡県":	8,
    "愛知県":	8,
    "三重県":	8,
    "滋賀県":	8,
    "京都府":	8,
    "京都":	8,
    "大阪府":	8,
    "大阪":	8,
    "兵庫県":	8,
    "奈良県":	8,
    "奈良":	8,
    "和歌山県":	8,
    "鳥取県": 8,
    "島根県":	8,
    "岡山県":	8,
    "広島県":	8,
    "山口県":	8,
    "徳島県":	8,
    "香川県":	8,
    "愛媛県":	8,
    "高知県":	8,
    "福岡県":	8,
    "佐賀県":	8,
    "長崎県":	8,
    "熊本県":	8,
    "大分県":	8,
    "宮崎県":	8,
    "鹿児島県":	7,
    "沖縄県":	7,
}



function ChangeView({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom);
  }, [center, zoom, map]);

  return null;
}





function Map({data}) {
    const [searchParams, setSearchParams] = useSearchParams()
    const region = searchParams.get('region')||"北海道"
    const center = location[region];
    const regionZoom = zoom[region];
    return (
            <MapContainer center={center} zoom={regionZoom} >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                 <ChangeView center={center} zoom={regionZoom} />
                {data.map(resto => (
                    <Marker key={resto.id} position={[resto.lat, resto.lng]}>
                    <Popup>
                        <PopContent resto={resto} />
                    </Popup>
                    </Marker>
                ))}
            </MapContainer>
    )
}

function PopContent({resto}) {
    return (
        <div className={styles.popContent}>
            <img src={resto.img}></img>
            <strong>{resto.name}</strong>
            {resto.cuisines.join('、')}
            <a href={resto.url} target="_blank" rel="noopener noreferrer">access</a>
        </div>
    )

}

export default Map