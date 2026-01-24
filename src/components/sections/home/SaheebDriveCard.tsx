'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Container, Button, Badge } from '@/components/ui';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function SaheebDriveCard() {
  const t = useTranslations('home.featured');

  return (
    <section className="py-24 lg:py-32 bg-[#0F1629] relative overflow-hidden">
      {/* Background decorations */}
      <div
        className="absolute top-0 end-0 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 start-0 w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            {t('title')}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
            <div className="grid md:grid-cols-2">
              {/* Content Side */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <Badge variant="glow" className="w-fit mb-6">
                  {t('saheebDrive.badge')}
                </Badge>

                <h3 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                  {t('saheebDrive.title')}
                </h3>

                <p className="text-xl text-[#D4AF37] font-medium mb-4">
                  {t('saheebDrive.subtitle')}
                </p>

                <p className="text-white/60 mb-8 leading-relaxed text-lg">
                  {t('saheebDrive.description')}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/projects/saheeb-drive">
                    <Button variant="gold" size="lg">
                      {t('saheebDrive.cta')}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Visual Side - Coastal Highway Image */}
              <div className="relative min-h-[300px] md:min-h-[400px] overflow-hidden">
                <Image
                  src="/images/Saheeb-drive-card.png"
                  alt="Coastal highway in Oman at night with city lights"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Gradient overlay for seamless blend */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E1A]/30 via-transparent to-transparent md:bg-gradient-to-l md:from-transparent md:via-transparent md:to-[#0A0E1A]/20" />

                {/* AI sparkle badge - floating over image */}
                <motion.div
                  className="absolute top-6 end-6 w-14 h-14 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-[0_4px_25px_rgba(255,255,255,0.3)]"
                  animate={{
                    scale: [1, 1.08, 1],
                    rotate: [0, 3, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#D4AF37">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                  </svg>
                </motion.div>

                {/* Bottom gradient for text contrast on mobile */}
                <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#0A0E1A]/60 to-transparent md:hidden" />
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
