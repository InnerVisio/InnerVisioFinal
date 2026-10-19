import { blurInRise } from '../ui/brand';

// Same blur-in rise as the rest of the site, but the blur filter is cleared afterwards
// (a leftover filter disables backdrop-filter on glass descendants)
export const rise = (delay = 0, distance = 24) => {
  const p = blurInRise(delay, distance);
  return { ...p, whileInView: { ...p.whileInView, transitionEnd: { filter: 'none' } } };
};
