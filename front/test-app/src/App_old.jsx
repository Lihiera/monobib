import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css'; // 作成したCSSファイルをインポート

// --- Custom Leaflet Icons ---
// デフォルトのマーカーアイコン
const defaultIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// ハイライト表示用のマーカーアイコン（金色）
const highlightedIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
    iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// --- Map Events Component ---
// 地図のイベントを監視し、ハイライト解除を制御するコンポーネント
function MapPopupController({ onDeselect }) {
  const map = useMap();

  useEffect(() => {
    // 地図上でポップアップが閉じた時のイベントリスナーを追加
    map.on('popupclose', () => {
      onDeselect();
    });

    // 地図の背景をクリックした時のイベントリスナーを追加
    map.on('click', () => {
      onDeselect();
    });

    // コンポーネントがアンマウントされる時にイベントリスナーを解除
    return () => {
      map.off('popupclose');
      map.off('click');
    };
  }, [map, onDeselect]);

  return null;
}

// --- Hardcoded Data ---
const prefectures = [
  '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県',
  '茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県',
  '新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県','静岡県','愛知県',
  '三重県','滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県',
  '鳥取県','島根県','岡山県','広島県','山口県','徳島県','香川県','愛媛県','高知県',
  '福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県'
];

const genres = [
  '和食','寿司','イタリアン','フレンチ','中華料理','焼肉','居酒屋','カフェ','バー','ラーメン',
  'そば','うどん','スイーツ','洋食','鉄板焼き','魚介料理・海鮮料理'
];

// --- Helper Functions ---
const formatBudget = (min, max) => {
  if (min === null && max === null) return '情報なし';
  if (min !== null && max !== null) {
    if (min === max) return `¥${min.toLocaleString()}`;
    return `¥${min.toLocaleString()}～¥${max.toLocaleString()}`;
  }
  if (min !== null) return `¥${min.toLocaleString()}～`;
  if (max !== null) return `～¥${max.toLocaleString()}`;
  return '情報なし';
};

const initialFiltersState = {
  name: '',
  prefecture: [],
  genre: [],
  award: [],
  minPrice: '',
  maxPrice: ''
};

