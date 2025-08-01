import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";
import { Star, MapPin, Search, Filter } from "lucide-react";

const categories = ["Semua", "Hotel", "Resort", "Inn", "Homestay", "Boutique Hotel"];
const API_URL = import.meta.env.VITE_API_URL;

export function PenginapanPage() {
  const [penginapanList, setPenginapanList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    const fetchPenginapan = async () => {
      try {
        const res = await fetch(`${API_URL}/penginapan`);
        const data = await res.json();
        setPenginapanList(data);
      } catch (error) {
        console.error("Failed to fetch penginapan", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPenginapan();
  }, []);

  const filteredPenginapan = penginapanList
    .filter((p) => {
      const matchesSearch = p.nama.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "Semua" || p.kategori === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.hargaPerMalam - b.hargaPerMalam;
        case "price-high":
          return b.hargaPerMalam - a.hargaPerMalam;
        case "rating":
          return b.rating - a.rating;
        default:
          return a.nama.localeCompare(b.nama);
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <Navbar id="navbar" />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/destinasi/pantaiiboih.webp"
            alt="Penginapan Sabang"
            className="w-full h-full object-cover scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Penginapan di Sabang
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Temukan tempat menginap terbaik di Sabang, dari hotel mewah hingga homestay tradisional yang ramah budget
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 px-4 bg-background border-b border-border">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="flex flex-col lg:flex-row gap-4 items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Cari penginapan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-emerald-500 text-white shadow-lg scale-105"
                      : "bg-muted text-muted-foreground hover:bg-emerald-50 hover:text-emerald-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="name">Nama A-Z</option>
                <option value="price-low">Harga Terendah</option>
                <option value="price-high">Harga Tertinggi</option>
                <option value="rating">Rating Tertinggi</option>
              </select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Penginapan Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {loading ? (
            <div className="text-center text-muted-foreground">Memuat data penginapan...</div>
          ) : filteredPenginapan.length === 0 ? (
            <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
              <h3 className="text-xl font-semibold text-foreground mb-2">Penginapan tidak ditemukan</h3>
              <p className="text-muted-foreground">Coba ubah kriteria pencarian atau filter kategori</p>
            </motion.div>
          ) : (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
              {filteredPenginapan.map((p, index) => (
                <motion.div
                  key={p._id}
                  className="group bg-card rounded-2xl overflow-hidden shadow-lg border border-border hover:shadow-xl transition-all hover:-translate-y-2"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img src={p.gambar} alt={p.nama} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        {p.kategori}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold">{p.rating}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-emerald-600 transition-colors mb-3">{p.nama}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{p.lokasi}</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{p.deskripsi}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {p.fasilitas.slice(0, 3).map((f: string, idx: number) => (
                        <span key={idx} className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs">{f}</span>
                      ))}
                      {p.fasilitas.length > 3 && (
                        <span className="text-emerald-600 text-xs font-medium">
                          +{p.fasilitas.length - 3} lainnya
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
<div className="flex flex-col">
  <span className="text-2xl font-bold text-emerald-600">Rp {p.hargaPerMalam.toLocaleString()}</span>
  <span className="text-xs text-muted-foreground">per malam</span>
</div>
<Link to={`/layanan/penginapan/${p._id}`}>
  <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6">Lihat Detail</Button>
</Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
