'use client';

import { useTranslations } from 'next-intl';
import { TrackedLink } from '@/components/analytics/TrackedLink';
import { Container, Button, Badge } from '@/components/ui';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function SaheebDriveCard() {
  const t = useTranslations('home.featured');

  return (
    <section className="py-24 lg:py-32 bg-[#09090B] relative overflow-hidden">
      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-[#EDEDEF]">
            {t('title')}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative rounded-3xl overflow-hidden bg-[#111113] border border-[#222225]">
            <div className="grid md:grid-cols-2">
              {/* Content Side */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <Badge variant="accent" className="w-fit mb-6">
                  {t('saheebDrive.badge')}
                </Badge>

                <h3 className="text-3xl lg:text-4xl font-bold text-[#EDEDEF] mb-3">
                  {t('saheebDrive.title')}
                </h3>

                <p className="text-xl text-[#C9A87C] font-medium mb-4">
                  {t('saheebDrive.subtitle')}
                </p>

                <p className="text-[#8F8F96] mb-8 leading-relaxed text-lg">
                  {t('saheebDrive.description')}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <TrackedLink
                    href="/projects/saheeb-drive"
                    ctaLocation="home_featured_saheeb_drive"
                    destinationPath="/projects/saheeb-drive"
                    project="saheeb_drive"
                  >
                    <Button variant="primary" size="lg">
                      {t('saheebDrive.cta')}
                    </Button>
                  </TrackedLink>
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
                <div className="absolute inset-0 bg-gradient-to-r from-[#111113]/40 via-transparent to-transparent md:bg-gradient-to-l md:from-transparent md:via-transparent md:to-[#111113]/30" />

                {/* AI sparkle badge */}
                <div className="absolute top-6 end-6 w-14 h-14 bg-[#19191B] border border-[#222225] rounded-2xl flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#C9A87C">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                  </svg>
                </div>

                {/* Bottom gradient for text contrast on mobile */}
                <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#111113]/60 to-transparent md:hidden" />
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
