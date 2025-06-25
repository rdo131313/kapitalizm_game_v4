"use client"

import { CardDescription } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BookOpen,
  ShoppingCart,
  Star,
  User,
  Trophy,
  Crown,
  Medal,
  Award,
  Filter,
  Package,
  ArrowRight,
  Clock,
  TrendingUp,
} from "lucide-react"

interface Player {
  name: string
  cash: number
  foreignCurrency: number
  level: number
  experience: number
  experienceToNext: number
  hourlyIncome: number
  totalAssets: number
  totalCapital: number
}

interface ProductType {
  id: string
  name: string
  unit: string
  basePrice: number
  category: "hammadde" | "yarimamul" | "mamul" | "hizmet"
}

interface Business {
  id: number
  name: string
  category: string
  owned: number
  price: number
  minLevel: number
  description: string
  icon: string
  inputs: { productId: string; amount: number; unit: string }[]
  outputs: { productId: string; amount: number; unit: string }[]
  productionTime: number // dakika
  operatingCost: number // saatlik işletme maliyeti
}

interface MarketItem {
  productId: string
  quantity: number
  price: number
  seller: string
  timestamp: number
}

interface PlayerInventory {
  [productId: string]: number
}

interface NewsItem {
  id: number
  title: string
  description: string
  impact: "positive" | "negative" | "neutral"
  timestamp: string
}

interface LeaderboardPlayer {
  id: number
  name: string
  level: number
  capital: number
  hourlyIncome: number
  rank: number
}

