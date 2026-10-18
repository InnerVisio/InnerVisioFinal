import React from 'react';
import { motion } from 'framer-motion';
import { Box, Check, Clock, LucideIcon, Palette, ScanEye, ShieldCheck, Smartphone, Sofa, Sparkles, Video } from 'lucide-react';
import { AI_BEFORE_AFTER } from '../../constants';
import { BRAND, blurInRise } from '../ui/brand';
import { AiPlan, AiPricingContent, BenefitIcon, PlanIcon } from './aiPricingContent';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { FOCUS_RING, requestService } from './pricingNav';

const BENEFIT_ICONS: Record<BenefitIcon, LucideIcon> = {
  clock: Clock,
  phone: Smartphone,
  palette: Palette,
  scan: ScanEye,
};

const PLAN_ICONS: Record<PlanIcon, LucideIcon> = {
  sofa: Sofa,
  sparkles: Sparkles,
  video: Video,
};

// Brand blur-in rise; the filter is dropped once settled so it does not cut off the glass backdrop blur of children
export const riseIn = (delay = 0) => {
  const preset = blurInRise(delay);
  return { ...preset, whileInView: { ...preset.whileInView, transitionEnd: { filter: 'none' } } };
};

// Shared surfaces and typography for both pricing tabs, so AI and classic 3D look equally premium
export const PRICING_UI = {
  // Softer inner glow than the featured card keeps every card plum-lit, not grey
  card: `${BRAND.card} ${BRAND.cardHover} !bg-[radial-gradient(120%_60%_at_20%_0%,rgba(162,77,184,0.16)_0%,transparent_62%)]`,
  featuredCard: BRAND.featuredCard,
  featuredHalo: 'absolute -inset-8 -z-10 rounded-[56px] glow-plum opacity-70',
  badge: `${BRAND.badge} absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1.5 whitespace-nowrap shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_0_24px_rgba(162,77,184,0.55)]`,
  cardTitle: 'font-display font-semibold text-ink text-xl tracking-tightest leading-snug',
  price: 'font-display font-bold text-ink text-4xl md:text-[2.75rem] tracking-tightest leading-none',
  divider: 'h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent',
  feature: 'flex items-start gap-3 text-sm text-ink-2 leading-relaxed',
  tick: 'w-4 h-4 mt-[3px] text-orchid-soft shrink-0',
  cta: 'mt-auto h-[52px] w-full text-sm',
  h3: 'font-display font-bold text-ink text-3xl md:text-[2.75rem] tracking-tightest leading-[1.1]',
  sub: 'mt-4 text-ink-2 font-light text-sm md:text-base leading-relaxed',
} as const;

export const IconTile: React.FC<{ icon: LucideIcon; size?: 'md' | 'sm' }> = ({ icon: Icon, size = 'md' }) => (
  <div className={size === 'md' ? BRAND.iconChip : 'icon-chip w-9 h-9 shrink-0 rounded-xl'}>
    <Icon className={`${size === 'md' ? 'w-5 h-5' : 'w-4 h-4'} icon-gradient`} strokeWidth={1.5} aria-hidden />
  </div>
);

