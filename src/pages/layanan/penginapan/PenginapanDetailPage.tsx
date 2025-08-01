import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Phone, Mail, BedDouble, Landmark } from "lucide-react";
import { Navbar } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";
import { Button } from "@/components/ui/button";

const API_URL = import.meta.env.VITE_API_URL;

export default function PenginapanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [penginapan, setPenginapan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const localStorageKey = `rated_penginapan_${id}`;

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`${API_URL}/penginapan/${id}`);
        const data = await res.json();

        setPenginapan(data);
      } catch (error) {
        console.error("Failed to fetch detail penginapan", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();

    // Cek kalau user sudah pernah kasih rating
    if (localStorage.getItem(localStorageKey)) {
      setHasRated(true);
    }
  }, [id, localStorageKey]);

  const handleSubmitRating = async () => {
    if (!userRating) return;

    try {
      // Get the token from localStorage or wherever you store it
      const token = localStorage.getItem('token');
      
      await fetch(`${API_URL}/penginapan/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ add_review: { rating: userRating } })
      });
      localStorage.setItem(localStorageKey, "true"); // supaya hanya sekali

      setHasRated(true);
      alert("Terima kasih atas rating Anda!");
      
      // refresh data
      const res = await fetch(`${API_URL}/penginapan/${id}`);
      const data = await res.json();

      setPenginapan(data);
    } catch (error) {
      console.error("Failed to submit rating", error);
      alert("Gagal mengirim rating");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Memuat detail penginapan...
      </div>
    );
  }

  if (!penginapan) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Data penginapan tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Image */}
      <section className="relative h-[60vh] min-h-[400px]">
        <img
          src={penginapan.gambar}
          alt={penginapan.nama}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
        <div className="absolute bottom-8 left-8 text-white">
          <motion.h1
            className="text-3xl md:text-5xl font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {penginapan.nama}
          </motion.h1>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <MapPin className="w-4 h-4" />
            <span>
              {penginapan.lokasi} · {penginapan.tipePeningapan}
            </span>
          </div>
        </div>
      </section>

      {/* Detail Section */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold mb-2">Deskripsi</h2>
              <p className="text-muted-foreground">{penginapan.deskripsi}</p>
            </motion.div>

            {/* Facilities */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-2xl font-semibold mb-2">Fasilitas</h2>
              <div className="flex flex-wrap gap-2">
                {penginapan.fasilitas.map((f: string, idx: number) => (
                  <span
                    key={idx}
                    className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Kebijakan */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-semibold mb-2">Kebijakan</h2>
              <p className="text-muted-foreground">
                {penginapan.kebijakan || "Tidak ada kebijakan khusus."}
              </p>
            </motion.div>

            {/* Check In / Out */}
            <div className="flex gap-4 mt-4">
              <div className="flex-1 bg-card p-4 rounded-xl border border-border">
                <div className="font-medium text-muted-foreground">
                  Check-in
                </div>
                <div className="text-lg font-semibold">
                  {penginapan.check_in_time}
                </div>
              </div>
              <div className="flex-1 bg-card p-4 rounded-xl border border-border">
                <div className="font-medium text-muted-foreground">
                  Check-out
                </div>
                <div className="text-lg font-semibold">
                  {penginapan.check_out_time}
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-2">Beri Rating</h2>
              {hasRated ? (
                <p className="text-muted-foreground">Anda sudah memberi rating untuk penginapan ini.</p>
              ) : (
                <div className="flex items-center gap-2">
                  {[1,2,3,4,5].map(num => (
                    <Star 
                      key={num}
                      className={`w-6 h-6 cursor-pointer ${userRating >= num ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`}
                      onClick={() => setUserRating(num)}
                    />
                  ))}
                  <Button 
                    disabled={userRating === 0}
                    onClick={handleSubmitRating}
                    className="bg-emerald-600 text-white"
                  >
                    Kirim
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">
                    {penginapan.rating || 0}
                  </span>
                </div>
                <span className="text-muted-foreground text-sm">
                  {penginapan.jumlah_review} review
                </span>
              </div>

              <div>
                <span className="text-muted-foreground text-sm">
                  Harga per malam
                </span>
                <div className="text-3xl font-bold text-emerald-600">
                  Rp {penginapan.hargaPerMalam.toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <BedDouble className="w-5 h-5" />
                <span>{penginapan.jumlahKamarTersedia} kamar tersedia</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Landmark className="w-5 h-5" />
                <span>{penginapan.alamat}</span>
              </div>

              <div className="flex flex-col gap-2 text-muted-foreground">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" /> 
                  <a href={`tel:${penginapan.no_telepon}`} className="hover:text-emerald-600">
                    {penginapan.no_telepon || 'Nomor tidak tersedia'}
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" /> 
                  <a href={`mailto:${penginapan.email}`} className="hover:text-emerald-600">
                    {penginapan.email || 'Email tidak tersedia'}
                  </a>
                </div>
                <Button 
                  className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-300 cursor-pointer"
                  onClick={() => window.location.href = `/penginapan/${id}/booking`}
                >
                  Booking Sekarang
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Map Embed */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Lokasi</h2>
          {penginapan.lokasi_maps && penginapan.lokasi_maps !== "not yet" ? (
            <iframe
              src={`https://www.google.com/maps?q=${penginapan.nama}&output=embed`}
              className="w-full h-64 rounded-xl border border-border"
              allowFullScreen
              loading="lazy"
            ></iframe>
          ) : (
            <p className="text-muted-foreground">Lokasi maps belum tersedia.</p>
          )}
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
