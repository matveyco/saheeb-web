'use client';

import { Header, Footer } from '@/components/layout';
import { Container, Button, Badge, Card, Input, Textarea } from '@/components/ui';
import { useState } from 'react';

// Color swatch component with copy functionality
function ColorSwatch({ name, hex, cssVar, usage }: { name: string; hex: string; cssVar?: string; usage: string }) {
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
        className="h-20 rounded-xl mb-2 border border-[#2A2633] transition-transform group-hover:scale-105"
        style={{ backgroundColor: hex }}
      />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[#FFFFFF]">{name}</p>
          <p className="text-xs text-[#5C5C63] font-mono">{hex}</p>
          {cssVar && <p className="text-xs text-[#5C5C63] font-mono">{cssVar}</p>}
        </div>
        <span className="text-xs text-[#316BE9] opacity-0 group-hover:opacity-100 transition-opacity">
          {copied ? 'Copied!' : 'Click to copy'}
        </span>
      </div>
      <p className="text-xs text-[#5C5C63] mt-1">{usage}</p>
    </div>
  );
}

// Section header component
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-[#FFFFFF] mb-2">{title}</h2>
      {subtitle && <p className="text-[#8F859C]">{subtitle}</p>}
    </div>
  );
}

export default function StyleGuidePage() {
  return (
    <>
      <Header />
      <main className="pt-16 md:pt-20 lg:pt-24">
        {/* Hero */}
        <section className="py-16 lg:py-20 bg-[#0A0A0D] border-b border-[#2A2633]">
          <Container>
            <Badge variant="accent" className="mb-4">Design System</Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-[#FFFFFF] mb-4">
              Saheeb
              <span className="block text-[#316BE9]">Style Guide</span>
            </h1>
            <p className="text-lg text-[#8F859C] max-w-2xl">
              Design system and style guide for developers, designers, and journalists working with the Saheeb brand and Saheeb Drive product.
            </p>
          </Container>
        </section>

        {/* Product Brief */}
        <section className="py-16 bg-[#0F1013]">
          <Container>
            <SectionHeader
              title="1. Product Brief"
              subtitle="Understanding Saheeb Drive"
            />

            <div className="grid md:grid-cols-2 gap-8">
              <Card variant="default" padding="lg">
                <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">What is Saheeb Drive?</h3>
                <ul className="space-y-2 text-[#8F859C] text-sm">
                  <li>- AI-powered car marketplace for Oman</li>
                  <li>- Launching Q3 2026, starting in Muscat</li>
                  <li>- Web + iOS + Android apps</li>
                  <li>- Conversational AI search (Arabic & English)</li>
                  <li>- AI verification & fraud detection</li>
                  <li>- ROP integration for vehicle records</li>
                </ul>
              </Card>

              <Card variant="default" padding="lg">
                <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">Core Problem</h3>
                <p className="text-[#8F859C] text-sm mb-4">
                  Oman&apos;s car market is broken: scams, fake listings, price manipulation.
                  Buyers don&apos;t trust sellers, and sellers can&apos;t reach qualified buyers.
                </p>
                <h4 className="text-sm font-semibold text-[#316BE9] mb-2">Target Users</h4>
                <ul className="space-y-1 text-[#8F859C] text-sm">
                  <li><strong className="text-[#FFFFFF]">Buyers:</strong> People looking for verified, trusted listings</li>
                  <li><strong className="text-[#FFFFFF]">Sellers:</strong> Car owners wanting qualified buyers</li>
                  <li><strong className="text-[#FFFFFF]">Dealers:</strong> Automotive businesses</li>
                </ul>
              </Card>

              <Card variant="default" padding="lg" className="md:col-span-2">
                <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">Brand Values</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: 'shield', label: 'Trust & Transparency' },
                    { icon: 'cpu', label: 'AI-Native Experience' },
                    { icon: 'flag', label: 'Local First (Oman)' },
                    { icon: 'sparkle', label: 'Premium & Modern' },
                  ].map((item) => (
                    <div key={item.label} className="text-center p-4 bg-[#1D1A22] rounded-xl border border-[#2A2633]">
                      <p className="text-sm font-medium text-[#FFFFFF]">{item.label}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </Container>
        </section>

        {/* Color Palette */}
        <section className="py-16 bg-[#0A0A0D]">
          <Container>
            <SectionHeader
              title="2. Color Palette"
              subtitle="Click any swatch to copy hex value"
            />

            {/* Background Colors */}
            <h3 className="text-lg font-semibold text-[#FFFFFF] mb-4">Backgrounds</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <ColorSwatch name="Primary" hex="#0A0A0D" cssVar="--bg-primary" usage="Main background" />
              <ColorSwatch name="Surface" hex="#0F1013" cssVar="--bg-surface" usage="Cards, elevated elements" />
              <ColorSwatch name="Elevated" hex="#1D1A22" cssVar="--bg-elevated" usage="Hover states, active elements" />
              <ColorSwatch name="Subtle" hex="#2A2633" cssVar="--bg-subtle" usage="Secondary surfaces" />
            </div>

            {/* Border Colors */}
            <h3 className="text-lg font-semibold text-[#FFFFFF] mb-4">Borders</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
              <ColorSwatch name="Default" hex="#2A2633" cssVar="--border-default" usage="Standard borders" />
              <ColorSwatch name="Subtle" hex="#2A2633" cssVar="--border-subtle" usage="Section dividers" />
              <ColorSwatch name="Hover" hex="#333338" cssVar="--border-hover" usage="Hover & focus borders" />
            </div>

            {/* Text Colors */}
            <h3 className="text-lg font-semibold text-[#FFFFFF] mb-4">Text</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
              <ColorSwatch name="Primary" hex="#FFFFFF" cssVar="--text-primary" usage="Headings, body text (never pure #FFF)" />
              <ColorSwatch name="Secondary" hex="#8F859C" cssVar="--text-secondary" usage="Descriptions, muted text" />
              <ColorSwatch name="Tertiary" hex="#5C5C63" cssVar="--text-tertiary" usage="Hints, captions, placeholders" />
            </div>

            {/* Accent */}
            <h3 className="text-lg font-semibold text-[#316BE9] mb-4">Accent (use sparingly)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <ColorSwatch name="Accent" hex="#316BE9" cssVar="--accent" usage="CTAs, key highlights (max 2-3 per screen)" />
              <ColorSwatch name="Accent Hover" hex="#4A82F5" cssVar="--accent-hover" usage="Hover state for accent elements" />
              <ColorSwatch name="Accent Muted" hex="rgba(49, 107, 233,0.15)" cssVar="--accent-muted" usage="Subtle accent backgrounds" />
            </div>

            {/* Functional */}
            <h3 className="text-lg font-semibold text-[#FFFFFF] mb-4">Functional</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
              <ColorSwatch name="Success" hex="#34D399" usage="Verified, confirmed states" />
              <ColorSwatch name="Error" hex="#F87171" usage="Error states, destructive actions" />
            </div>

            {/* Surface Examples */}
            <h3 className="text-lg font-semibold text-[#FFFFFF] mb-4">Surface Examples</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-[#0F1013] border border-[#2A2633]">
                <p className="text-sm font-medium text-[#FFFFFF] mb-2">Default Card</p>
                <code className="text-xs text-[#316BE9] font-mono">bg-[#0F1013] border-[#2A2633]</code>
              </div>
              <div className="p-6 rounded-2xl bg-[#0F1013] border border-[#333338]">
                <p className="text-sm font-medium text-[#FFFFFF] mb-2">Hovered Card</p>
                <code className="text-xs text-[#316BE9] font-mono">hover:border-[#333338]</code>
              </div>
              <div className="p-6 rounded-2xl bg-[#1D1A22] border border-[#2A2633]">
                <p className="text-sm font-medium text-[#FFFFFF] mb-2">Elevated Surface</p>
                <code className="text-xs text-[#316BE9] font-mono">bg-[#1D1A22]</code>
              </div>
            </div>
          </Container>
        </section>

        {/* Typography */}
        <section className="py-16 bg-[#0F1013]">
          <Container>
            <SectionHeader
              title="3. Typography"
              subtitle="Fonts and text scales"
            />

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <Card variant="default" padding="lg">
                <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">Fonts</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-[#5C5C63] mb-1">Display (Headings)</p>
                    <p className="text-2xl font-bold text-[#FFFFFF]" style={{ fontFamily: 'var(--font-plus-jakarta), Plus Jakarta Sans, sans-serif' }}>
                      Plus Jakarta Sans — Aa Bb Cc 123
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#5C5C63] mb-1">Body (English)</p>
                    <p className="text-2xl font-medium text-[#FFFFFF]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Inter — Aa Bb Cc 123
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#5C5C63] mb-1">Arabic</p>
                    <p className="text-2xl font-medium text-[#FFFFFF]" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }} dir="rtl">
                      IBM Plex Sans Arabic — Aa Bb Cc 123
                    </p>
                  </div>
                </div>
              </Card>

              <Card variant="default" padding="lg">
                <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">Font Weights</h3>
                <div className="space-y-2">
                  <p className="text-[#FFFFFF] font-normal">Regular (400) — body text</p>
                  <p className="text-[#FFFFFF] font-medium">Medium (500) — labels, emphasis</p>
                  <p className="text-[#FFFFFF] font-semibold">Semibold (600) — subheadings</p>
                  <p className="text-[#FFFFFF] font-bold">Bold (700) — headings</p>
                  <p className="text-[#FFFFFF] font-extrabold">Extrabold (800) — hero display</p>
                </div>
              </Card>
            </div>

            <h3 className="text-lg font-semibold text-[#FFFFFF] mb-4">Type Scale</h3>
            <div className="space-y-4 p-6 bg-[#0A0A0D] rounded-2xl border border-[#2A2633]">
              <div className="flex items-baseline gap-4">
                <code className="text-xs text-[#316BE9] font-mono w-24 shrink-0">text-5xl</code>
                <p className="text-5xl font-bold text-[#FFFFFF]">Heading 1</p>
              </div>
              <div className="flex items-baseline gap-4">
                <code className="text-xs text-[#316BE9] font-mono w-24 shrink-0">text-3xl</code>
                <p className="text-3xl font-bold text-[#FFFFFF]">Heading 2</p>
              </div>
              <div className="flex items-baseline gap-4">
                <code className="text-xs text-[#316BE9] font-mono w-24 shrink-0">text-xl</code>
                <p className="text-xl font-semibold text-[#FFFFFF]">Heading 3</p>
              </div>
              <div className="flex items-baseline gap-4">
                <code className="text-xs text-[#316BE9] font-mono w-24 shrink-0">text-base</code>
                <p className="text-base text-[#FFFFFF]">Body text (16px)</p>
              </div>
              <div className="flex items-baseline gap-4">
                <code className="text-xs text-[#316BE9] font-mono w-24 shrink-0">text-sm</code>
                <p className="text-sm text-[#8F859C]">Small text (14px)</p>
              </div>
              <div className="flex items-baseline gap-4">
                <code className="text-xs text-[#316BE9] font-mono w-24 shrink-0">text-xs</code>
                <p className="text-xs text-[#5C5C63]">Extra small (12px)</p>
              </div>
            </div>
          </Container>
        </section>

        {/* Components */}
        <section className="py-16 bg-[#0A0A0D]">
          <Container>
            <SectionHeader
              title="4. Component Library"
              subtitle="Interactive UI components"
            />

            {/* Buttons */}
            <h3 className="text-lg font-semibold text-[#FFFFFF] mb-4">Buttons</h3>
            <div className="p-6 bg-[#0F1013] rounded-2xl border border-[#2A2633] mb-8">
              <p className="text-xs text-[#5C5C63] mb-4">Variants</p>
              <div className="flex flex-wrap gap-4 mb-6">
                <Button variant="primary">Primary (Accent)</Button>
                <Button variant="secondary">Secondary (Outline)</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
              <p className="text-xs text-[#5C5C63] mb-4">Sizes</p>
              <div className="flex flex-wrap gap-4 mb-6">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
              </div>
              <p className="text-xs text-[#5C5C63] mb-4">States</p>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" isLoading>Loading</Button>
                <Button variant="primary" disabled>Disabled</Button>
              </div>
            </div>

            {/* Badges */}
            <h3 className="text-lg font-semibold text-[#FFFFFF] mb-4">Badges</h3>
            <div className="p-6 bg-[#0F1013] rounded-2xl border border-[#2A2633] mb-8">
              <div className="flex flex-wrap gap-4">
                <Badge variant="default">Default</Badge>
                <Badge variant="accent">Accent</Badge>
                <Badge variant="success">Success</Badge>
              </div>
            </div>

            {/* Cards */}
            <h3 className="text-lg font-semibold text-[#FFFFFF] mb-4">Cards</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <Card variant="default" padding="md">
                <p className="text-sm font-medium text-[#FFFFFF]">Default</p>
                <p className="text-xs text-[#5C5C63] mt-1">variant=&quot;default&quot; — bg-[#0F1013] border-[#2A2633]</p>
              </Card>
              <Card variant="outline" padding="md">
                <p className="text-sm font-medium text-[#FFFFFF]">Outline</p>
                <p className="text-xs text-[#5C5C63] mt-1">variant=&quot;outline&quot; — transparent border-[#2A2633]</p>
              </Card>
            </div>

            {/* Inputs */}
            <h3 className="text-lg font-semibold text-[#FFFFFF] mb-4">Form Inputs</h3>
            <div className="grid md:grid-cols-2 gap-6 p-6 bg-[#0F1013] rounded-2xl border border-[#2A2633]">
              <div className="space-y-4">
                <Input placeholder="Default input" />
                <Input placeholder="With error" error="This field is required" />
                <Input placeholder="Disabled" disabled />
              </div>
              <div>
                <Textarea placeholder="Textarea input..." rows={5} />
              </div>
            </div>
          </Container>
        </section>

        {/* Mobile Guidelines */}
        <section className="py-16 bg-[#0F1013]">
          <Container>
            <SectionHeader
              title="5. Mobile App Guidelines"
              subtitle="iOS & Android design specifications"
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card variant="default" padding="lg">
                <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">Screen Sizes</h3>
                <ul className="space-y-2 text-sm text-[#8F859C]">
                  <li><strong className="text-[#FFFFFF]">iOS:</strong> 375px - 430px</li>
                  <li><strong className="text-[#FFFFFF]">Android:</strong> 360px - 412px</li>
                  <li className="text-[#5C5C63]">Respect safe areas (notches, home indicators)</li>
                </ul>
              </Card>

              <Card variant="default" padding="lg">
                <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">Touch Targets</h3>
                <ul className="space-y-2 text-sm text-[#8F859C]">
                  <li><strong className="text-[#FFFFFF]">Minimum:</strong> 44x44pt (iOS) / 48x48dp (Android)</li>
                  <li><strong className="text-[#FFFFFF]">Comfortable:</strong> 48x48pt / 56x56dp</li>
                  <li><strong className="text-[#FFFFFF]">Spacing:</strong> 8px minimum between targets</li>
                </ul>
              </Card>

              <Card variant="default" padding="lg">
                <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">Bottom Navigation</h3>
                <ul className="space-y-2 text-sm text-[#8F859C]">
                  <li>- 4-5 tabs maximum</li>
                  <li>- Icons + labels always</li>
                  <li><strong className="text-[#316BE9]">Active:</strong> Accent highlight (#316BE9)</li>
                  <li><strong className="text-[#5C5C63]">Inactive:</strong> Tertiary (#5C5C63)</li>
                </ul>
              </Card>

              <Card variant="default" padding="lg">
                <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">Gestures</h3>
                <ul className="space-y-2 text-sm text-[#8F859C]">
                  <li><strong className="text-[#FFFFFF]">Swipe L/R:</strong> Image carousel</li>
                  <li><strong className="text-[#FFFFFF]">Pull down:</strong> Refresh</li>
                  <li><strong className="text-[#FFFFFF]">Long press:</strong> Quick actions</li>
                  <li><strong className="text-[#FFFFFF]">Swipe:</strong> Delete/archive</li>
                </ul>
              </Card>

              <Card variant="default" padding="lg">
                <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">Border Radius</h3>
                <ul className="space-y-2 text-sm text-[#8F859C]">
                  <li><strong className="text-[#FFFFFF]">Buttons/Inputs:</strong> 12px (rounded-xl)</li>
                  <li><strong className="text-[#FFFFFF]">Cards:</strong> 16px (rounded-2xl)</li>
                  <li><strong className="text-[#FFFFFF]">Badges:</strong> Full (rounded-full)</li>
                </ul>
              </Card>

              <Card variant="default" padding="lg">
                <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">Elevation</h3>
                <ul className="space-y-2 text-sm text-[#8F859C]">
                  <li><strong className="text-[#FFFFFF]">Default:</strong> No shadow, border only</li>
                  <li><strong className="text-[#FFFFFF]">Hover:</strong></li>
                  <li className="font-mono text-xs">hover:border-[#333338]</li>
                  <li><strong className="text-[#FFFFFF]">Elevated hover:</strong></li>
                  <li className="font-mono text-xs">shadow-[0_4px_24px_rgba(0,0,0,0.4)]</li>
                </ul>
              </Card>
            </div>
          </Container>
        </section>

        {/* Car Marketplace Components */}
        <section className="py-16 bg-[#0A0A0D]">
          <Container>
            <SectionHeader
              title="6. Car Marketplace Components"
              subtitle="Saheeb Drive specific UI patterns"
            />

            <div className="grid md:grid-cols-2 gap-8">
              <Card variant="default" padding="lg">
                <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">Car Listing Card</h3>
                <ul className="space-y-2 text-sm text-[#8F859C]">
                  <li>- Image carousel with dots indicator</li>
                  <li>- <span className="text-[#316BE9]">Price badge (accent, prominent)</span></li>
                  <li>- <span className="text-emerald-400">Verified badge (success green)</span></li>
                  <li>- Key specs: year | mileage | transmission</li>
                  <li>- Seller type: Private / Dealer</li>
                  <li>- Favorite heart icon (top right)</li>
                </ul>
              </Card>

              <Card variant="default" padding="lg">
                <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">Search & Filters</h3>
                <ul className="space-y-2 text-sm text-[#8F859C]">
                  <li>- AI chat input (hero, prominent)</li>
                  <li>- Filter chips: scrollable horizontal</li>
                  <li>- <span className="text-[#316BE9]">Active filters: accent background</span></li>
                  <li>- Sort: bottom sheet on mobile</li>
                  <li>- Results count + clear all</li>
                </ul>
              </Card>

              <Card variant="default" padding="lg">
                <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">Car Detail Screen</h3>
                <ul className="space-y-2 text-sm text-[#8F859C]">
                  <li>- Full-width image gallery</li>
                  <li>- Sticky price bar at bottom</li>
                  <li>- Specs grid (2 columns)</li>
                  <li>- Seller card with contact CTA</li>
                  <li>- Similar listings carousel</li>
                </ul>
              </Card>

              <Card variant="default" padding="lg">
                <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">User States</h3>
                <ul className="space-y-2 text-sm text-[#8F859C]">
                  <li>- <span className="text-[#5C5C63]">Loading:</span> Skeleton cards with pulse</li>
                  <li>- <span className="text-[#5C5C63]">Empty:</span> Illustration + &quot;No results&quot; + CTA</li>
                  <li>- <span className="text-[#F87171]">Error:</span> Red banner + retry button</li>
                  <li>- <span className="text-[#34D399]">Success:</span> Checkmark animation</li>
                </ul>
              </Card>

              <Card variant="default" padding="lg" className="md:col-span-2">
                <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">Forms (Listing Creation)</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <ul className="space-y-2 text-sm text-[#8F859C]">
                    <li>- Multi-step wizard with progress</li>
                    <li>- Image upload: camera + gallery</li>
                    <li>- Price input with OMR currency</li>
                  </ul>
                  <ul className="space-y-2 text-sm text-[#8F859C]">
                    <li>- City picker (Omani cities dropdown)</li>
                    <li>- Inline validation (real-time)</li>
                    <li>- Required field indicators</li>
                  </ul>
                </div>
              </Card>
            </div>
          </Container>
        </section>

        {/* Iconography */}
        <section className="py-16 bg-[#0F1013] border-b border-[#2A2633]">
          <Container>
            <SectionHeader
              title="7. Iconography"
              subtitle="Icon usage guidelines"
            />

            <div className="grid md:grid-cols-2 gap-8">
              <Card variant="default" padding="lg">
                <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">Icon Library</h3>
                <ul className="space-y-2 text-sm text-[#8F859C]">
                  <li>- <strong className="text-[#FFFFFF]">Primary:</strong> Lucide React icons</li>
                  <li>- Custom car-related icons where needed</li>
                  <li>- Consistent stroke width (2px default)</li>
                </ul>
              </Card>

              <Card variant="default" padding="lg">
                <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">Icon Sizes</h3>
                <div className="flex items-end gap-6">
                  <div className="text-center">
                    <div className="w-4 h-4 bg-[#8F859C] rounded mb-2 mx-auto" />
                    <p className="text-xs text-[#5C5C63]">16px</p>
                  </div>
                  <div className="text-center">
                    <div className="w-5 h-5 bg-[#8F859C] rounded mb-2 mx-auto" />
                    <p className="text-xs text-[#5C5C63]">20px</p>
                  </div>
                  <div className="text-center">
                    <div className="w-6 h-6 bg-[#8F859C] rounded mb-2 mx-auto" />
                    <p className="text-xs text-[#5C5C63]">24px</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-[#8F859C] rounded mb-2 mx-auto" />
                    <p className="text-xs text-[#5C5C63]">32px</p>
                  </div>
                </div>
              </Card>

              <Card variant="default" padding="lg" className="md:col-span-2">
                <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">Icon Colors</h3>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#8F859C] rounded" />
                    <span className="text-sm text-[#8F859C]">Default (#8F859C)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#316BE9] rounded" />
                    <span className="text-sm text-[#8F859C]">Accent (#316BE9)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#34D399] rounded" />
                    <span className="text-sm text-[#8F859C]">Success (#34D399)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#F87171] rounded" />
                    <span className="text-sm text-[#8F859C]">Error (#F87171)</span>
                  </div>
                </div>
              </Card>
            </div>
          </Container>
        </section>

        {/* Design Principles */}
        <section className="py-16 bg-[#0A0A0D]">
          <Container>
            <SectionHeader
              title="8. Design Principles"
              subtitle="Rules for maintaining visual consistency"
            />

            <div className="grid md:grid-cols-2 gap-6">
              <Card variant="default" padding="lg">
                <h3 className="text-lg font-bold text-[#FFFFFF] mb-3">Restraint</h3>
                <p className="text-sm text-[#8F859C]">
                  The accent color (#316BE9) appears in max 2-3 elements per screen — a CTA button, one heading, maybe a small indicator. Everything else is grayscale. This makes the accent feel intentional, not decorative.
                </p>
              </Card>
              <Card variant="default" padding="lg">
                <h3 className="text-lg font-bold text-[#FFFFFF] mb-3">No Gradients</h3>
                <p className="text-sm text-[#8F859C]">
                  Solid colors only. No gradient text, no gradient backgrounds on cards, no glow effects. Use border color changes and subtle shadows for elevation.
                </p>
              </Card>
              <Card variant="default" padding="lg">
                <h3 className="text-lg font-bold text-[#FFFFFF] mb-3">Minimal Animation</h3>
                <p className="text-sm text-[#8F859C]">
                  Scroll animations: simple opacity 0 to 1 + y: 12 to 0 over 0.4s. No bouncing, no floating orbs, no stagger delay over 0.08s. No pulse-glow or shimmer.
                </p>
              </Card>
              <Card variant="default" padding="lg">
                <h3 className="text-lg font-bold text-[#FFFFFF] mb-3">Typography Hierarchy</h3>
                <p className="text-sm text-[#8F859C]">
                  Use font-weight contrast for hierarchy, not color contrast. Headings are bold #FFFFFF, body is regular #8F859C, hints are #5C5C63. Never use pure white (#FFF).
                </p>
              </Card>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