const PlanCard: React.FC<{ plan: AiPlan; from: string; featuredBadge: string; index: number }> = ({ plan, from, featuredBadge, index }) => {
  const Icon = PLAN_ICONS[plan.icon];
  return (
    <motion.article
      {...riseIn(index * 0.08)}
      className={`relative isolate flex flex-col p-8 md:p-9 ${plan.isFeatured ? `${PRICING_UI.featuredCard} mt-4 lg:mt-0` : PRICING_UI.card}`}
    >
      {plan.isFeatured && (
        <>
          <div className={PRICING_UI.featuredHalo} aria-hidden />
          <div className={PRICING_UI.badge}>{featuredBadge}</div>
        </>
      )}

      <IconTile icon={Icon} />

      <h3 className={`mt-6 ${PRICING_UI.cardTitle}`}>{plan.title}</h3>
      <p className="mt-2 text-sm text-ink-2 font-light leading-relaxed">{plan.description}</p>

      <div className="mt-7 flex items-baseline gap-2 flex-wrap">
        <span className="font-display text-sm text-ink-2">{from}</span>
        <span className={PRICING_UI.price}>{plan.price}</span>
        <span className="font-display text-sm text-ink-2">{plan.unit}</span>
      </div>
      {plan.note && <p className="mt-2 text-xs text-ink-3">{plan.note}</p>}

      <div className={`${PRICING_UI.divider} my-7`} />

      <ul className="space-y-3.5 mb-9">
        {plan.features.map((feature) => (
          <li key={feature} className={PRICING_UI.feature}>
            <Check className={PRICING_UI.tick} strokeWidth={2} aria-hidden />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <a
        href="#contact"
        onClick={() => requestService(plan.id)}
        className={`${plan.isFeatured ? BRAND.btnPrimary : BRAND.btnGlass} ${PRICING_UI.cta}`}
      >
        {plan.cta}
      </a>
    </motion.article>
  );
};

export const AiPricingPanel: React.FC<{ content: AiPricingContent }> = ({ content }) => {
  const { benefits, plans, package: pkg, beforeAfter, comparison } = content;

  return (
    <div className="space-y-24 md:space-y-32">
      {/* Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {benefits.map((benefit, i) => (
          <motion.div key={benefit.title} {...riseIn(i * 0.06)} className={`${BRAND.card} p-6 md:p-7`}>
            <IconTile icon={BENEFIT_ICONS[benefit.icon]} />
            <h3 className="mt-5 font-display font-semibold text-ink text-base md:text-lg tracking-tightest">{benefit.title}</h3>
            <p className="mt-2 text-sm text-ink-2 font-light leading-relaxed">{benefit.text}</p>
          </motion.div>
        ))}
      </div>

      {/* Plans + package */}
      <div className="space-y-8 md:space-y-10">
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 max-w-xl mx-auto lg:max-w-none pt-4 items-stretch">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[80%] rounded-full glow-plum opacity-70 pointer-events-none" aria-hidden />
          {plans.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} from={content.from} featuredBadge={content.featuredBadge} index={i} />
          ))}
        </div>

        <motion.div
          {...riseIn(0.1)}
          className="relative isolate overflow-hidden rounded-card-lg bg-deep-plum border-[1.5px] border-white/[0.18] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_30px_80px_rgba(0,0,0,0.55),0_0_60px_rgba(162,77,184,0.18)] p-8 md:p-12 max-w-xl mx-auto lg:max-w-none"
        >
          {/* Logo-plum sheen and soft inner glows */}
          <div className="absolute inset-0 -z-10 bg-logo-plum opacity-60 [mask-image:linear-gradient(90deg,transparent_0%,#000_100%)]" aria-hidden />
          <div className="absolute -top-28 -left-20 w-96 h-96 -z-10 rounded-full glow-plum" aria-hidden />
          <div className="absolute -bottom-32 right-[12%] w-80 h-80 -z-10 rounded-full glow-orchid opacity-60" aria-hidden />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <span className="eyebrow">{pkg.eyebrow}</span>
              <h3 className="mt-3 font-display font-bold text-ink text-2xl md:text-[2rem] tracking-tightest leading-tight">{pkg.title}</h3>
              <p className="mt-3 text-sm md:text-base text-ink-2 font-light leading-relaxed">{pkg.text}</p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row sm:items-center lg:items-end xl:items-center gap-6 shrink-0">
              <div className="flex flex-col lg:items-end">
                <div className="flex items-baseline gap-3 font-display">
                  <span className="text-4xl md:text-5xl font-bold text-ink tracking-tightest leading-none">{pkg.price}</span>
                  <span className="text-base text-ink-3 line-through">
                    <span className="sr-only">{pkg.oldPriceLabel}: </span>
                    {pkg.oldPrice}
                  </span>
                </div>
                <span className="mt-3 self-start lg:self-end glass-pill px-3.5 py-1 font-display font-medium text-xs text-orchid-pale">
                  {pkg.saving}
                </span>
              </div>
              <a
                href="#contact"
                onClick={() => requestService('ai-package')}
                className={`${BRAND.btnLight} h-[52px] px-8 text-sm whitespace-nowrap`}
              >
                {pkg.cta}
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Before / after */}
      <div>
        <motion.div {...riseIn()} className="text-center mb-10 md:mb-12">
          <h3 className={PRICING_UI.h3}>{beforeAfter.title}</h3>
          <p className={PRICING_UI.sub}>{beforeAfter.subtitle}</p>
        </motion.div>
        <motion.div {...riseIn(0.1)} className="max-w-5xl mx-auto">
          <BeforeAfterSlider
            beforeSrc={AI_BEFORE_AFTER.before || undefined}
            afterSrc={AI_BEFORE_AFTER.after || undefined}
            beforeLabel={beforeAfter.beforeLabel}
            afterLabel={beforeAfter.afterLabel}
            sliderLabel={beforeAfter.sliderLabel}
            beforePlaceholder={beforeAfter.beforePlaceholder}
            afterPlaceholder={beforeAfter.afterPlaceholder}
          />
        </motion.div>
      </div>

      {/* Comparison */}
      <div>
        <motion.div {...riseIn()} className="text-center mb-10 md:mb-12">
          <h3 className={PRICING_UI.h3}>{comparison.title}</h3>
          <p className={`${PRICING_UI.sub} max-w-2xl mx-auto`}>{comparison.subtitle}</p>
        </motion.div>

        <motion.div {...riseIn(0.1)} className="max-w-5xl mx-auto">
          <p className="md:hidden mb-3 text-center font-display font-medium text-[11px] uppercase tracking-[0.2em] text-ink-3">{comparison.scrollHint}</p>
          <div
            className={`glass rounded-card-lg overflow-x-auto custom-scrollbar ${FOCUS_RING}`}
            tabIndex={0}
            role="region"
            aria-label={comparison.title}
          >
            <table className="w-full min-w-[640px] text-left border-collapse">
              <thead>
                <tr>
                  <td className="p-5 md:p-7 w-[22%]" />
                  <th
                    scope="col"
                    className="p-5 md:p-7 bg-[radial-gradient(120%_100%_at_50%_0%,rgba(162,77,184,0.26)_0%,rgba(162,77,184,0.10)_70%)] border-x border-orchid-soft/15"
                  >
                    <span className="flex items-center gap-3 font-display font-semibold text-ink text-base md:text-lg tracking-tightest">
                      <IconTile icon={Sparkles} size="sm" />
                      {comparison.colAi}
                    </span>
                  </th>
                  <th scope="col" className="p-5 md:p-7">
                    <span className="flex items-center gap-3 font-display font-semibold text-ink text-base md:text-lg tracking-tightest">
                      <IconTile icon={Box} size="sm" />
                      {comparison.col3d}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.rows.map((row) => (
                  <tr key={row.label} className="border-t border-white/[0.08]">
                    <th scope="row" className="p-5 md:p-7 font-display font-medium text-[11px] uppercase tracking-[0.16em] text-ink-3 align-top">
                      {row.label}
                    </th>
                    <td className="p-5 md:p-7 text-sm md:text-base text-ink font-light leading-relaxed bg-[rgba(162,77,184,0.10)] border-x border-orchid-soft/15 align-top">
                      {row.ai}
                    </td>
                    <td className="p-5 md:p-7 text-sm md:text-base text-ink font-light leading-relaxed align-top">{row.classic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={`mt-6 flex items-start gap-4 p-5 md:p-6 ${BRAND.card}`}>
            <IconTile icon={ShieldCheck} />
            <p className="text-sm text-ink-2 font-light leading-relaxed">
              <strong className="font-semibold text-ink">{comparison.noticeTitle}</strong> {comparison.noticeText}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
