'use client';

import { Header, Footer } from '@/components/layout';
import { Container, Button, Badge, Card, Input, Textarea } from '@/components/ui';
import { useState } from 'react';

// Color swatch component with copy functionality
function ColorSwatch({ name, hex, usage }: { name: string; hex: string; usage: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="group cursor-pointer"
      onClick={copyToClipboard}
    >
      <div
        className="h-20 rounded-xl mb-2 border border-white/10 transition-transform group-hover:scale-105"
        style={{ backgroundColor: hex }}
      />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white">{name}</p>
          <p className="text-xs text-white/50 font-mono">{hex}</p>
        </div>
        <span className="text-xs text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">
          {copied ? 'Copied!' : 'Click to copy'}
        </span>
      </div>
      <p className="text-xs text-white/40 mt-1">{usage}</p>
    </div>
  );
}

// Section header component
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      {subtitle && <p className="text-white/60">{subtitle}</p>}
    </div>
  );
}

export default function StyleGuidePage() {
  return (
    <>
      <Header />
      <main className="pt-16 md:pt-20 lg:pt-24">
        {/* Hero */}
        <section className="py-16 lg:py-20 bg-[#0A0E1A] border-b border-white/5">
          <Container>
            <Badge variant="glow" className="mb-4">Internal Use Only</Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Saheeb Drive
              <span className="block text-[#D4AF37]">Design System</span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              Style guide for mobile app developers and UI/UX designers building the AI-powered car marketplace.
            </p>
          </Container>
        </section>

        {/* Product Brief */}
        <section className="py-16 bg-[#0F1629]">
          <Container>
            <SectionHeader
              title="1. Product Brief"
              subtitle="Understanding Saheeb Drive"
            />

            <div className="grid md:grid-cols-2 gap-8">
              <Card variant="glass" padding="lg">
                <h3 className="text-lg font-bold text-white mb-4">What is Saheeb Drive?</h3>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>• AI-powered car marketplace for Oman</li>
                  <li>• Launching Q3 2026, starting in Muscat</li>
                  <li>• Web + iOS + Android apps</li>
                  <li>• Conversational AI search (Arabic & English)</li>
                  <li>• AI verification & fraud detection</li>
                  <li>• ROP integration for vehicle records</li>
                </ul>
              </Card>

              <Card variant="glass" padding="lg">
                <h3 className="text-lg font-bold text-white mb-4">Core Problem</h3>
                <p className="text-white/70 text-sm mb-4">
                  Oman&apos;s car market is broken: scams, fake listings, price manipulation.
                  Buyers don&apos;t trust sellers, and sellers can&apos;t reach qualified buyers.
                </p>
                <h4 className="text-sm font-semibold text-[#D4AF37] mb-2">Target Users</h4>
                <ul className="space-y-1 text-white/70 text-sm">
                  <li><strong>Buyers:</strong> People looking for verified, trusted listings</li>
                  <li><strong>Sellers:</strong> Car owners wanting qualified buyers</li>
                  <li><strong>Dealers:</strong> Automotive businesses</li>
                </ul>
              </Card>

              <Card variant="glass" padding="lg" className="md:col-span-2">
                <h3 className="text-lg font-bold text-white mb-4">Brand Values</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-2xl mb-2">🛡️</div>
                    <p className="text-sm font-medium text-white">Trust & Transparency</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-2xl mb-2">🤖</div>
                    <p className="text-sm font-medium text-white">AI-Native Experience</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-2xl mb-2">🇴🇲</div>
                    <p className="text-sm font-medium text-white">Local First (Oman)</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-2xl mb-2">✨</div>
                    <p className="text-sm font-medium text-white">Premium & Modern</p>
                  </div>
                </div>
              </Card>
            </div>
          </Container>
        </section>

        {/* Color Palette */}
        <section className="py-16 bg-[#0A0E1A]">
          <Container>
            <SectionHeader
              title="2. Color Palette"
              subtitle="Click any swatch to copy hex value"
            />

            {/* Primary Colors */}
            <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">Primary Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
              <ColorSwatch name="Gold Primary" hex="#D4AF37" usage="CTAs, highlights, accents" />
              <ColorSwatch name="Gold Light" hex="#F4D03F" usage="Hover states, gradients" />
              <ColorSwatch name="Gold Dark" hex="#B8860B" usage="Shadows, darker accents" />
            </div>

            {/* Background Colors */}
            <h3 className="text-lg font-semibold text-white mb-4">Background Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
              <ColorSwatch name="Luxury Dark" hex="#0A0E1A" usage="Primary background" />
              <ColorSwatch name="Luxury Darker" hex="#050810" usage="Footer, deepest sections" />
              <ColorSwatch name="Luxury Navy" hex="#0F1629" usage="Section alternates" />
              <ColorSwatch name="Navy Light" hex="#1A2744" usage="Card backgrounds" />
            </div>

            {/* Accent Colors */}
            <h3 className="text-lg font-semibold text-white mb-4">Accent Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
              <ColorSwatch name="Blue" hex="#3B82F6" usage="Links, info states" />
              <ColorSwatch name="Emerald" hex="#10B981" usage="Success, verified states" />
              <ColorSwatch name="Red" hex="#EF4444" usage="Error states" />
              <ColorSwatch name="Purple" hex="#A855F7" usage="AI/special features" />
            </div>

            {/* Glass Effects */}
            <h3 className="text-lg font-semibold text-white mb-4">Glass Effects</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
                <p className="text-sm font-medium text-white mb-2">Glass Background</p>
                <code className="text-xs text-[#D4AF37] font-mono">bg-white/[0.03]</code>
              </div>
              <div className="p-6 rounded-xl bg-white/[0.05] border border-white/[0.10]">
                <p className="text-sm font-medium text-white mb-2">Glass Border</p>
                <code className="text-xs text-[#D4AF37] font-mono">border-white/[0.08-0.10]</code>
              </div>
              <div className="p-6 rounded-xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.08]">
                <p className="text-sm font-medium text-white mb-2">Backdrop Blur</p>
                <code className="text-xs text-[#D4AF37] font-mono">backdrop-blur-xl</code>
              </div>
            </div>
          </Container>
        </section>

        {/* Typography */}
        <section className="py-16 bg-[#0F1629]">
          <Container>
            <SectionHeader
              title="3. Typography"
              subtitle="Fonts and text scales"
            />

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <Card variant="glass" padding="lg">
                <h3 className="text-lg font-bold text-white mb-4">Fonts</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-white/50 mb-1">English</p>
                    <p className="text-2xl font-medium text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Inter — Aa Bb Cc 123
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-white/50 mb-1">Arabic</p>
                    <p className="text-2xl font-medium text-white" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }} dir="rtl">
                      IBM Plex Sans Arabic — أ ب ج ١٢٣
                    </p>
                  </div>
                </div>
              </Card>

              <Card variant="glass" padding="lg">
                <h3 className="text-lg font-bold text-white mb-4">Font Weights</h3>
                <div className="space-y-2">
                  <p className="text-white font-light">Light (300)</p>
                  <p className="text-white font-normal">Regular (400)</p>
                  <p className="text-white font-medium">Medium (500)</p>
                  <p className="text-white font-semibold">Semibold (600)</p>
                  <p className="text-white font-bold">Bold (700)</p>
                </div>
              </Card>
            </div>

            <h3 className="text-lg font-semibold text-white mb-4">Type Scale</h3>
            <div className="space-y-4 p-6 bg-white/[0.03] rounded-xl border border-white/[0.08]">
              <div className="flex items-baseline gap-4">
                <code className="text-xs text-[#D4AF37] font-mono w-24 shrink-0">text-5xl</code>
                <p className="text-5xl font-bold text-white">Heading 1</p>
              </div>
              <div className="flex items-baseline gap-4">
                <code className="text-xs text-[#D4AF37] font-mono w-24 shrink-0">text-3xl</code>
                <p className="text-3xl font-bold text-white">Heading 2</p>
              </div>
              <div className="flex items-baseline gap-4">
                <code className="text-xs text-[#D4AF37] font-mono w-24 shrink-0">text-xl</code>
                <p className="text-xl font-semibold text-white">Heading 3</p>
              </div>
              <div className="flex items-baseline gap-4">
                <code className="text-xs text-[#D4AF37] font-mono w-24 shrink-0">text-base</code>
                <p className="text-base text-white">Body text (16px)</p>
              </div>
              <div className="flex items-baseline gap-4">
                <code className="text-xs text-[#D4AF37] font-mono w-24 shrink-0">text-sm</code>
                <p className="text-sm text-white/70">Small text (14px)</p>
              </div>
              <div className="flex items-baseline gap-4">
                <code className="text-xs text-[#D4AF37] font-mono w-24 shrink-0">text-xs</code>
                <p className="text-xs text-white/50">Extra small (12px)</p>
              </div>
            </div>
          </Container>
        </section>

        {/* Components */}
        <section className="py-16 bg-[#0A0E1A]">
          <Container>
            <SectionHeader
              title="4. Component Library"
              subtitle="Interactive UI components"
            />

            {/* Buttons */}
            <h3 className="text-lg font-semibold text-white mb-4">Buttons</h3>
            <div className="p-6 bg-white/[0.03] rounded-xl border border-white/[0.08] mb-8">
              <div className="flex flex-wrap gap-4 mb-6">
                <Button variant="gold">Gold (Primary)</Button>
                <Button variant="glass">Glass</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="white">White</Button>
              </div>
              <div className="flex flex-wrap gap-4 mb-6">
                <Button variant="gold" size="sm">Small</Button>
                <Button variant="gold" size="md">Medium</Button>
                <Button variant="gold" size="lg">Large</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button variant="gold" isLoading>Loading</Button>
                <Button variant="gold" disabled>Disabled</Button>
              </div>
            </div>

            {/* Badges */}
            <h3 className="text-lg font-semibold text-white mb-4">Badges</h3>
            <div className="p-6 bg-white/[0.03] rounded-xl border border-white/[0.08] mb-8">
              <div className="flex flex-wrap gap-4">
                <Badge variant="gold">Gold</Badge>
                <Badge variant="glass">Glass</Badge>
                <Badge variant="glow">Glow</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="success">Success</Badge>
              </div>
            </div>

            {/* Cards */}
            <h3 className="text-lg font-semibold text-white mb-4">Cards</h3>
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card variant="glass" padding="md">
                <p className="text-sm font-medium text-white">Glass</p>
                <p className="text-xs text-white/50 mt-1">variant=&quot;glass&quot;</p>
              </Card>
              <Card variant="solid" padding="md">
                <p className="text-sm font-medium text-white">Solid</p>
                <p className="text-xs text-white/50 mt-1">variant=&quot;solid&quot;</p>
              </Card>
              <Card variant="gradient" padding="md">
                <p className="text-sm font-medium text-white">Gradient</p>
                <p className="text-xs text-white/50 mt-1">variant=&quot;gradient&quot;</p>
              </Card>
              <Card variant="bordered" padding="md">
                <p className="text-sm font-medium text-white">Bordered</p>
                <p className="text-xs text-white/50 mt-1">variant=&quot;bordered&quot;</p>
              </Card>
            </div>

            {/* Inputs */}
            <h3 className="text-lg font-semibold text-white mb-4">Form Inputs</h3>
            <div className="grid md:grid-cols-2 gap-6 p-6 bg-white/[0.03] rounded-xl border border-white/[0.08]">
              <div className="space-y-4">
                <Input variant="dark" placeholder="Default input" />
                <Input variant="dark" placeholder="With error" error="This field is required" />
                <Input variant="dark" placeholder="Disabled" disabled />
              </div>
              <div>
                <Textarea variant="dark" placeholder="Textarea input..." rows={5} />
              </div>
            </div>
          </Container>
        </section>

        {/* Mobile Guidelines */}
        <section className="py-16 bg-[#0F1629]">
          <Container>
            <SectionHeader
              title="5. Mobile App Guidelines"
              subtitle="iOS & Android design specifications"
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card variant="glass" padding="lg">
                <h3 className="text-lg font-bold text-white mb-4">Screen Sizes</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li><strong className="text-white">iOS:</strong> 375px → 430px</li>
                  <li><strong className="text-white">Android:</strong> 360px → 412px</li>
                  <li className="text-white/50">Respect safe areas (notches, home indicators)</li>
                </ul>
              </Card>

              <Card variant="glass" padding="lg">
                <h3 className="text-lg font-bold text-white mb-4">Touch Targets</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li><strong className="text-white">Minimum:</strong> 44×44pt (iOS) / 48×48dp (Android)</li>
                  <li><strong className="text-white">Comfortable:</strong> 48×48pt / 56×56dp</li>
                  <li><strong className="text-white">Spacing:</strong> 8px minimum between targets</li>
                </ul>
              </Card>

              <Card variant="glass" padding="lg">
                <h3 className="text-lg font-bold text-white mb-4">Bottom Navigation</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>• 4-5 tabs maximum</li>
                  <li>• Icons + labels</li>
                  <li><strong className="text-[#D4AF37]">Active:</strong> Gold highlight</li>
                  <li><strong className="text-white/50">Inactive:</strong> white/50</li>
                </ul>
              </Card>

              <Card variant="glass" padding="lg">
                <h3 className="text-lg font-bold text-white mb-4">Gestures</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li><strong className="text-white">Swipe L/R:</strong> Image carousel</li>
                  <li><strong className="text-white">Pull down:</strong> Refresh</li>
                  <li><strong className="text-white">Long press:</strong> Quick actions</li>
                  <li><strong className="text-white">Swipe:</strong> Delete/archive</li>
                </ul>
              </Card>

              <Card variant="glass" padding="lg">
                <h3 className="text-lg font-bold text-white mb-4">Border Radius</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li><strong className="text-white">Buttons/Inputs:</strong> 12px (rounded-xl)</li>
                  <li><strong className="text-white">Cards:</strong> 16px (rounded-2xl)</li>
                  <li><strong className="text-white">Badges:</strong> Full (rounded-full)</li>
                </ul>
              </Card>

              <Card variant="glass" padding="lg">
                <h3 className="text-lg font-bold text-white mb-4">Shadows</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li><strong className="text-[#D4AF37]">Gold glow:</strong></li>
                  <li className="font-mono text-xs">0 0 40px rgba(212,175,55,0.3)</li>
                  <li><strong className="text-white">Card shadow:</strong></li>
                  <li className="font-mono text-xs">0 8px 32px rgba(0,0,0,0.3)</li>
                </ul>
              </Card>
            </div>
          </Container>
        </section>

        {/* Car Marketplace Components */}
        <section className="py-16 bg-[#0A0E1A]">
          <Container>
            <SectionHeader
              title="6. Car Marketplace Components"
              subtitle="Saheeb Drive specific UI patterns"
            />

            <div className="grid md:grid-cols-2 gap-8">
              <Card variant="glass" padding="lg">
                <h3 className="text-lg font-bold text-white mb-4">Car Listing Card</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>• Image carousel with dots indicator</li>
                  <li>• <span className="text-[#D4AF37]">Price badge (gold, prominent)</span></li>
                  <li>• <span className="text-emerald-400">Verified badge (emerald)</span></li>
                  <li>• Key specs: year | mileage | transmission</li>
                  <li>• Seller type: Private / Dealer</li>
                  <li>• Favorite heart icon (top right)</li>
                </ul>
              </Card>

              <Card variant="glass" padding="lg">
                <h3 className="text-lg font-bold text-white mb-4">Search & Filters</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>• AI chat input (hero, prominent)</li>
                  <li>• Filter chips: scrollable horizontal</li>
                  <li>• <span className="text-[#D4AF37]">Active filters: gold background</span></li>
                  <li>• Sort: bottom sheet on mobile</li>
                  <li>• Results count + clear all</li>
                </ul>
              </Card>

              <Card variant="glass" padding="lg">
                <h3 className="text-lg font-bold text-white mb-4">Car Detail Screen</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>• Full-width image gallery</li>
                  <li>• Sticky price bar at bottom</li>
                  <li>• Specs grid (2 columns)</li>
                  <li>• Seller card with contact CTA</li>
                  <li>• Similar listings carousel</li>
                </ul>
              </Card>

              <Card variant="glass" padding="lg">
                <h3 className="text-lg font-bold text-white mb-4">User States</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>• <span className="text-white/50">Loading:</span> Skeleton cards with pulse</li>
                  <li>• <span className="text-white/50">Empty:</span> Illustration + &quot;No results&quot; + CTA</li>
                  <li>• <span className="text-red-400">Error:</span> Red banner + retry button</li>
                  <li>• <span className="text-emerald-400">Success:</span> Checkmark animation</li>
                </ul>
              </Card>

              <Card variant="glass" padding="lg" className="md:col-span-2">
                <h3 className="text-lg font-bold text-white mb-4">Forms (Listing Creation)</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <ul className="space-y-2 text-sm text-white/70">
                    <li>• Multi-step wizard with progress</li>
                    <li>• Image upload: camera + gallery</li>
                    <li>• Price input with OMR currency</li>
                  </ul>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li>• City picker (Omani cities dropdown)</li>
                    <li>• Inline validation (real-time)</li>
                    <li>• Required field indicators</li>
                  </ul>
                </div>
              </Card>
            </div>
          </Container>
        </section>

        {/* Iconography */}
        <section className="py-16 bg-[#0F1629] border-b border-white/5">
          <Container>
            <SectionHeader
              title="7. Iconography"
              subtitle="Icon usage guidelines"
            />

            <div className="grid md:grid-cols-2 gap-8">
              <Card variant="glass" padding="lg">
                <h3 className="text-lg font-bold text-white mb-4">Icon Library</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>• <strong className="text-white">Primary:</strong> Lucide React icons</li>
                  <li>• Custom car-related icons where needed</li>
                  <li>• Consistent stroke width (2px default)</li>
                </ul>
              </Card>

              <Card variant="glass" padding="lg">
                <h3 className="text-lg font-bold text-white mb-4">Icon Sizes</h3>
                <div className="flex items-end gap-6">
                  <div className="text-center">
                    <div className="w-4 h-4 bg-white/20 rounded mb-2 mx-auto" />
                    <p className="text-xs text-white/50">16px</p>
                  </div>
                  <div className="text-center">
                    <div className="w-5 h-5 bg-white/20 rounded mb-2 mx-auto" />
                    <p className="text-xs text-white/50">20px</p>
                  </div>
                  <div className="text-center">
                    <div className="w-6 h-6 bg-white/20 rounded mb-2 mx-auto" />
                    <p className="text-xs text-white/50">24px</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-white/20 rounded mb-2 mx-auto" />
                    <p className="text-xs text-white/50">32px</p>
                  </div>
                </div>
              </Card>

              <Card variant="glass" padding="lg" className="md:col-span-2">
                <h3 className="text-lg font-bold text-white mb-4">Icon Colors</h3>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white/60 rounded" />
                    <span className="text-sm text-white/70">Default (white/60)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#D4AF37] rounded" />
                    <span className="text-sm text-white/70">Gold (active)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-emerald-400 rounded" />
                    <span className="text-sm text-white/70">Emerald (success)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-400 rounded" />
                    <span className="text-sm text-white/70">Red (error)</span>
                  </div>
                </div>
              </Card>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
