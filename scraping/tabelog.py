import asyncio
import re
import mysql.connector
from mysql.connector import Error
from playwright.async_api import async_playwright, Page, Locator, BrowserContext

# -----------------------------------------------------------------------------
# データベースとテーブル名定義
# -----------------------------------------------------------------------------
DB_CONFIG = {
    'host': 'localhost',
    'user': 'test_user',
    'password': 'test',
    'database': 'momobib'
}
RESTAURANTS_TABLE_NAME = 'restaurants'
AWARDS_TABLE_NAME = 'awards'
PREFECTURES_TABLE_NAME = 'prefectures'
GENRES_TABLE_NAME = 'genres'
RESTAURANT_GENRES_TABLE_NAME = 'restaurant_genres' # 中間テーブル

# -----------------------------------------------------------------------------
# データベースのセットアップ (正規化対応)
# -----------------------------------------------------------------------------
def setup_database():
    """正規化されたデータベースとテーブルを作成する"""
    conn = None
    cursor = None
    try:
        # データベースがなければ作成
        conn = mysql.connector.connect(
            host=DB_CONFIG['host'], user=DB_CONFIG['user'], password=DB_CONFIG['password']
        )
        cursor = conn.cursor()
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_CONFIG['database']} DEFAULT CHARACTER SET utf8mb4")
        print(f"データベース '{DB_CONFIG['database']}' の準備ができました。")
        cursor.close()
        conn.close()

        # データベースに接続
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        # --- マスタテーブルの作成 ---
        print("マスタテーブルを作成します...")
        cursor.execute(f"""
        CREATE TABLE IF NOT EXISTS {AWARDS_TABLE_NAME} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL
        ) ENGINE=InnoDB;
        """)
        cursor.execute(f"""
        CREATE TABLE IF NOT EXISTS {PREFECTURES_TABLE_NAME} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50) UNIQUE NOT NULL
        ) ENGINE=InnoDB;
        """)
        cursor.execute(f"""
        CREATE TABLE IF NOT EXISTS {GENRES_TABLE_NAME} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) UNIQUE NOT NULL
        ) ENGINE=InnoDB;
        """)
        print(f"-> テーブル '{AWARDS_TABLE_NAME}', '{PREFECTURES_TABLE_NAME}', '{GENRES_TABLE_NAME}' の準備完了。")
        
        # --- メインテーブルの作成 (外部キー設定) ---
        print(f"メインテーブル '{RESTAURANTS_TABLE_NAME}' を作成します...")
        cursor.execute(f"""
        CREATE TABLE IF NOT EXISTS {RESTAURANTS_TABLE_NAME} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            url VARCHAR(255) UNIQUE NOT NULL,
            name VARCHAR(255),
            place TEXT,
            prefecture_id INT,
            award_id INT,
            lunch_min INT,
            lunch_max INT,
            dinner_min INT,
            dinner_max INT,
            lat FLOAT,
            lng FLOAT,
            FOREIGN KEY (prefecture_id) REFERENCES {PREFECTURES_TABLE_NAME}(id) ON DELETE SET NULL,
            FOREIGN KEY (award_id) REFERENCES {AWARDS_TABLE_NAME}(id) ON DELETE SET NULL
        ) ENGINE=InnoDB;
        """)
        print(f"-> テーブル '{RESTAURANTS_TABLE_NAME}' の準備完了。")

        # --- 中間テーブルの作成 (多対多関連) ---
        print(f"中間テーブル '{RESTAURANT_GENRES_TABLE_NAME}' を作成します...")
        cursor.execute(f"""
        CREATE TABLE IF NOT EXISTS {RESTAURANT_GENRES_TABLE_NAME} (
            restaurant_id INT NOT NULL,
            genre_id INT NOT NULL,
            PRIMARY KEY (restaurant_id, genre_id),
            FOREIGN KEY (restaurant_id) REFERENCES {RESTAURANTS_TABLE_NAME}(id) ON DELETE CASCADE,
            FOREIGN KEY (genre_id) REFERENCES {GENRES_TABLE_NAME}(id) ON DELETE CASCADE
        ) ENGINE=InnoDB;
        """)
        print(f"-> テーブル '{RESTAURANT_GENRES_TABLE_NAME}' の準備完了。")

    except Error as e:
        print(f"データベース設定中にエラーが発生しました: {e}")
    finally:
        if conn and conn.is_connected():
            if cursor:
                cursor.close()
            conn.close()