// --- Main App Component ---
function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [awards, setAwards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState(initialFiltersState);
  const [hoveredRestaurantId, setHoveredRestaurantId] = useState(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null); // クリックされたレストランID
  const restaurantRefs = useRef({}); // 各レストランカードへの参照

  // アワード一覧をAPIから取得
  useEffect(() => {
    fetch('http://localhost:8000/api/awards')
      .then(res => res.json())
      .then(data => setAwards(data))
      .catch(err => console.error("アワードの取得に失敗しました:", err));
  }, []);

  // 検索処理
  const fetchRestaurants = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.name) params.append('name', filters.name);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    
    filters.prefecture.forEach(p => params.append('prefecture', p));
    filters.genre.forEach(g => params.append('genre', g));
    filters.award.forEach(a => params.append('award', a));

    const query = params.toString() ? `?${params.toString()}` : '';

    fetch(`http://localhost:8000/api/restaurants${query}`)
      .then(res => res.json())
      .then(data => setRestaurants(data))
      .catch(err => console.error("レストランの取得に失敗しました:", err));
  }, [filters]);

  // 初回読み込み
  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  // フィルターの変更ハンドラ
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = e => {
    const { name, value, checked } = e.target;
    setFilters(prev => {
      const currentValues = prev[name];
      if (checked) {
        return { ...prev, [name]: [...currentValues, value] };
      } else {
        return { ...prev, [name]: currentValues.filter(item => item !== value) };
      }
    });
  };

  const handleSearchClick = () => {
    fetchRestaurants();
    setIsModalOpen(false);
  };

  const handleClearFilters = () => {
    setFilters(initialFiltersState);
  };

  // マーカークリック時の処理
  const handleMarkerClick = (restaurantId) => {
    setSelectedRestaurantId(restaurantId);
    const ref = restaurantRefs.current[restaurantId];
    if (ref) {
      ref.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };
  
  // ハイライトを解除する処理
  const handleDeselect = useCallback(() => {
      setSelectedRestaurantId(null);
  }, []);

  return (
    <div className="app">
      <h1>レストランガイド</h1>
      
      <div className="search-controls">
        <button className="open-modal-button" onClick={() => setIsModalOpen(true)}>
          検索条件を設定
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={() => setIsModalOpen(false)}>×</button>
            <div className="filters">
              <h2>検索条件</h2>
              <div className="input-group">
                <input name="name" placeholder="店名で検索" value={filters.name} onChange={handleInputChange} />
                <input name="minPrice" type="number" placeholder="最低価格 (¥)" value={filters.minPrice} onChange={handleInputChange} />
                <input name="maxPrice" type="number" placeholder="最高価格 (¥)" value={filters.maxPrice} onChange={handleInputChange} />
              </div>

              <div className="filter-group">
                <h3>都道府県</h3>
                <div className="checkbox-container">
                  {prefectures.map(pref => (
                    <label key={pref} className="checkbox-item">
                      <input type="checkbox" name="prefecture" value={pref} checked={filters.prefecture.includes(pref)} onChange={handleCheckboxChange} />
                      {pref}
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="filter-group">
                <h3>ジャンル</h3>
                <div className="checkbox-container">
                  {genres.map(g => (
                    <label key={g} className="checkbox-item">
                      <input type="checkbox" name="genre" value={g} checked={filters.genre.includes(g)} onChange={handleCheckboxChange} />
                      {g}
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <h3>アワード</h3>
                <div className="checkbox-container">
                  {awards.map(aw => (
                    <label key={aw.id} className="checkbox-item">
                      <input type="checkbox" name="award" value={aw.name} checked={filters.award.includes(aw.name)} onChange={handleCheckboxChange} />
                      {aw.name}
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="modal-buttons">
                <button className="clear-button" onClick={handleClearFilters}>全てクリア</button>
                <button className="search-button" onClick={handleSearchClick}>この条件で検索</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="content">
        <div className="list-panel">
          <div className="list">
            {restaurants.map(r => (
              <div 
                key={r.id} 
                className={`restaurant-card ${r.id === selectedRestaurantId ? 'selected' : ''}`}
                onMouseEnter={() => setHoveredRestaurantId(r.id)}
                onMouseLeave={() => setHoveredRestaurantId(null)}
                ref={el => restaurantRefs.current[r.id] = el} // 各カードへの参照を保存
              >
                <h2><a href={r.url} target="_blank" rel="noopener noreferrer">{r.name}</a></h2>
                <p>{r.prefecture?.name || '情報なし'} | {r.genres.map(g => g.name).join(', ') || '情報なし'}</p>
                <p>ランチ: {formatBudget(r.lunch_min, r.lunch_max)}</p>
                <p>ディナー: {formatBudget(r.dinner_min, r.dinner_max)}</p>
                <p>住所: {r.place || '情報なし'}</p>
                {r.award && <p className="award-badge">{r.award.name}</p>}
              </div>
            ))}
          </div>
        </div>
        <div className="map-panel">
          <MapContainer center={[35.6812, 139.7671]} zoom={5} style={{ height: '100%', width: '100%' }}>
            <MapPopupController onDeselect={handleDeselect} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {restaurants
              .filter(r => r.lat != null && r.lng != null)
              .map(r => {
                const icon = r.id === hoveredRestaurantId || r.id === selectedRestaurantId ? highlightedIcon : defaultIcon;
                return (
                  <Marker 
                    key={r.id} 
                    position={[r.lat, r.lng]} 
                    icon={icon}
                    eventHandlers={{
                      click: (e) => {
                        // マーカークリック時に地図のクリックイベントが発火するのを防ぐ
                        L.DomEvent.stopPropagation(e);
                        handleMarkerClick(r.id);
                      },
                    }}
                  >
                    <Popup>
                      <a href={r.url} target="_blank" rel="noopener noreferrer">{r.name}</a><br />
                      {r.place}
                    </Popup>
                  </Marker>
                )
              })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default App;
