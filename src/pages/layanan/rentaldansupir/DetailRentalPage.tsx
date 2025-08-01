import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";
import { Button } from "@/components/ui/button";

const API_URL = import.meta.env.VITE_API_URL;

interface Rental {
  _id: string;
  name: string;
  type: string;
  harga: number;
  deskripsi: string;
  gambar: string;
  penyedia: string;
  namaPenyedia: string;
  no_telepon: string;
}

export default function DetailRentalPage() {
  const { id } = useParams<{ id: string }>();
  const [rental, setRental] = useState<Rental | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRental = async () => {
      try {
        const res = await fetch(`${API_URL}/rental/${id}`);
        const data = await res.json();
        setRental(data);
      } catch (err) {
        console.error("Gagal mengambil detail rental:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRental();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Memuat detail rental...
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Data rental tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Image */}
      <section className="relative h-[60vh] min-h-[400px]">
        <img
          src={rental.gambar}
          alt={rental.name}
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
            {rental.name}
          </motion.h1>
          <div className="text-sm text-gray-300">
            Tipe: {rental.type} · Penyedia: {rental.namaPenyedia}
          </div>
        </div>
      </section>

      {/* Detail Section */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Deskripsi */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-2">Deskripsi</h2>
            <p className="text-muted-foreground">{rental.deskripsi}</p>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="font-medium text-muted-foreground mb-1">Harga Sewa</div>
              <div className="text-2xl font-bold text-emerald-600">
                Rp {rental.harga.toLocaleString()} / hari
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="font-medium text-muted-foreground mb-1">Nomor Telepon</div>
              <a
                href={`tel:${rental.no_telepon}`}
                className="text-lg font-semibold text-emerald-600 hover:underline"
              >
                {rental.no_telepon}
              </a>
            </div>
          </motion.div>

          {/* Tombol booking */}
          <div className="flex justify-center">
            <Button
              size="lg"
              className="bg-emerald-600 text-white hover:bg-emerald-700 transition-colors duration-300"
              onClick={() => window.location.href = `/rental/${rental._id}/booking`}
            >
              Booking Sekarang
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