# -----------------------------------------------------------------------------
# データ抽出用のヘルパー関数 (変更なし)
# -----------------------------------------------------------------------------
def parse_budget(budget_text: str) -> tuple[int | None, int | None]:
    if not budget_text or '～' not in budget_text: return None, None
    numbers_str = budget_text.replace('￥', '').replace(',', '')
    try:
        min_val, max_val = map(int, numbers_str.split('～'))
        return min_val, max_val
    except (ValueError, IndexError):
        return None, None

async def get_text_content(locator: Locator) -> str | None:
    if await locator.count() > 0: return await locator.inner_text()
    return None

async def _get_lat_lng_from_gsi(context: BrowserContext, address: str) -> tuple[float | None, float | None]:
    page = await context.new_page()
    try:
        await page.goto("https://maps.gsi.go.jp/", wait_until="domcontentloaded", timeout=15000)
        await page.locator("#query").fill(address)
        await page.keyboard.press("Enter")
        first_result = page.locator(".searchresultdialog_ul li a").first
        await first_result.wait_for(state="visible", timeout=10000)
        await first_result.click()
        marker = page.locator("div.leaflet-marker-icon.leaflet-interactive").first
        await marker.wait_for(state="visible", timeout=10000)
        await asyncio.sleep(0.5)
        await marker.click()
        popup = page.locator(".leaflet-popup-content")
        await popup.wait_for(state="visible", timeout=10000)
        content = await popup.inner_text()
        match = re.search(r'(-?\d+\.\d+),(-?\d+\.\d+)', content)
        if match:
            lat, lng = float(match.group(1)), float(match.group(2))
            print(f"        -> [地理院地図] 座標取得成功: ({lat}, {lng})")
            return lat, lng
        return None, None
    except Exception as e:
        print(f"        -> [地理院地図] エラー: {e}")
        return None, None
    finally:
        await page.close()

async def _get_lat_lng_from_Maps(context: BrowserContext, address: str) -> tuple[float | None, float | None]:
    page = await context.new_page()
    try:
        await page.goto("https://www.google.com/maps", wait_until="domcontentloaded", timeout=15000)
        await page.locator("#searchboxinput").fill(address)
        await page.locator("#searchbox-searchbutton").click()
        await page.wait_for_url(re.compile(r".*@.*"), timeout=10000)
        final_url = page.url
        match = re.search(r"@(-?\d+\.\d+),(-?\d+\.\d+)", final_url)
        if match:
            lat, lng = float(match.group(1)), float(match.group(2))
            print(f"        -> [Google Maps] 座標取得成功: ({lat}, {lng})")
            return lat, lng
        return None, None
    except Exception as e:
        print(f"        -> [Google Maps] エラー: {e}")
        return None, None
    finally:
        await page.close()

async def get_lat_lng_by_scraping(context: BrowserContext, address: str) -> tuple[float | None, float | None]:
    if not address: return None, None
    print("      - 緯度経度取得中 (試行1/2: 地理院地図)...")
    lat, lng = await _get_lat_lng_from_gsi(context, address)
    if lat is not None: return lat, lng
    print("      - 試行1が失敗。フォールバックします (試行2/2: Google Maps)...")
    await asyncio.sleep(1)
    lat, lng = await _get_lat_lng_from_Maps(context, address)
    if lat is not None: return lat, lng
    print("      - 全ての緯度経度取得試行に失敗しました。")
    return None, None

