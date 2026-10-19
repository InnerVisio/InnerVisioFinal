import React from 'react';
import { motion } from 'framer-motion';
import { Box, Check, Clock, LucideIcon, Palette, ScanEye, ShieldCheck, Smartphone, Sofa, Sparkles, Video } from 'lucide-react';
import { AI_BEFORE_AFTER } from '../../constants';
import { BRAND, blurInRise } from '../ui/brand';
import { Language } from '../LanguageContext';
import { AiPlan, AiPricingContent, BenefitIcon, PlanIcon } from './aiPricingContent';
import { AiShowcase } from './AiShowcase';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { requestService } from './pricingNav';

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

// Brand blur-in rise; the filter is dropped once settled so it does not cut off the backdrop blur of children
export const riseIn = (delay = 0) => {
  const preset = blurInRise(delay);
  return { ...preset, whileInView: { ...preset.whileInView, transitionEnd: { filter: 'none' } } };
};

// Shared visual language for both pricing tabs: hairline borders, one plum accent, big Poppins prices
export const PRICING_UI = {
  // Quiet card: hairline border on near-black, no glass, no fill gradient
  card: 'rounded-card border border-white/10 bg-white/[0.025] transition-colors duration-500 md:hover:border-white/20 md:hover:bg-white/[0.04]',
  // Featured card: the only surface with a plum fill, plus the single glow of the tab (a box-shadow, so it never washes over the card)
  featuredCard:
    'rounded-card border border-orchid-soft/40 bg-[linear-gradient(180deg,#2a1434_0%,#170b1f_100%)] shadow-[inset_0_1px_0_rgba(240,212,244,0.28),0_0_110px_6px_rgba(122,53,137,0.38),0_30px_80px_rgba(0,0,0,0.5)]',
  cardTitle: 'font-display font-semibold text-ink text-lg md:text-xl tracking-tightest leading-snug',
  hairline: 'border-white/10',
  feature: 'flex items-start gap-3 text-[13px] md:text-sm text-ink-2 leading-snug',
  tick: 'w-4 h-4 mt-px text-orchid-soft shrink-0',
  // Outline button for non-featured plans; the filled plum button is reserved for the featured one
  btnOutline:
    'focus-ring inline-flex items-center justify-center gap-2 rounded-full font-display font-medium border border-white/15 text-ink transition-colors duration-300 md:hover:border-orchid-soft/70 md:hover:bg-white/[0.05]',
  cta: 'h-12 md:h-[52px] w-full text-sm',
  h3: 'font-display font-semibold text-ink text-2xl md:text-4xl tracking-tightest leading-[1.1]',
  sub: 'mt-3 text-ink-2 font-light text-sm md:text-base leading-relaxed',
} as const;

export const IconTile: React.FC<{ icon: LucideIcon; size?: 'md' | 'sm' }> = ({ icon: Icon, size = 'md' }) => (
  <div className={size === 'md' ? 'icon-chip w-10 h-10 shrink-0 rounded-xl' : 'icon-chip w-9 h-9 shrink-0 rounded-xl'}>
    <Icon className={`${size === 'md' ? 'w-[18px] h-[18px]' : 'w-4 h-4'} icon-gradient`} strokeWidth={1.5} aria-hidden />
  </div>
);

// "2 900 Kč" -> amount "2 900" + currency "Kč" (so the currency can be set smaller); "€116" stays whole
const splitCurrency = (price: string): [string, string] => {
  const m = price.match(/^(.*\d)\s*(Kč)$/);
  return m ? [m[1], m[2]] : [price, ''];
};

export interface PriceProps {
  from?: string;
  price: string;
  unit?: string;
  size?: 'md' | 'lg';
  className?: string;
}

// "od" small, number large, currency + unit small. Text is kept in reading order with real spaces for crawlers.
export const Price: React.FC<PriceProps> = ({ from, price, unit, size = 'lg', className = '' }) => {
  const [amount, currency] = splitCurrency(price);
  const hasNumber = /\d/.test(price);
  const amountSize = hasNumber
    ? size === 'lg'
      ? 'text-[2.5rem] xl:text-5xl'
      : 'text-3xl md:text-[2.5rem]'
    : 'text-xl md:text-2xl';
  return (
    <p className={`flex flex-wrap items-baseline gap-x-1.5 gap-y-1 font-display ${className}`}>
      {from && <span className="text-sm text-ink-2">{from}</span>}{' '}
      <span className={`font-semibold text-ink tracking-tightest leading-none ${amountSize}`}>{amount}</span>
      {currency && (
        <>
          {' '}
          <span className="text-base md:text-lg font-medium text-ink-2">{currency}</span>
        </>
      )}
      {unit && (
        <>
          {' '}
          <span className="text-sm text-ink-2 whitespace-nowrap">{unit}</span>
        </>
      )}
    </p>
  );
};

