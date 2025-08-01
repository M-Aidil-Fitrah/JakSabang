import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

export function Footer() {
  const { scrollYProgress } = useScroll();
  const [parallaxScrollRange, setParallaxScrollRange] = useState([0, 1]);
  const [parallaxTransformRange, setParallaxTransformRange] = useState([0, 0]);
  const parallaxY = useTransform(scrollYProgress, parallaxScrollRange, parallaxTransformRange);
  const [containerInView, setContainerInView] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const parallaxContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bodyElement = document.body;

    const checkInViewState = () => {
      const bodyScrollTop = bodyElement.scrollTop;
      const bodyScrollBottom = bodyScrollTop + window.innerHeight;
      const containerRect = containerRef.current?.getBoundingClientRect();

      if (containerRect && (containerRect.y > bodyScrollTop && containerRect.y < bodyScrollBottom))
        setContainerInView(true);
    };

    checkInViewState();

    if (!containerInView) window.addEventListener("scroll", checkInViewState);

    return () => window.removeEventListener("scroll", checkInViewState);
  }, [containerRef, containerInView]);

  useEffect(() => {
    const getCurrentRange = () => {
      const parallaxContainerElement = parallaxContainerRef.current;

      if (parallaxContainerElement) {
        const parallaxContainerRect = parallaxContainerElement.getBoundingClientRect();
        const currentRangeStart = ((parallaxContainerRect.top + window.scrollY) / document.body.clientHeight);

        setParallaxScrollRange([parseFloat(currentRangeStart.toFixed(2)), 1]);
        setParallaxTransformRange([-parallaxContainerRect.height, 0]);
      }
    }
      
    getCurrentRange();

    window.addEventListener("scroll", getCurrentRange);
    window.addEventListener("resize", getCurrentRange);

    return () => {
      window.removeEventListener("scroll", getCurrentRange);
      window.removeEventListener("resize", getCurrentRange);
    }
  }, [containerRef, containerInView, parallaxContainerRef])

  return (
    <>
      {/* Separator Line */}
          <div className="border-t border-border text-center"></div>

      <footer ref={containerRef} className="bg-foreground dark:bg-background text-background dark:text-foreground py-16 px-4">
        {containerInView && (
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <img 
                    src="/assets/JakSabangFIX.svg" 
                    alt="JakSabang Logo" 
                    className="w-18 h-18"
                  />
                  <span className="text-3xl font-bold">JakSabang</span>
                </div>
                <p className="text-muted-foreground dark:text-muted-foreground mb-6 leading-relaxed">
                  Platform wisata terpadu untuk menjelajahi keindahan Sabang
                  dengan mudah dan nyaman. Temukan destinasi terbaik, penginapan
                  berkualitas, dan layanan transportasi terpercaya.
                </p>
                <div className="flex gap-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer"
                  >
                    <Instagram className="w-5 h-5 text-primary-foreground" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer"
                  >
                    <Facebook className="w-5 h-5 text-primary-foreground" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer"
                  >
                    <Twitter className="w-5 h-5 text-primary-foreground" />
                  </motion.div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-6 text-foreground dark:text-foreground">
                  Destinasi
                </h3>
                <ul className="space-y-3 text-muted-foreground dark:text-muted-foreground">
                  <li>
                    <Link
                      to="/destinations"
                      className="hover:text-foreground dark:hover:text-foreground transition-colors"
                    >
                      Pantai Iboih
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/destinations"
                      className="hover:text-foreground dark:hover:text-foreground transition-colors"
                    >
                      Pulau Rubiah
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/destinations"
                      className="hover:text-foreground dark:hover:text-foreground transition-colors"
                    >
                      Tugu Kilometer Nol
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/destinations"
                      className="hover:text-foreground dark:hover:text-foreground transition-colors"
                    >
                      Pantai Sumur Tiga
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/destinations"
                      className="hover:text-foreground dark:hover:text-foreground transition-colors"
                    >
                      Gua Sarang
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-6 text-foreground dark:text-foreground">
                  Layanan
                </h3>
                <ul className="space-y-3 text-muted-foreground dark:text-muted-foreground">
                  <li>
                    <Link
                      to="/destinations"
                      className="hover:text-foreground dark:hover:text-foreground transition-colors"
                    >
                      Cari Destinasi
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/layanan/penginapan"
                      className="hover:text-foreground dark:hover:text-foreground transition-colors"
                    >
                      Reservasi Hotel
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/layanan/rental"
                      className="hover:text-foreground dark:hover:text-foreground transition-colors"
                    >
                      Sewa Kendaraan
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/layanan/tourguide"
                      className="hover:text-foreground dark:hover:text-foreground transition-colors"
                    >
                      Tour Guide
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/informations"
                      className="hover:text-foreground dark:hover:text-foreground transition-colors"
                    >
                      Info Wisata
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-6 text-foreground dark:text-foreground">
                  Kontak
                </h3>
                <ul className="space-y-3 text-muted-foreground dark:text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <Phone className="w-4 h-4" />
                    <span>+62 812 3456 7890</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="w-4 h-4" />
                    <span>hello@jaksabang.com</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <MapPin className="w-4 h-4" />
                    <span>Sabang, Aceh, Indonesia</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Parallax JAKSABANG - Behind Footer Effect */}
            <div ref={parallaxContainerRef} className="relative overflow-hidden py-16 border-t border-border">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="text-8xl md:text-9xl lg:text-[12rem] font-black text-foreground/10 dark:text-foreground/20 whitespace-nowrap select-none"
                  style={{
                    y: parallaxY,
                  }}
                >
                  JAKSABANG
                </motion.div>
              </div>
              {/* Gradient overlay to create behind effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background/90 pointer-events-none"></div>
              <div className="relative z-10 h-32"></div>
            </div>

            <div className="border-t border-border pt-8 text-center">
              <p className="text-muted-foreground dark:text-muted-foreground">
                ©2025 JakSabang. All rights reserved.
              </p>
            </div>
          </div>
        )}
      </footer>
    </>
  );
}