# -----------------------------------------------------------------------------
# データベース保存用のヘルパー関数
# -----------------------------------------------------------------------------
def _get_master_data_map(cursor, table_name):
    """マスタテーブルから {name: id} の辞書を作成する"""
    cursor.execute(f"SELECT id, name FROM {table_name}")
    return {name: id for id, name in cursor.fetchall()}

def _insert_master_data(cursor, table_name, unique_items):
    """マスタテーブルにユニークなデータを挿入する"""
    if not unique_items: return 0
    sql = f"INSERT IGNORE INTO {table_name} (name) VALUES (%s)"
    data = [(item,) for item in unique_items if item]
    cursor.executemany(sql, data)
    return cursor.rowcount

# -----------------------------------------------------------------------------
# メイン処理
# -----------------------------------------------------------------------------
async def main():
    """メインのスクレイピングとDB保存処理を実行する"""
    print("スクレイピング処理を開始します...")
    
    setup_database()

    all_shops_data = []
    unique_awards = set()
    unique_prefectures = set()
    unique_genres = set()

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        start_url = "https://award.tabelog.com/hyakumeiten"
        await page.goto(start_url, wait_until="domcontentloaded")

        category_locators = page.locator('ul.hyakumeiten-nav__list li.hyakumeiten-nav__item:nth-child(n+2) a')
        category_links = [await link.get_attribute('href') for link in await category_locators.all()]
        print(f"{len(category_links)}件のカテゴリが見つかりました。")

        for i, category_link in enumerate(category_links[:3], 1):
            if not category_link: continue
            
            full_category_link = f"https://award.tabelog.com{category_link}"
            print(f"\n[{i}/{len(category_links)}] カテゴリを処理中: {full_category_link}")
            await page.goto(full_category_link, wait_until="domcontentloaded")

            award_type = (await page.title()).removesuffix("[食べログ]").strip()
            unique_awards.add(award_type)

            shop_urls = [await a.get_attribute('href') for a in await page.locator('a.hyakumeiten-shop__target').all()]
            print(f"  -> {len(shop_urls)}件の店舗を処理します。")

            for shop_url in shop_urls[:2]:
                if not shop_url: continue
                try:
                    await page.goto(shop_url, wait_until="domcontentloaded")
                    name = await get_text_content(page.locator('h2.display-name'))
                    if not name:
                        print(f"    - 警告: 店舗名が見つかりません。スキップします。 URL: {shop_url}")
                        continue
                    print(f"    - 店舗: {name}")

                    address_p = page.locator('p.rstinfo-table__address')
                    place_parts = await address_p.all_inner_texts()
                    place = "".join(part.strip() for part in place_parts[0].split('\n')) if place_parts else None

                    lat, lng = await get_lat_lng_by_scraping(context, place)

                    prefecture = await get_text_content(address_p.locator('span').first)
                    if prefecture: unique_prefectures.add(prefecture)
                    
                    genre_text = await get_text_content(page.locator('th:has-text("ジャンル") + td span'))
                    genres = genre_text.split('、') if genre_text else []
                    for g in genres: unique_genres.add(g)

                    dinner_text = await get_text_content(page.locator('div.rdheader-budget i[aria-label="Dinner"] + span.c-rating-v3__val a'))
                    lunch_text = await get_text_content(page.locator('div.rdheader-budget i[aria-label="Lunch"] + span.c-rating-v3__val a'))
                    dinner_min, dinner_max = parse_budget(dinner_text)
                    lunch_min, lunch_max = parse_budget(lunch_text)

                    all_shops_data.append({
                        "url": shop_url, "name": name, "place": place, "prefecture": prefecture,
                        "genres": genres, "lunch_min": lunch_min, "lunch_max": lunch_max,
                        "dinner_min": dinner_min, "dinner_max": dinner_max, "award": award_type,
                        "lat": lat, "lng": lng,
                    })
                except Exception as e:
                    print(f"    - エラー: 店舗ページの処理中にエラーが発生しました。URL: {shop_url} - {e}")
        await browser.close()
        
    print(f"\nスクレイピングが完了しました。合計{len(all_shops_data)}件の店舗データを取得しました。")
    if not all_shops_data:
        print("保存するデータがありません。")
        return

    # --- データベースへの保存処理 (正規化対応) ---
    print("\nデータベースへの保存を開始します...")
    conn = None
    cursor = None
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        # 1. マスタテーブルにデータを挿入
        print("手順1: マスタテーブルにデータを挿入...")
        _insert_master_data(cursor, AWARDS_TABLE_NAME, unique_awards)
        _insert_master_data(cursor, PREFECTURES_TABLE_NAME, unique_prefectures)
        _insert_master_data(cursor, GENRES_TABLE_NAME, unique_genres)
        conn.commit()
        print("-> マスタデータの挿入完了。")

        # 2. マスタデータのIDを辞書として取得
        print("手順2: マスタデータのIDマップを作成...")
        award_map = _get_master_data_map(cursor, AWARDS_TABLE_NAME)
        prefecture_map = _get_master_data_map(cursor, PREFECTURES_TABLE_NAME)
        genre_map = _get_master_data_map(cursor, GENRES_TABLE_NAME)
        print("-> IDマップの作成完了。")

        # 3. restaurants と restaurant_genres テーブルにデータを挿入
        print("手順3&4: 店舗情報とジャンル関連を保存...")
        restaurant_sql = f"""
            INSERT INTO {RESTAURANTS_TABLE_NAME} (
                url, name, place, prefecture_id, award_id,
                lunch_min, lunch_max, dinner_min, dinner_max, lat, lng
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                name=VALUES(name), place=VALUES(place), prefecture_id=VALUES(prefecture_id),
                award_id=VALUES(award_id), lunch_min=VALUES(lunch_min),
                lunch_max=VALUES(lunch_max), dinner_min=VALUES(dinner_min),
                dinner_max=VALUES(dinner_max), lat=VALUES(lat), lng=VALUES(lng)
        """
        genre_link_sql = f"INSERT IGNORE INTO {RESTAURANT_GENRES_TABLE_NAME} (restaurant_id, genre_id) VALUES (%s, %s)"

        for shop in all_shops_data:
            # IDを取得（見つからない場合はNone）
            prefecture_id = prefecture_map.get(shop['prefecture'])
            award_id = award_map.get(shop['award'])

            # restaurantsテーブルに挿入/更新
            shop_values = (
                shop['url'], shop['name'], shop['place'], prefecture_id, award_id,
                shop['lunch_min'], shop['lunch_max'], shop['dinner_min'], shop['dinner_max'],
                shop['lat'], shop['lng']
            )
            cursor.execute(restaurant_sql, shop_values)
            
            # 挿入/更新されたレストランのIDを取得
            restaurant_id = cursor.lastrowid
            if restaurant_id == 0: # 0の場合は更新されたことを意味するので、URLからIDを再取得
                cursor.execute(f"SELECT id FROM {RESTAURANTS_TABLE_NAME} WHERE url = %s", (shop['url'],))
                result = cursor.fetchone()
                if result: restaurant_id = result[0]

            if not restaurant_id: continue # レストランIDが取得できなければスキップ

            # restaurant_genresテーブルに挿入
            genre_link_data = []
            for genre_name in shop['genres']:
                genre_id = genre_map.get(genre_name)
                if genre_id:
                    genre_link_data.append((restaurant_id, genre_id))
            
            if genre_link_data:
                cursor.executemany(genre_link_sql, genre_link_data)

        conn.commit()
        print("-> 店舗データとジャンル関連の保存が完了しました。")

    except Error as e:
        print(f"データベースへの保存中にエラーが発生しました: {e}")
        if conn: conn.rollback() # エラー発生時はロールバック
    finally:
        if conn and conn.is_connected():
            if cursor: cursor.close()
            conn.close()
            print("\nデータベース接続を閉じました。")

if __name__ == "__main__":
    asyncio.run(main())