const PlanCard: React.FC<{ plan: AiPlan; from: string; index: number }> = ({ plan, from, index }) => {
  const Icon = PLAN_ICONS[plan.icon];
  const featured = !!plan.isFeatured;
  return (
    // On desktop the card is a subgrid of 5 shared rows, so title / price / copy / features / button line up across all three plans
    <motion.article
      {...riseIn(index * 0.08)}
      className={`relative flex flex-col p-5 md:p-7 md:max-lg:grid md:max-lg:grid-cols-2 md:max-lg:gap-x-10 md:max-lg:content-start lg:grid lg:grid-rows-subgrid lg:row-span-5 ${
        featured ? PRICING_UI.featuredCard : PRICING_UI.card
      }`}
    >
      <div className="flex items-start gap-3.5 md:max-lg:col-start-1">
        <IconTile icon={Icon} />
        <h3 className={`${PRICING_UI.cardTitle} pt-0.5`}>{plan.title}</h3>
      </div>

      <div className="mt-5 lg:mt-7 md:max-lg:col-start-1">
        <Price from={from} price={plan.price} unit={plan.unit} />
        {plan.note && <p className="mt-2 text-xs text-ink-2">{plan.note}</p>}
      </div>

      <p className="mt-3 lg:mt-4 md:max-lg:col-start-1 text-[13px] md:text-sm text-ink-2 font-light leading-relaxed">{plan.description}</p>

      <ul className={`mt-5 pt-5 border-t ${PRICING_UI.hairline} space-y-2.5 lg:self-start md:max-lg:col-start-2 md:max-lg:row-start-1 md:max-lg:row-span-3 md:max-lg:mt-0 md:max-lg:pt-0 md:max-lg:border-t-0 md:max-lg:border-l md:max-lg:pl-10 md:max-lg:self-center`}>
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
        className={`mt-6 lg:mt-7 lg:self-end md:max-lg:col-span-2 ${featured ? BRAND.btnPrimary : PRICING_UI.btnOutline} ${PRICING_UI.cta}`}
      >
        {plan.cta}
      </a>
    </motion.article>
  );
};

const BlockHead: React.FC<{ title: string; subtitle: string; className?: string }> = ({ title, subtitle, className = '' }) => (
  <div className={className}>
    <h3 className={PRICING_UI.h3}>{title}</h3>
    <p className={PRICING_UI.sub}>{subtitle}</p>
  </div>
);

