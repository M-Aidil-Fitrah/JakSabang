import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layouts/navbar";

interface TransitionPageProps {
  onComplete: () => void;
  duration?: number;
  targetPage?: string;
}

export function TransitionPage({ onComplete, duration = 4000, targetPage }: TransitionPageProps) {
  const [progress, setProgress] = useState(0);

  // Function to get dynamic loading message based on target page
  const getLoadingMessage = () => {
    const messages = {
      '/': 'Menyiapkan beranda untuk Anda...',
      '/destinations': 'Mengeksplorasi destinasi wisata terbaik...',
      '/layanan/penginapan': 'Mencari penginapan terbaik untuk Anda...',
      '/layanan/rental': 'Menyiapkan kendaraan rental terbaik...',
      '/layanan/tourguide': 'Menghubungkan Anda dengan guide terpercaya...',
      '/informations': 'Mengumpulkan informasi terkini untuk Anda...',
      '/agenda': 'Menyusun agenda perjalanan yang menarik...',
      '/stroll': 'Menemukan rute jalan-jalan terbaik...',
      '/about': 'Mempersiapkan cerita tentang kami...',
      default: 'Menyiapkan pengalaman terbaik untuk Anda...'
    };
    
    return messages[targetPage as keyof typeof messages] || messages.default;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500); // Small delay before completing
          return 100;
        }
        return prev + 2; // Increase by 2% every 80ms (4000ms / 50 steps)
      });
    }, duration / 50);

    return () => clearInterval(interval);
  }, [onComplete, duration]);

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <Navbar id="navbar" />
      
      {/* Main transition content - Full screen minus navbar */}
      <main className="absolute top-16 left-0 right-0 bottom-0 flex flex-col items-center justify-center transition-bg overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-3xl"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Logo container with bounce animation */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              ease: "easeOut"
            }}
          >
            <motion.div
              className="relative"
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <img
                src="/assets/JakSabang.svg"
                alt="JakSabang Logo"
                className="w-40 h-40 md:w-48 md:h-48 drop-shadow-2xl"
              />
            </motion.div>

            {/* Glow effect behind logo */}
            <motion.div
              className="absolute inset-0 w-40 h-40 md:w-48 md:h-48 bg-primary/20 rounded-full blur-xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* Loading text */}
          <motion.div
            className="text-center mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              JakSabang
            </h2>
            <motion.p
              className="text-muted-foreground text-lg"
              animate={{
                opacity: [1, 0.5, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {getLoadingMessage()}
            </motion.p>
          </motion.div>

          {/* Progress bar container */}
          <motion.div
            className="w-64 md:w-80 bg-muted/50 dark:bg-muted-foreground/20 rounded-full h-3 overflow-hidden shadow-inner border border-border/50"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            {/* Progress bar fill */}
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 dark:from-emerald-400 dark:to-emerald-300 rounded-full shadow-lg"
              style={{
                width: `${progress}%`
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut"
              }}
            />
          </motion.div>

          {/* Progress percentage */}
          <motion.div
            className="mt-4 text-foreground font-semibold text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
          >
            {Math.round(progress)}%
          </motion.div>

          {/* Loading dots */}
          <motion.div
            className="flex space-x-2 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.4 }}
          >
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-3 h-3 bg-emerald-500 dark:bg-emerald-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Bottom text */}
        <motion.div
          className="absolute bottom-8 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
        >
          <p className="text-muted-foreground text-sm">
            Platform wisata terpadu untuk menjelajahi keindahan Sabang
          </p>
        </motion.div>
      </main>
    </div>
  );
}