export default function KapitalizmGame() {
  const [player, setPlayer] = useState<Player>({
    name: "Sen",
    cash: 50000,
    foreignCurrency: 0,
    level: 1,
    experience: 0,
    experienceToNext: 1000,
    hourlyIncome: 0,
    totalAssets: 50000,
    totalCapital: 50000,
  })

  // Ürün tipleri - Genişletilmiş
  const [productTypes] = useState<ProductType[]>([
    // Hammaddeler - Tarım
    { id: "bugday", name: "Buğday", unit: "kg", basePrice: 3, category: "hammadde" },
    { id: "misir", name: "Mısır", unit: "kg", basePrice: 2.5, category: "hammadde" },
    { id: "domates", name: "Domates", unit: "kg", basePrice: 8, category: "hammadde" },
    { id: "elma", name: "Elma", unit: "kg", basePrice: 6, category: "hammadde" },
    { id: "zeytin", name: "Zeytin", unit: "kg", basePrice: 12, category: "hammadde" },

    // Hammaddeler - Hayvancılık
    { id: "sut", name: "Süt", unit: "litre", basePrice: 4, category: "hammadde" },
    { id: "yumurta", name: "Yumurta", unit: "adet", basePrice: 1, category: "hammadde" },
    { id: "et", name: "Et", unit: "kg", basePrice: 45, category: "hammadde" },
    { id: "yun", name: "Yün", unit: "kg", basePrice: 25, category: "hammadde" },
    { id: "balik", name: "Balık", unit: "kg", basePrice: 25, category: "hammadde" },
    { id: "bal", name: "Bal", unit: "kg", basePrice: 80, category: "hammadde" },

    // Hammaddeler - Maden
    { id: "demir", name: "Demir", unit: "ton", basePrice: 2500, category: "hammadde" },
    { id: "bakir", name: "Bakır", unit: "ton", basePrice: 8500, category: "hammadde" },
    { id: "altin", name: "Altın", unit: "gram", basePrice: 1800, category: "hammadde" },
    { id: "gumus", name: "Gümüş", unit: "gram", basePrice: 25, category: "hammadde" },
    { id: "elmas", name: "Elmas", unit: "karat", basePrice: 5000, category: "hammadde" },
    { id: "komur", name: "Kömür", unit: "ton", basePrice: 800, category: "hammadde" },

    // Yarı Mamuller
    { id: "un", name: "Un", unit: "kg", basePrice: 4, category: "yarimamul" },
    { id: "ekmek", name: "Ekmek", unit: "adet", basePrice: 3, category: "yarimamul" },
    { id: "pizza", name: "Pizza", unit: "adet", basePrice: 25, category: "yarimamul" },
    { id: "doner", name: "Döner", unit: "adet", basePrice: 15, category: "yarimamul" },
    { id: "celik", name: "Çelik", unit: "ton", basePrice: 4500, category: "yarimamul" },
    { id: "motor", name: "Motor", unit: "adet", basePrice: 15000, category: "yarimamul" },
    { id: "telefon", name: "Telefon", unit: "adet", basePrice: 3500, category: "yarimamul" },
    { id: "ilac", name: "İlaç", unit: "kutu", basePrice: 15, category: "yarimamul" },
    { id: "tekstil", name: "Tekstil", unit: "metre", basePrice: 20, category: "yarimamul" },
    { id: "zeytinyagi", name: "Zeytinyağı", unit: "litre", basePrice: 35, category: "yarimamul" },

    // Mamuller
    { id: "otomobil", name: "Otomobil", unit: "adet", basePrice: 250000, category: "mamul" },
    { id: "mucevher", name: "Mücevher", unit: "adet", basePrice: 5000, category: "mamul" },
    { id: "giyim", name: "Giyim", unit: "adet", basePrice: 80, category: "mamul" },
    { id: "ev", name: "Ev", unit: "adet", basePrice: 350000, category: "mamul" },

    // Hizmetler
    { id: "ulasim", name: "Ulaşım Hizmeti", unit: "hizmet", basePrice: 10, category: "hizmet" },
    { id: "finans", name: "Finans Hizmeti", unit: "işlem", basePrice: 5, category: "hizmet" },
    { id: "gayrimenkul", name: "Gayrimenkul Hizmeti", unit: "kira", basePrice: 500, category: "hizmet" },
    { id: "limonata", name: "Limonata", unit: "bardak", basePrice: 5, category: "hizmet" },
    { id: "gazete", name: "Gazete", unit: "adet", basePrice: 2, category: "hizmet" },
    { id: "ayakkabi_boyama", name: "Ayakkabı Boyama", unit: "çift", basePrice: 10, category: "hizmet" },
  ])

  // Tüm 46 İşletme - Tedarik Zinciri ile
  const [businesses, setBusinesses] = useState<Business[]>([
    // BAŞLANGIÇ İŞLETMELERİ (Hammadde gerektirmez, direkt para kazandırır)
    {
      id: 1,
      name: "Limonata Standı",
      category: "Küçük İşletme",
      owned: 0,
      price: 500,
      minLevel: 1,
      description: "Basit limonata satışı. Hammadde gerektirmez, direkt müşteri hizmeti.",
      icon: "🍋",
      inputs: [],
      outputs: [{ productId: "limonata", amount: 20, unit: "bardak" }],
      productionTime: 10,
      operatingCost: 50,
    },
    {
      id: 2,
      name: "Gazete Bayii",
      category: "Küçük İşletme",
      owned: 0,
      price: 1500,
      minLevel: 1,
      description: "Gazete satışı. Gazeteler otomatik tedarik edilir.",
      icon: "📰",
      inputs: [],
      outputs: [{ productId: "gazete", amount: 50, unit: "adet" }],
      productionTime: 15,
      operatingCost: 100,
    },
    {
      id: 3,
      name: "Ayakkabı Boyacısı",
      category: "Küçük İşletme",
      owned: 0,
      price: 800,
      minLevel: 1,
      description: "Ayakkabı boyama hizmeti. Doğrudan hizmet satışı.",
      icon: "👞",
      inputs: [],
      outputs: [{ productId: "ayakkabi_boyama", amount: 8, unit: "çift" }],
      productionTime: 20,
      operatingCost: 75,
    },

    // TARIMI VE HAYVANCILIK (Hammadde Üreticileri)
    {
      id: 4,
      name: "Buğday Tarlası",
      category: "Tarım",
      owned: 0,
      price: 65000,
      minLevel: 3,
      description: "Buğday üretimi. Fırınlara hammadde sağlar.",
      icon: "🌾",
      inputs: [],
      outputs: [{ productId: "bugday", amount: 100, unit: "kg" }],
      productionTime: 60,
      operatingCost: 500,
    },
    {
      id: 5,
      name: "Mısır Tarlası",
      category: "Tarım",
      owned: 0,
      price: 55000,
      minLevel: 3,
      description: "Mısır üretimi. Hayvancılık sektörüne yem sağlar.",
      icon: "🌽",
      inputs: [],
      outputs: [{ productId: "misir", amount: 120, unit: "kg" }],
      productionTime: 55,
      operatingCost: 400,
    },
    {
      id: 6,
      name: "Domates Serası",
      category: "Tarım",
      owned: 0,
      price: 42000,
      minLevel: 3,
      description: "Sera domatesi üretimi. Restoran ve pizzacılara satış.",
      icon: "🍅",
      inputs: [],
      outputs: [{ productId: "domates", amount: 80, unit: "kg" }],
      productionTime: 45,
      operatingCost: 300,
    },
    {
      id: 7,
      name: "Meyve Bahçesi",
      category: "Tarım",
      owned: 0,
      price: 78000,
      minLevel: 4,
      description: "Elma üretimi. Manav ve marketlere satış.",
      icon: "🍎",
      inputs: [],
      outputs: [{ productId: "elma", amount: 60, unit: "kg" }],
      productionTime: 90,
      operatingCost: 400,
    },
    {
      id: 8,
      name: "Zeytin Bahçesi",
      category: "Tarım",
      owned: 0,
      price: 95000,
      minLevel: 4,
      description: "Zeytin üretimi. Zeytinyağı fabrikasına hammadde.",
      icon: "🫒",
      inputs: [],
      outputs: [{ productId: "zeytin", amount: 70, unit: "kg" }],
      productionTime: 120,
      operatingCost: 600,
    },

    // HAYVANCILIK
    {
      id: 9,
      name: "Tavuk Çiftliği",
      category: "Çiftlik",
      owned: 0,
      price: 45000,
      minLevel: 3,
      description: "Yumurta üretimi. Mısır tüketir, yumurta üretir.",
      icon: "🐔",
      inputs: [{ productId: "misir", amount: 15, unit: "kg" }],
      outputs: [{ productId: "yumurta", amount: 100, unit: "adet" }],
      productionTime: 20,
      operatingCost: 400,
    },
    {
      id: 10,
      name: "İnek Çiftliği",
      category: "Çiftlik",
      owned: 0,
      price: 95000,
      minLevel: 4,
      description: "Süt ve et üretimi. Mısır tüketir.",
      icon: "🐄",
      inputs: [{ productId: "misir", amount: 20, unit: "kg" }],
      outputs: [
        { productId: "sut", amount: 50, unit: "litre" },
        { productId: "et", amount: 5, unit: "kg" },
      ],
      productionTime: 30,
      operatingCost: 800,
    },
    {
      id: 11,
      name: "Koyun Çiftliği",
      category: "Çiftlik",
      owned: 0,
      price: 75000,
      minLevel: 4,
      description: "Yün, süt ve et üretimi. Çok amaçlı çiftlik.",
      icon: "🐑",
      inputs: [{ productId: "misir", amount: 12, unit: "kg" }],
      outputs: [
        { productId: "yun", amount: 8, unit: "kg" },
        { productId: "sut", amount: 20, unit: "litre" },
        { productId: "et", amount: 3, unit: "kg" },
      ],
      productionTime: 40,
      operatingCost: 600,
    },
    {
      id: 12,
      name: "Balık Çiftliği",
      category: "Çiftlik",
      owned: 0,
      price: 85000,
      minLevel: 4,
      description: "Balık üretimi. Restoranlara satış.",
      icon: "🐟",
      inputs: [],
      outputs: [{ productId: "balik", amount: 25, unit: "kg" }],
      productionTime: 50,
      operatingCost: 700,
    },
    {
      id: 13,
      name: "Arı Çiftliği",
      category: "Çiftlik",
      owned: 0,
      price: 35000,
      minLevel: 3,
      description: "Bal üretimi. Doğal ürün, yüksek talep.",
      icon: "🐝",
      inputs: [],
      outputs: [{ productId: "bal", amount: 15, unit: "kg" }],
      productionTime: 60,
      operatingCost: 300,
    },

    // MADEN OCAKLARI
    {
      id: 14,
      name: "Kömür Ocağı",
      category: "Maden",
      owned: 0,
      price: 180000,
      minLevel: 5,
      description: "Kömür çıkarımı. Çelik fabrikasına hammadde.",
      icon: "⚫",
      inputs: [],
      outputs: [{ productId: "komur", amount: 15, unit: "ton" }],
      productionTime: 90,
      operatingCost: 1500,
    },
    {
      id: 15,
      name: "Demir Madeni",
      category: "Maden",
      owned: 0,
      price: 320000,
      minLevel: 6,
      description: "Demir cevheri çıkarımı. Çelik üretimi için gerekli.",
      icon: "🔩",
      inputs: [],
      outputs: [{ productId: "demir", amount: 10, unit: "ton" }],
      productionTime: 120,
      operatingCost: 2000,
    },
    {
      id: 16,
      name: "Bakır Madeni",
      category: "Maden",
      owned: 0,
      price: 280000,
      minLevel: 6,
      description: "Bakır çıkarımı. Elektronik sektörüne hammadde.",
      icon: "🟤",
      inputs: [],
      outputs: [{ productId: "bakir", amount: 5, unit: "ton" }],
      productionTime: 150,
      operatingCost: 1800,
    },
    {
      id: 17,
      name: "Gümüş Madeni",
      category: "Maden",
      owned: 0,
      price: 650000,
      minLevel: 8,
      description: "Gümüş çıkarımı. Kuyumculuk sektörüne hammadde.",
      icon: "⚪",
      inputs: [],
      outputs: [{ productId: "gumus", amount: 500, unit: "gram" }],
      productionTime: 180,
      operatingCost: 3000,
    },
    {
      id: 18,
      name: "Altın Madeni",
      category: "Maden",
      owned: 0,
      price: 1200000,
      minLevel: 10,
      description: "Altın çıkarımı. Kuyumculuk için en değerli hammadde.",
      icon: "🟡",
      inputs: [],
      outputs: [{ productId: "altin", amount: 200, unit: "gram" }],
      productionTime: 240,
      operatingCost: 5000,
    },
    {
      id: 19,
      name: "Elmas Madeni",
      category: "Maden",
      owned: 0,
      price: 2500000,
      minLevel: 12,
      description: "Elmas çıkarımı. Lüks mücevher için en değerli taş.",
      icon: "💎",
      inputs: [],
      outputs: [{ productId: "elmas", amount: 10, unit: "karat" }],
      productionTime: 300,
      operatingCost: 8000,
    },

    // İŞLEME VE ÜRETİM FABRİKALARI
    {
      id: 20,
      name: "Fırın",
      category: "İşleme",
      owned: 0,
      price: 35000,
      minLevel: 2,
      description: "Buğdaydan un ve ekmek üretir. Marketlere satış.",
      icon: "🍞",
      inputs: [{ productId: "bugday", amount: 50, unit: "kg" }],
      outputs: [
        { productId: "un", amount: 40, unit: "kg" },
        { productId: "ekmek", amount: 80, unit: "adet" },
      ],
      productionTime: 30,
      operatingCost: 600,
    },
    {
      id: 21,
      name: "Tekstil Fabrikası",
      category: "Fabrika",
      owned: 0,
      price: 450000,
      minLevel: 7,
      description: "Yünden tekstil üretir. Giyim mağazalarına hammadde.",
      icon: "🧵",
      inputs: [{ productId: "yun", amount: 20, unit: "kg" }],
      outputs: [{ productId: "tekstil", amount: 100, unit: "metre" }],
      productionTime: 90,
      operatingCost: 2500,
    },
    {
      id: 22,
      name: "Çelik Fabrikası",
      category: "Fabrika",
      owned: 0,
      price: 850000,
      minLevel: 9,
      description: "Demir ve kömürden çelik üretir. Otomotiv sektörüne hammadde.",
      icon: "🏗️",
      inputs: [
        { productId: "demir", amount: 5, unit: "ton" },
        { productId: "komur", amount: 2, unit: "ton" },
      ],
      outputs: [{ productId: "celik", amount: 4, unit: "ton" }],
      productionTime: 180,
      operatingCost: 5000,
    },
    {
      id: 23,
      name: "Otomotiv Fabrikası",
      category: "Fabrika",
      owned: 0,
      price: 2200000,
      minLevel: 12,
      description: "Çelik ve motordan otomobil üretir.",
      icon: "🚗",
      inputs: [
        { productId: "celik", amount: 2, unit: "ton" },
        { productId: "motor", amount: 1, unit: "adet" },
      ],
      outputs: [{ productId: "otomobil", amount: 1, unit: "adet" }],
      productionTime: 300,
      operatingCost: 15000,
    },
    {
      id: 24,
      name: "Elektronik Fabrikası",
      category: "Fabrika",
      owned: 0,
      price: 1800000,
      minLevel: 11,
      description: "Bakırdan telefon ve elektronik üretir.",
      icon: "📱",
      inputs: [{ productId: "bakir", amount: 1, unit: "ton" }],
      outputs: [
        { productId: "telefon", amount: 200, unit: "adet" },
        { productId: "motor", amount: 5, unit: "adet" },
      ],
      productionTime: 150,
      operatingCost: 8000,
    },
    {
      id: 25,
      name: "İlaç Fabrikası",
      category: "Fabrika",
      owned: 0,
      price: 3200000,
      minLevel: 14,
      description: "İlaç üretimi. Eczanelere satış.",
      icon: "💉",
      inputs: [],
      outputs: [{ productId: "ilac", amount: 500, unit: "kutu" }],
      productionTime: 120,
      operatingCost: 12000,
    },

    // RESTORAN VE GIDA İŞLETMELERİ
    {
      id: 26,
      name: "Büfe",
      category: "Restoran",
      owned: 0,
      price: 12000,
      minLevel: 2,
      description: "Basit atıştırmalık satışı. Direkt müşteri hizmeti.",
      icon: "🥪",
      inputs: [],
      outputs: [{ productId: "ulasim", amount: 30, unit: "hizmet" }],
      productionTime: 15,
      operatingCost: 200,
    },
    {
      id: 27,
      name: "Dönerci",
      category: "Restoran",
      owned: 0,
      price: 28000,
      minLevel: 2,
      description: "Etten döner üretir ve satar.",
      icon: "🌯",
      inputs: [{ productId: "et", amount: 8, unit: "kg" }],
      outputs: [{ productId: "doner", amount: 50, unit: "adet" }],
      productionTime: 25,
      operatingCost: 800,
    },
    {
      id: 28,
      name: "Pizzacı",
      category: "Restoran",
      owned: 0,
      price: 55000,
      minLevel: 3,
      description: "Un ve domatesten pizza üretir.",
      icon: "🍕",
      inputs: [
        { productId: "un", amount: 20, unit: "kg" },
        { productId: "domates", amount: 30, unit: "kg" },
      ],
      outputs: [{ productId: "pizza", amount: 50, unit: "adet" }],
      productionTime: 25,
      operatingCost: 800,
    },
    {
      id: 29,
      name: "Restoran",
      category: "Restoran",
      owned: 0,
      price: 85000,
      minLevel: 4,
      description: "Et, balık ve diğer malzemelerden yemek satar.",
      icon: "🍽️",
      inputs: [
        { productId: "et", amount: 10, unit: "kg" },
        { productId: "balik", amount: 5, unit: "kg" },
        { productId: "domates", amount: 15, unit: "kg" },
      ],
      outputs: [],
      productionTime: 20,
      operatingCost: 2000,
    },
    {
      id: 30,
      name: "Lüks Restoran",
      category: "Restoran",
      owned: 0,
      price: 250000,
      minLevel: 6,
      description: "Yüksek kalite yemek servisi. Premium malzemeler kullanır.",
      icon: "🥂",
      inputs: [
        { productId: "et", amount: 15, unit: "kg" },
        { productId: "balik", amount: 10, unit: "kg" },
        { productId: "bal", amount: 3, unit: "kg" },
      ],
      outputs: [],
      productionTime: 30,
      operatingCost: 5000,
    },

    // PERAKENDE MAĞAZALAR
    {
      id: 31,
      name: "Market",
      category: "Perakende",
      owned: 0,
      price: 25000,
      minLevel: 2,
      description: "Gıda ürünlerini müşterilere satar.",
      icon: "🏪",
      inputs: [
        { productId: "ekmek", amount: 50, unit: "adet" },
        { productId: "sut", amount: 30, unit: "litre" },
        { productId: "yumurta", amount: 60, unit: "adet" },
      ],
      outputs: [],
      productionTime: 15,
      operatingCost: 1200,
    },
    {
      id: 32,
      name: "Manav",
      category: "Perakende",
      owned: 0,
      price: 18000,
      minLevel: 2,
      description: "Taze meyve ve sebze satar.",
      icon: "🥕",
      inputs: [
        { productId: "domates", amount: 40, unit: "kg" },
        { productId: "elma", amount: 30, unit: "kg" },
      ],
      outputs: [],
      productionTime: 10,
      operatingCost: 800,
    },
    {
      id: 33,
      name: "Kırtasiye",
      category: "Perakende",
      owned: 0,
      price: 15000,
      minLevel: 2,
      description: "Okul ve ofis malzemeleri satar.",
      icon: "📚",
      inputs: [],
      outputs: [],
      productionTime: 20,
      operatingCost: 600,
    },
    {
      id: 34,
      name: "Giyim Mağazası",
      category: "Perakende",
      owned: 0,
      price: 45000,
      minLevel: 3,
      description: "Tekstilden giyim üretir ve satar.",
      icon: "👕",
      inputs: [{ productId: "tekstil", amount: 20, unit: "metre" }],
      outputs: [{ productId: "giyim", amount: 15, unit: "adet" }],
      productionTime: 40,
      operatingCost: 1500,
    },
    {
      id: 35,
      name: "Eczane",
      category: "Perakende",
      owned: 0,
      price: 65000,
      minLevel: 3,
      description: "İlaç ve sağlık ürünleri satar.",
      icon: "💊",
      inputs: [{ productId: "ilac", amount: 100, unit: "kutu" }],
      outputs: [],
      productionTime: 30,
      operatingCost: 2000,
    },
    {
      id: 36,
      name: "Kuyumcu",
      category: "Perakende",
      owned: 0,
      price: 120000,
      minLevel: 4,
      description: "Altın ve gümüşten mücevher üretir ve satar.",
      icon: "💍",
      inputs: [
        { productId: "altin", amount: 50, unit: "gram" },
        { productId: "gumus", amount: 100, unit: "gram" },
        { productId: "elmas", amount: 2, unit: "karat" },
      ],
      outputs: [{ productId: "mucevher", amount: 5, unit: "adet" }],
      productionTime: 60,
      operatingCost: 3000,
    },

    // ULAŞIM HİZMETLERİ
    {
      id: 37,
      name: "Taksi",
      category: "Ulaşım",
      owned: 0,
      price: 25000,
      minLevel: 2,
      description: "Şehir içi ulaşım hizmeti verir.",
      icon: "🚕",
      inputs: [],
      outputs: [{ productId: "ulasim", amount: 50, unit: "hizmet" }],
      productionTime: 10,
      operatingCost: 400,
    },
    {
      id: 38,
      name: "Minibüs",
      category: "Ulaşım",
      owned: 0,
      price: 85000,
      minLevel: 4,
      description: "Toplu ulaşım hizmeti. Daha fazla müşteri kapasitesi.",
      icon: "🚐",
      inputs: [],
      outputs: [{ productId: "ulasim", amount: 200, unit: "hizmet" }],
      productionTime: 15,
      operatingCost: 1000,
    },
    {
      id: 39,
      name: "Kamyon",
      category: "Ulaşım",
      owned: 0,
      price: 180000,
      minLevel: 6,
      description: "Nakliye hizmeti. Fabrikalar arası taşımacılık.",
      icon: "🚛",
      inputs: [],
      outputs: [{ productId: "ulasim", amount: 100, unit: "hizmet" }],
      productionTime: 30,
      operatingCost: 2000,
    },
    {
      id: 40,
      name: "Havayolu Şirketi",
      category: "Ulaşım",
      owned: 0,
      price: 25000000,
      minLevel: 15,
      description: "Ulusal havayolu hizmeti. Çok yüksek kapasite.",
      icon: "✈️",
      inputs: [],
      outputs: [{ productId: "ulasim", amount: 5000, unit: "hizmet" }],
      productionTime: 60,
      operatingCost: 50000,
    },

    // GAYRİMENKUL
    {
      id: 41,
      name: "Daire",
      category: "Gayrimenkul",
      owned: 0,
      price: 350000,
      minLevel: 6,
      description: "Konut kirası. Aylık kira geliri sağlar.",
      icon: "🏠",
      inputs: [],
      outputs: [{ productId: "gayrimenkul", amount: 1, unit: "kira" }],
      productionTime: 1440, // 24 saat
      operatingCost: 500,
    },
    {
      id: 42,
      name: "Ofis Binası",
      category: "Gayrimenkul",
      owned: 0,
      price: 1500000,
      minLevel: 10,
      description: "Ticari ofis kirası. Şirketlere kiralama.",
      icon: "🏢",
      inputs: [],
      outputs: [{ productId: "gayrimenkul", amount: 5, unit: "kira" }],
      productionTime: 1440,
      operatingCost: 2000,
    },
    {
      id: 43,
      name: "Alışveriş Merkezi",
      category: "Gayrimenkul",
      owned: 0,
      price: 8500000,
      minLevel: 16,
      description: "Büyük AVM. Mağaza kiralarından yüksek gelir.",
      icon: "🏬",
      inputs: [],
      outputs: [{ productId: "gayrimenkul", amount: 20, unit: "kira" }],
      productionTime: 1440,
      operatingCost: 10000,
    },

    // FİNANS HİZMETLERİ
    {
      id: 44,
      name: "ATM",
      category: "Finans",
      owned: 0,
      price: 45000,
      minLevel: 3,
      description: "Bankamatik işletmeciliği. İşlem komisyonu kazancı.",
      icon: "🏧",
      inputs: [],
      outputs: [{ productId: "finans", amount: 100, unit: "işlem" }],
      productionTime: 5,
      operatingCost: 200,
    },
    {
      id: 45,
      name: "Döviz Bürosu",
      category: "Finans",
      owned: 0,
      price: 125000,
      minLevel: 5,
      description: "Döviz alım-satım. Kur farkından kazanç.",
      icon: "💱",
      inputs: [],
      outputs: [{ productId: "finans", amount: 50, unit: "işlem" }],
      productionTime: 20,
      operatingCost: 800,
    },
    {
      id: 46,
      name: "Banka",
      category: "Finans",
      owned: 0,
      price: 100000000,
      minLevel: 20,
      description: "Özel banka. Tüm finansal hizmetler.",
      icon: "🏦",
      inputs: [],
      outputs: [{ productId: "finans", amount: 2000, unit: "işlem" }],
      productionTime: 30,
      operatingCost: 25000,
    },
  ])

  const [playerInventory, setPlayerInventory] = useState<PlayerInventory>({})
  const [market, setMarket] = useState<MarketItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü")
  const [buyQuantity, setBuyQuantity] = useState<{ [key: number]: number }>({})

  const [news] = useState<NewsItem[]>([
    {
      id: 1,
      title: "Tarım Ürünleri Fiyatları Yükseldi",
      description: "Hava koşulları nedeniyle buğday ve meyve fiyatları %15 arttı. Fırın sahipleri dikkat!",
      impact: "negative",
      timestamp: "1 saat önce",
    },
    {
      id: 2,
      title: "Otomotiv Sektöründe Canlanma",
      description: "Yeni teşvikler sonrası otomobil satışları artıyor. Çelik talebi yükseldi.",
      impact: "positive",
      timestamp: "3 saat önce",
    },
    {
      id: 3,
      title: "Tekstil İhracatı Arttı",
      description: "Yün fiyatları düştü, tekstil üretimi karlı hale geldi. Koyun çiftliği sahipleri etkilendi.",
      impact: "neutral",
      timestamp: "5 saat önce",
    },
    {
      id: 4,
      title: "Altın Fiyatları Rekor Kırdı",
      description: "Küresel belirsizlik nedeniyle altın ve gümüş fiyatları %20 arttı. Kuyumcular heyecanlı.",
      impact: "positive",
      timestamp: "8 saat önce",
    },
  ])

  const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([
    {
      id: 1,
      name: "Ahmet Kaya",
      level: 25,
      capital: 850000000,
      hourlyIncome: 45000000,
      rank: 1,
    },
    {
      id: 2,
      name: "Mehmet Özkan",
      level: 22,
      capital: 650000000,
      hourlyIncome: 32000000,
      rank: 2,
    },
    {
      id: 3,
      name: "Ayşe Demir",
      level: 20,
      capital: 420000000,
      hourlyIncome: 28000000,
      rank: 3,
    },
  ])

  const [chartData, setChartData] = useState([
    { day: "Pzt", value: 0 },
    { day: "Sal", value: 0 },
    { day: "Çar", value: 0 },
    { day: "Per", value: 0 },
    { day: "Cum", value: 0 },
    { day: "Cmt", value: 0 },
    { day: "Paz", value: 0 },
  ])

  // Kategorileri al
  const categories = ["Tümü", ...Array.from(new Set(businesses.map((b) => b.category)))]

  // Filtrelenmiş işletmeler
  const filteredBusinesses =
    selectedCategory === "Tümü" ? businesses : businesses.filter((b) => b.category === selectedCategory)

  // Üretim simülasyonu
  useEffect(() => {
    const interval = setInterval(() => {
      businesses.forEach((business) => {
        if (business.owned > 0) {
          // Her işletme için üretim yap
          for (let i = 0; i < business.owned; i++) {
            // Hammadde kontrolü
            let canProduce = true
            const requiredInputs: { [key: string]: number } = {}

            business.inputs.forEach((input) => {
              const available = playerInventory[input.productId] || 0
              if (available < input.amount) {
                canProduce = false
              } else {
                requiredInputs[input.productId] = input.amount
              }
            })

            if (canProduce) {
              // Hammaddeleri tüket
              Object.entries(requiredInputs).forEach(([productId, amount]) => {
                setPlayerInventory((prev) => ({
                  ...prev,
                  [productId]: Math.max(0, (prev[productId] || 0) - amount),
                }))
              })

              // Ürün üret
              business.outputs.forEach((output) => {
                setPlayerInventory((prev) => ({
                  ...prev,
                  [output.productId]: (prev[output.productId] || 0) + output.amount,
                }))

                // Eğer hizmet sektörü değilse, ürünü pazara koy
                if (business.category !== "Perakende" && business.category !== "Restoran") {
                  const productType = productTypes.find((p) => p.id === output.productId)
                  if (productType && productType.category !== "hizmet") {
                    const marketPrice = productType.basePrice * (0.8 + Math.random() * 0.4) // ±20% fiyat dalgalanması

                    setMarket((prev) => [
                      ...prev,
                      {
                        productId: output.productId,
                        quantity: output.amount,
                        price: marketPrice,
                        seller: "Sen",
                        timestamp: Date.now(),
                      },
                    ])
                  }
                }
              })

              // İşletme maliyeti
              setPlayer((prev) => ({
                ...prev,
                cash: prev.cash - business.operatingCost / 60, // dakikalık maliyet
              }))

              // Perakende ve restoran ise direkt para kazan
              if (business.category === "Perakende" || business.category === "Restoran") {
                let revenue = 0

                if (business.inputs.length > 0) {
                  revenue = business.inputs.reduce((total, input) => {
                    const productType = productTypes.find((p) => p.id === input.productId)
                    return total + (productType?.basePrice || 0) * input.amount * 1.8 // %80 kar marjı
                  }, 0)
                } else {
                  // Hammadde gerektirmeyen işletmeler için sabit gelir
                  revenue = business.operatingCost * 3 // 3x maliyet oranında gelir
                }

                setPlayer((prev) => ({
                  ...prev,
                  cash: prev.cash + revenue,
                }))
              }

              // Hizmet sektörleri için direkt para kazan
              if (
                business.category === "Ulaşım" ||
                business.category === "Finans" ||
                business.category === "Gayrimenkul"
              ) {
                const revenue = business.operatingCost * 2.5 // 2.5x maliyet oranında gelir
                setPlayer((prev) => ({
                  ...prev,
                  cash: prev.cash + revenue,
                }))
              }
            }
          }
        }
      })

      // Otomatik pazar alımları (AI oyuncular)
      setMarket((prev) => {
        const updatedMarket = [...prev]
        const toRemove: number[] = []

        updatedMarket.forEach((item, index) => {
          // %15 şans ile ürün satılır
          if (Math.random() < 0.15) {
            setPlayer((prevPlayer) => ({
              ...prevPlayer,
              cash: prevPlayer.cash + item.price * item.quantity,
            }))
            toRemove.push(index)
          }
        })

        return updatedMarket.filter((_, index) => !toRemove.includes(index))
      })

      // Eski pazar öğelerini temizle (24 saatten eski)
      setMarket((prev) => prev.filter((item) => Date.now() - item.timestamp < 24 * 60 * 60 * 1000))
    }, 60000) // Her dakika

    return () => clearInterval(interval)
  }, [businesses, playerInventory, productTypes])

  // Sermaye hesaplama
  useEffect(() => {
    const assetsValue = businesses.reduce((total, business) => {
      return total + business.owned * business.price
    }, 0)

    const inventoryValue = Object.entries(playerInventory).reduce((total, [productId, quantity]) => {
      const productType = productTypes.find((p) => p.id === productId)
      return total + (productType?.basePrice || 0) * quantity
    }, 0)

    const totalCapital = player.cash + assetsValue + inventoryValue

    setPlayer((prev) => ({
      ...prev,
      totalAssets: assetsValue + inventoryValue,
      totalCapital: totalCapital,
    }))
  }, [businesses, playerInventory, productTypes, player.cash])

  // Seviye atlama kontrolü
  useEffect(() => {
    if (player.experience >= player.experienceToNext) {
      setPlayer((prev) => ({
        ...prev,
        level: prev.level + 1,
        experience: prev.experience - prev.experienceToNext,
        experienceToNext: Math.floor(prev.experienceToNext * 1.5),
      }))
    }
  }, [player.experience, player.experienceToNext])

  const buyBusiness = (businessId: number, quantity = 1) => {
    const business = businesses.find((b) => b.id === businessId)
    if (!business) return

    const totalCost = business.price * quantity

    if (player.cash >= totalCost && player.level >= business.minLevel) {
      setPlayer((prev) => ({
        ...prev,
        cash: prev.cash - totalCost,
        experience: prev.experience + totalCost / 100,
      }))

      setBusinesses((prev) => prev.map((b) => (b.id === businessId ? { ...b, owned: b.owned + quantity } : b)))

      setBuyQuantity((prev) => ({ ...prev, [businessId]: 1 }))
    }
  }

  const sellBusiness = (businessId: number, quantity = 1) => {
    const business = businesses.find((b) => b.id === businessId)
    if (!business || business.owned < quantity) return

    const sellPrice = Math.floor(business.price * 0.8) * quantity

    setPlayer((prev) => ({
      ...prev,
      cash: prev.cash + sellPrice,
    }))

    setBusinesses((prev) => prev.map((b) => (b.id === businessId ? { ...b, owned: b.owned - quantity } : b)))
  }

  const buyFromMarket = (marketIndex: number) => {
    const item = market[marketIndex]
    const totalCost = item.price * item.quantity

    if (player.cash >= totalCost) {
      setPlayer((prev) => ({
        ...prev,
        cash: prev.cash - totalCost,
      }))

      setPlayerInventory((prev) => ({
        ...prev,
        [item.productId]: (prev[item.productId] || 0) + item.quantity,
      }))

      setMarket((prev) => prev.filter((_, index) => index !== marketIndex))
    }
  }

  const maxValue = Math.max(...chartData.map((d) => d.value), 1)

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return <Trophy className="w-4 h-4 text-gray-500" />
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white"
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Küçük İşletme": "bg-green-100 text-green-800",
      Tarım: "bg-green-200 text-green-900",
      Çiftlik: "bg-yellow-100 text-yellow-800",
      Maden: "bg-gray-100 text-gray-800",
      İşleme: "bg-blue-100 text-blue-800",
      Fabrika: "bg-purple-100 text-purple-800",
      Restoran: "bg-orange-100 text-orange-800",
      Perakende: "bg-pink-100 text-pink-800",
      Ulaşım: "bg-cyan-100 text-cyan-800",
      Gayrimenkul: "bg-indigo-100 text-indigo-800",
      Finans: "bg-red-100 text-red-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            KAPİTALİZM
          </div>
          <Badge variant="secondary" className="text-sm">
            Gerçek Ekonomi Simülasyonu - 46 İşletme
          </Badge>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="trading" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              İşletmeler
            </TabsTrigger>
            <TabsTrigger value="market" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Pazar
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Haberler
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Sıralama
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Sekmesi */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Oyuncu Bilgileri */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Profil Bilgileri
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <Avatar className="w-20 h-20 mx-auto mb-3">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                        {player.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-semibold text-lg">{player.name}</div>
                    <Badge variant="outline" className="mt-1">
                      Seviye {player.level}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Nakit Para:</span>
                      <span className="font-bold text-green-600">
                        {Math.floor(player.cash).toLocaleString("tr-TR")} TL
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Varlık Değeri:</span>
                      <span className="font-bold text-blue-600">
                        {Math.floor(player.totalAssets).toLocaleString("tr-TR")} TL
                      </span>
                    </div>

                    <div className="flex justify-between items-center border-t pt-2">
                      <span className="text-sm font-semibold text-gray-800">Toplam Sermaye:</span>
                      <span className="font-bold text-purple-600 text-lg">
                        {Math.floor(player.totalCapital).toLocaleString("tr-TR")} TL
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Deneyim</span>
                      <span>
                        {Math.floor(player.experience)}/{Math.floor(player.experienceToNext)}
                      </span>
                    </div>
                    <Progress value={(player.experience / player.experienceToNext) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Başlangıç Rehberi */}
              <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Clock className="w-5 h-5" />
                    Yeni Başlayanlar İçin
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-green-700 mb-3">
                    İlk yatırımınızı yapın! Bu 3 seçenek bütçenize uygun:
                  </div>

                  <div className="space-y-2">
                    <div className="p-2 bg-white rounded border border-green-200">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🍋</span>
                        <div>
                          <div className="font-semibold text-sm">Limonata Standı</div>
                          <div className="text-xs text-gray-600">500 TL - Hammadde gerektirmez</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-2 bg-white rounded border border-green-200">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">👞</span>
                        <div>
                          <div className="font-semibold text-sm">Ayakkabı Boyacısı</div>
                          <div className="text-xs text-gray-600">800 TL - Hizmet sektörü</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-2 bg-white rounded border border-green-200">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📰</span>
                        <div>
                          <div className="font-semibold text-sm">Gazete Bayii</div>
                          <div className="text-xs text-gray-600">1,500 TL - Günlük satış</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-green-600 font-medium mt-3">
                    💡 İpucu: Para birikince çiftlik alın, ardından fırın açın!
                  </div>
                </CardContent>
              </Card>

              {/* Envanter */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-green-600" />
                    Envanteriniz
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                    {Object.entries(playerInventory)
                      .filter(([_, quantity]) => quantity > 0)
                      .map(([productId, quantity]) => {
                        const productType = productTypes.find((p) => p.id === productId)
                        return (
                          <div key={productId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <div className="font-semibold text-sm">{productType?.name}</div>
                              <div className="text-xs text-gray-600">
                                {quantity} {productType?.unit}
                              </div>
                            </div>
                            <div className="text-xs text-green-600 font-medium">
                              {((productType?.basePrice || 0) * quantity).toLocaleString("tr-TR")} TL
                            </div>
                          </div>
                        )
                      })}
                    {Object.keys(playerInventory).filter((key) => playerInventory[key] > 0).length === 0 && (
                      <div className="text-center text-gray-500 py-4">Henüz envanterinizde ürün yok</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sahip Olunan İşletmeler */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  İşletmeleriniz ({businesses.filter((b) => b.owned > 0).length}/46)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {businesses
                    .filter((b) => b.owned > 0)
                    .map((business) => (
                      <div key={business.id} className="p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">{business.icon}</span>
                          <div>
                            <div className="font-semibold text-sm">{business.name}</div>
                            <Badge variant="secondary" className="text-xs">
                              {business.owned} adet
                            </Badge>
                          </div>
                        </div>

                        {/* Üretim Zinciri */}
                        <div className="space-y-2">
                          {business.inputs.length > 0 && (
                            <div className="text-xs">
                              <div className="text-gray-600 mb-1">Gerekli:</div>
                              <div className="flex flex-wrap gap-1">
                                {business.inputs.map((input, idx) => {
                                  const productType = productTypes.find((p) => p.id === input.productId)
                                  const available = playerInventory[input.productId] || 0
                                  const isAvailable = available >= input.amount

                                  return (
                                    <Badge
                                      key={idx}
                                      variant={isAvailable ? "default" : "destructive"}
                                      className="text-xs"
                                    >
                                      {input.amount} {input.unit} {productType?.name}
                                    </Badge>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                          {business.outputs.length > 0 && (
                            <div className="text-xs">
                              <div className="text-gray-600 mb-1">Üretir:</div>
                              <div className="flex flex-wrap gap-1">
                                {business.outputs.map((output, idx) => {
                                  const productType = productTypes.find((p) => p.id === output.productId)
                                  return (
                                    <Badge key={idx} variant="outline" className="text-xs bg-green-50">
                                      {output.amount} {output.unit} {productType?.name}
                                    </Badge>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  {businesses.filter((b) => b.owned > 0).length === 0 && (
                    <div className="col-span-full text-center text-gray-500 py-8">
                      Henüz hiçbir işletmeniz yok. Yukarıdaki başlangıç seçeneklerinden birini alın!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* İşletmeler Sekmesi */}
          <TabsContent value="trading" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-green-600" />
                      İşletme Merkezi
                    </CardTitle>
                    <CardDescription>
                      46 farklı işletme seçeneği. Tedarik zinciri sistemi ile gerçek ekonomi simülasyonu.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[700px] overflow-y-auto">
                  {filteredBusinesses.map((business) => (
                    <div
                      key={business.id}
                      className={`p-4 border rounded-lg transition-all ${
                        player.level >= business.minLevel
                          ? "hover:bg-gray-50 border-gray-200"
                          : "bg-gray-100 border-gray-300 opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="text-3xl">{business.icon}</div>
                          <div className="flex-1">
                            <div className="font-semibold flex items-center gap-2 mb-2">
                              {business.name}
                              <Badge variant="outline" className={getCategoryColor(business.category)}>
                                {business.category}
                              </Badge>
                              {player.level < business.minLevel && (
                                <Badge variant="destructive" className="text-xs">
                                  Seviye {business.minLevel} Gerekli
                                </Badge>
                              )}
                            </div>

                            <div className="text-sm text-gray-600 mb-3">{business.description}</div>

                            {/* Üretim Zinciri Gösterimi */}
                            <div className="flex items-center gap-2 text-sm mb-2">
                              {business.inputs.length > 0 && (
                                <>
                                  <div className="flex gap-1">
                                    {business.inputs.map((input, idx) => {
                                      const productType = productTypes.find((p) => p.id === input.productId)
                                      return (
                                        <Badge key={idx} variant="outline" className="text-xs">
                                          {input.amount} {input.unit} {productType?.name}
                                        </Badge>
                                      )
                                    })}
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-gray-400" />
                                </>
                              )}

                              <div className="flex gap-1">
                                {business.outputs.length > 0 ? (
                                  business.outputs.map((output, idx) => {
                                    const productType = productTypes.find((p) => p.id === output.productId)
                                    return (
                                      <Badge key={idx} variant="default" className="text-xs bg-green-600">
                                        {output.amount} {output.unit} {productType?.name}
                                      </Badge>
                                    )
                                  })
                                ) : (
                                  <Badge variant="default" className="text-xs bg-orange-600">
                                    Müşteri Satışı
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="text-xs text-gray-500">
                              Üretim: {business.productionTime} dk | İşletme:{" "}
                              {business.operatingCost.toLocaleString("tr-TR")} TL/saat
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-bold text-green-600 text-lg">
                              {business.price.toLocaleString("tr-TR")} TL
                            </div>
                            {business.owned > 0 && (
                              <div className="text-sm text-gray-600">Sahip: {business.owned} adet</div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="1"
                              value={buyQuantity[business.id] || 1}
                              onChange={(e) =>
                                setBuyQuantity((prev) => ({
                                  ...prev,
                                  [business.id]: Math.max(1, Number.parseInt(e.target.value) || 1),
                                }))
                              }
                              className="w-20 h-9 text-sm"
                              disabled={player.level < business.minLevel}
                            />
                            <div className="flex flex-col gap-1">
                              <Button
                                size="sm"
                                onClick={() => buyBusiness(business.id, buyQuantity[business.id] || 1)}
                                disabled={
                                  player.cash < business.price * (buyQuantity[business.id] || 1) ||
                                  player.level < business.minLevel
                                }
                                className="bg-green-600 hover:bg-green-700 h-8 px-3 text-xs"
                              >
                                Al
                              </Button>
                              {business.owned > 0 && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    sellBusiness(business.id, Math.min(business.owned, buyQuantity[business.id] || 1))
                                  }
                                  className="h-8 px-3 text-xs border-red-200 text-red-600 hover:bg-red-50"
                                >
                                  Sat
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pazar Sekmesi */}
          <TabsContent value="market" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Ürün Pazarı
                </CardTitle>
                <CardDescription>Diğer üreticilerden hammadde ve ürün satın alın</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {market.map((item, index) => {
                    const productType = productTypes.find((p) => p.id === item.productId)
                    const totalCost = item.price * item.quantity

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div>
                          <div className="font-semibold">{productType?.name}</div>
                          <div className="text-sm text-gray-600">
                            {item.quantity} {productType?.unit} - Satıcı: {item.seller}
                          </div>
                          <div className="text-xs text-gray-500">
                            Birim Fiyat: {item.price.toFixed(2)} TL/{productType?.unit}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-bold text-green-600">{totalCost.toFixed(2)} TL</div>
                            <div className="text-xs text-gray-500">Toplam</div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => buyFromMarket(index)}
                            disabled={player.cash < totalCost}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Satın Al
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                  {market.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      Şu anda pazarda ürün bulunmuyor. Üretim yapan işletmeler otomatik olarak ürünlerini pazara koyar.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Haberler Sekmesi */}
          <TabsContent value="news" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  Ekonomi Haberleri
                </CardTitle>
                <CardDescription>Piyasayı etkileyen son gelişmeler ve tedarik zinciri haberleri</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {news.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border-l-4 border-l-gray-300"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-3 h-3 rounded-full mt-2 ${
                            item.impact === "positive"
                              ? "bg-green-500"
                              : item.impact === "negative"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                          }`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-lg">{item.title}</h4>
                            <Badge
                              variant="secondary"
                              className={`${
                                item.impact === "positive"
                                  ? "bg-green-100 text-green-800"
                                  : item.impact === "negative"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {item.impact === "positive" ? "Olumlu" : item.impact === "negative" ? "Olumsuz" : "Nötr"}
                            </Badge>
                          </div>
                          <p className="text-gray-700 leading-relaxed mb-2">{item.description}</p>
                          <span className="text-sm text-gray-500">{item.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sıralama Sekmesi */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  Oyuncu Sıralaması
                </CardTitle>
                <CardDescription>Sermaye bazında en başarılı oyuncular</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((leaderPlayer) => (
                    <div
                      key={leaderPlayer.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${getRankColor(leaderPlayer.rank)}`}
                        >
                          {leaderPlayer.rank <= 3 ? getRankIcon(leaderPlayer.rank) : leaderPlayer.rank}
                        </div>
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gray-300">{leaderPlayer.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{leaderPlayer.name}</div>
                          <div className="text-sm text-gray-600">Seviye {leaderPlayer.level}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-lg text-purple-600">
                          {leaderPlayer.capital.toLocaleString("tr-TR")} TL
                        </div>
                        <div className="text-sm text-gray-600">
                          {leaderPlayer.hourlyIncome.toLocaleString("tr-TR")} TL/saat
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