export const AiPricingPanel: React.FC<{ content: AiPricingContent; language: Language }> = ({ content, language }) => {
  const { benefits, plans, package: pkg, beforeAfter, comparison } = content;

  return (
    <div className="space-y-14 md:space-y-24">
      {/* Benefits: a slim strip with hairline dividers instead of four boxes */}
      <motion.ul {...riseIn()} className="grid grid-cols-2 lg:grid-cols-4 border-y border-white/10">
        {benefits.map((benefit, i) => {
          const Icon = BENEFIT_ICONS[benefit.icon];
          return (
            <li
              key={benefit.title}
              className={`py-5 lg:py-7 lg:px-8 lg:first:pl-0 lg:last:pr-0 border-white/10 ${i % 2 === 0 ? 'pr-3.5 sm:pr-6' : 'pl-3.5 sm:pl-6 border-l'} ${
                i < 2 ? 'border-b lg:border-b-0' : ''
              } ${i > 0 ? 'lg:border-l' : ''}`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-[18px] h-[18px] text-orchid-soft shrink-0" strokeWidth={1.5} aria-hidden />
                <h3 className="font-display font-medium text-ink text-sm md:text-base tracking-tightest leading-snug">{benefit.title}</h3>
              </div>
              <p className="mt-2 text-[13px] md:text-sm text-ink-2 font-light leading-relaxed">{benefit.text}</p>
            </li>
          );
        })}
      </motion.ul>

      {/* Plans + package */}
      <div className="space-y-5 md:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-[repeat(5,auto)] gap-x-5 xl:gap-x-6 gap-y-7 lg:gap-y-0 max-w-xl md:max-w-none mx-auto pt-3">
          {plans.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} from={content.from} index={i} />
          ))}
        </div>

        <motion.div
          {...riseIn(0.1)}
          className="relative overflow-hidden rounded-card border border-white/10 bg-[linear-gradient(100deg,rgba(91,39,105,0.45)_0%,rgba(31,15,41,0.55)_45%,rgba(255,255,255,0.02)_100%)] p-6 md:p-9 lg:px-12 max-w-xl md:max-w-none mx-auto"
        >
          <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-orchid-soft/50 to-transparent" aria-hidden />
          <div className="grid lg:grid-cols-[minmax(0,1fr)_auto] items-center gap-7 lg:gap-14">
            <div className="max-w-2xl">
              <span className="eyebrow">{pkg.eyebrow}</span>
              <h3 className="mt-2.5 font-display font-semibold text-ink text-2xl md:text-3xl tracking-tightest leading-tight">{pkg.title}</h3>
              <p className="mt-3 text-sm md:text-base text-ink-2 font-light leading-relaxed">{pkg.text}</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8 lg:border-l lg:border-white/10 lg:pl-14">
              <div>
                <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1 font-display">
                  <Price price={pkg.price} size="lg" />
                  <span className="text-base text-ink-2 line-through decoration-ink-3">
                    <span className="sr-only">{pkg.oldPriceLabel}: </span>
                    {pkg.oldPrice}
                  </span>
                </div>
                <span className="mt-3 inline-flex px-3 py-1 rounded-full border border-orchid-soft/30 bg-orchid-soft/[0.08] font-display font-medium text-xs text-orchid-pale">
                  {pkg.saving}
                </span>
              </div>
              <a
                href="#contact"
                onClick={() => requestService('ai-package')}
                className={`${BRAND.btnLight} h-12 md:h-[52px] px-8 text-sm whitespace-nowrap`}
              >
                {pkg.cta}
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Before / after: copy left, one calm slider right */}
      <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-center gap-7 lg:gap-14">
        <motion.div {...riseIn()}>
          <BlockHead title={beforeAfter.title} subtitle={beforeAfter.subtitle} />
        </motion.div>
        <motion.div {...riseIn(0.1)}>
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

      {/* AI video and extra still examples */}
      <AiShowcase language={language} />

      {/* Comparison: one table. Two columns from md up, stacked rows on phones (same markup, no horizontal scroll) */}
      <div>
        <motion.div {...riseIn()} className="grid md:grid-cols-2 md:items-end gap-x-14 mb-8 md:mb-10">
          <h3 className={PRICING_UI.h3}>{comparison.title}</h3>
          <p className={`${PRICING_UI.sub} md:mt-0 md:max-w-md md:justify-self-end`}>{comparison.subtitle}</p>
        </motion.div>

        <motion.div {...riseIn(0.1)} className="rounded-card border border-white/10 overflow-hidden">
          <table role="table" className="block md:table w-full text-left border-collapse">
            <thead role="rowgroup" className="hidden md:table-header-group">
              <tr role="row">
                <td role="presentation" className="w-[20%]" />
                <th
                  scope="col"
                  role="columnheader"
                  className="p-6 lg:px-8 bg-[linear-gradient(180deg,rgba(162,77,184,0.20)_0%,rgba(162,77,184,0.08)_100%)] border-x border-orchid-soft/15 border-t-2 border-t-orchid-soft/60"
                >
                  <span className="flex items-center gap-3 font-display font-semibold text-ink text-base lg:text-lg tracking-tightest">
                    <IconTile icon={Sparkles} size="sm" />
                    {comparison.colAi}
                  </span>
                </th>
                <th scope="col" role="columnheader" className="p-6 lg:px-8 border-t-2 border-t-transparent">
                  <span className="flex items-center gap-3 font-display font-semibold text-ink text-base lg:text-lg tracking-tightest">
                    <IconTile icon={Box} size="sm" />
                    {comparison.col3d}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody role="rowgroup" className="block md:table-row-group">
              {comparison.rows.map((row, i) => {
                const isLast = i === comparison.rows.length - 1;
                const valueStyle = isLast ? 'font-display font-medium text-ink' : 'text-ink';
                return (
                  <tr key={row.label} role="row" className="block md:table-row border-t border-white/10 px-5 py-4 md:p-0">
                    <th
                      scope="row"
                      role="rowheader"
                      className="block md:table-cell mb-2.5 md:mb-0 md:p-6 lg:px-8 md:align-top font-display font-medium text-[11px] uppercase tracking-[0.16em] text-ink-3 md:pt-[26px]"
                    >
                      {row.label}
                    </th>
                    <td
                      role="cell"
                      data-label={comparison.colAi}
                      className={`block md:table-cell md:p-6 lg:px-8 md:align-top text-sm md:text-base leading-relaxed ${valueStyle} border-l-2 border-orchid-soft/50 pl-3 md:pl-6 lg:pl-8 md:border-l md:border-l-orchid-soft/15 md:border-r md:border-r-orchid-soft/15 md:bg-[rgba(162,77,184,0.07)] before:block before:content-[attr(data-label)] before:mb-0.5 before:font-display before:font-medium before:text-[11px] before:uppercase before:tracking-[0.14em] before:text-orchid-soft md:before:hidden`}
                    >
                      {row.ai}
                    </td>
                    <td
                      role="cell"
                      data-label={comparison.col3d}
                      className={`block md:table-cell mt-3 md:mt-0 md:p-6 lg:px-8 md:align-top text-sm md:text-base leading-relaxed ${valueStyle} border-l-2 border-white/15 pl-3 md:pl-6 lg:pl-8 md:border-l-0 before:block before:content-[attr(data-label)] before:mb-0.5 before:font-display before:font-medium before:text-[11px] before:uppercase before:tracking-[0.14em] before:text-ink-3 md:before:hidden`}
                    >
                      {row.classic}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex items-start gap-3.5 border-t border-white/10 bg-white/[0.02] px-5 py-5 md:px-8">
            <ShieldCheck className="w-[18px] h-[18px] mt-0.5 text-orchid-soft shrink-0" strokeWidth={1.5} aria-hidden />
            <p className="text-[13px] md:text-sm text-ink-2 font-light leading-relaxed">
              <strong className="font-semibold text-ink">{comparison.noticeTitle}</strong> {comparison.noticeText}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
