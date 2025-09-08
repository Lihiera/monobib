import os
from typing import List, Optional

from fastapi import Depends, FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import (Column, Float, ForeignKey, Integer, String, Table, Text,
                        and_, or_, create_engine)
from sqlalchemy.orm import declarative_base, relationship, sessionmaker, joinedload

## -----------------------------------------------------------------------------
## データベース設定
## -----------------------------------------------------------------------------

# 環境変数からDATABASE_URLを取得、なければデフォルト値を使用
DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "mysql+pymysql://test_user:test@localhost:3306/momobib",
)
engine = create_engine(DATABASE_URL, echo=False) # echo=TrueでSQLログ出力
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

## -----------------------------------------------------------------------------
## SQLAlchemy モデル (データベースのテーブル定義)
## -----------------------------------------------------------------------------

# --- マスタテーブル ---
class PrefectureDB(Base):
    __tablename__ = "prefectures"
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)

class AwardDB(Base):
    __tablename__ = "awards"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True, nullable=False)

class GenreDB(Base):
    __tablename__ = "genres"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True, nullable=False)

# --- 中間テーブル (多対多) ---
restaurant_genres_table = Table('restaurant_genres', Base.metadata,
    Column('restaurant_id', Integer, ForeignKey('restaurants.id'), primary_key=True),
    Column('genre_id', Integer, ForeignKey('genres.id'), primary_key=True)
)

# --- メインテーブル ---
class RestaurantDB(Base):
    __tablename__ = "restaurants"
    id = Column(Integer, primary_key=True)
    url = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), index=True)
    place = Column(Text)
    lunch_min = Column(Integer)
    lunch_max = Column(Integer)
    dinner_min = Column(Integer)
    dinner_max = Column(Integer)
    lat = Column(Float)
    lng = Column(Float)
    
    # --- リレーションシップ ---
    prefecture_id = Column(Integer, ForeignKey('prefectures.id'))
    prefecture = relationship("PrefectureDB")
    
    award_id = Column(Integer, ForeignKey('awards.id'))
    award = relationship("AwardDB")
    
    genres = relationship("GenreDB", secondary=restaurant_genres_table)


## -----------------------------------------------------------------------------
## Pydantic スキーマ (APIのレスポンス/リクエストの型定義)
## -----------------------------------------------------------------------------

# orm_mode=Trueは、SQLAlchemyモデルからPydanticモデルへの変換を許可する設定
class BaseConfig(BaseModel):
    class Config:
        orm_mode = True

class Prefecture(BaseConfig):
    id: int
    name: str

class Award(BaseConfig):
    id: int
    name: str

class Genre(BaseConfig):
    id: int
    name: str

class Restaurant(BaseConfig):
    id: int
    url: Optional[str]
    name: Optional[str]
    place: Optional[str]
    lunch_min: Optional[int]
    lunch_max: Optional[int]
    dinner_min: Optional[int]
    dinner_max: Optional[int]
    lat: Optional[float]
    lng: Optional[float]
    # ネストされたオブジェクトとして関連データをレスポンスに含める
    prefecture: Optional[Prefecture]
    award: Optional[Award]
    genres: List[Genre] = []


## -----------------------------------------------------------------------------
## FastAPI アプリケーション
## -----------------------------------------------------------------------------
app = FastAPI(title="Restaurant Guide API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # 本番環境ではフロントエンドのドメインを指定
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DBセッションを取得するための依存関係
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

## -----------------------------------------------------------------------------
## API エンドポイント
## -----------------------------------------------------------------------------

@app.get("/api/prefectures", response_model=List[Prefecture])
def get_prefectures(db: sessionmaker = Depends(get_db)):
    """都道府県マスタの一覧を取得する"""
    return db.query(PrefectureDB).order_by(PrefectureDB.id).all()

@app.get("/api/genres", response_model=List[Genre])
def get_genres(db: sessionmaker = Depends(get_db)):
    """ジャンルマスタの一覧を取得する"""
    return db.query(GenreDB).order_by(GenreDB.name).all()

@app.get("/api/awards", response_model=List[Award])
def get_awards(db: sessionmaker = Depends(get_db)):
    """アワードマスタの一覧を取得する"""
    return db.query(AwardDB).order_by(AwardDB.name).all()


@app.get("/api/restaurants", response_model=List[Restaurant])
def read_restaurants(
    # 修正点: Optional[str] から Optional[List[str]] に変更し、複数の値を受け取れるようにする
    name: Optional[str] = Query(None, description="店名（部分一致）"),
    prefecture: Optional[List[str]] = Query(None, description="都道府県名（複数選択可）"),
    genre: Optional[List[str]] = Query(None, description="ジャンル名（複数選択可）"),
    award: Optional[List[str]] = Query(None, description="アワード名（複数選択可）"), # 修正点: awardパラメータを追加
    min_price: Optional[int] = Query(None, alias="minPrice", description="最低価格 (¥)"),
    max_price: Optional[int] = Query(None, alias="maxPrice", description="最高価格 (¥)"),
    db: sessionmaker = Depends(get_db)
):
    """レストラン情報を検索する"""
    # ベースクエリ: N+1問題を避けるため、joinedloadで事前に関連データを読み込む
    query = db.query(RestaurantDB).options(
        joinedload(RestaurantDB.prefecture),
        joinedload(RestaurantDB.award),
        joinedload(RestaurantDB.genres)
    )

    # --- フィルター条件 ---
    if name:
        query = query.filter(RestaurantDB.name.contains(name))
    
    # 修正点: .in_() を使ってリスト内のいずれかの値に一致するものを検索 (OR検索)
    if prefecture:
        query = query.join(RestaurantDB.prefecture).filter(PrefectureDB.name.in_(prefecture))

    if genre:
        query = query.filter(RestaurantDB.genres.any(GenreDB.name.in_(genre)))

    # 修正点: awardのフィルタリングを追加
    if award:
        query = query.join(RestaurantDB.award).filter(AwardDB.name.in_(award))

    if min_price is not None or max_price is not None:
        price_filters = []
        # ランチとディナーのどちらかが価格範囲内であればヒットさせる
        if min_price is not None:
            lunch_min_cond = (RestaurantDB.lunch_max >= min_price)
            dinner_min_cond = (RestaurantDB.dinner_max >= min_price)
            price_filters.append(or_(lunch_min_cond, dinner_min_cond))
        
        if max_price is not None:
            lunch_max_cond = (RestaurantDB.lunch_min <= max_price)
            dinner_max_cond = (RestaurantDB.dinner_min <= max_price)
            price_filters.append(or_(lunch_max_cond, dinner_max_cond))
            
        query = query.filter(and_(*price_filters))

    results = query.limit(100).all() # 念のため取得件数を制限
    return results
