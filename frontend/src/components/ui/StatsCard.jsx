import { motion } from 'framer-motion';
import AnimatedCounter from '../animation/AnimatedCounter';
import GlassCard from './GlassCard';

const colorMap = {
  indigo: 'from-indigo-500 to-cyan-500',
  emerald: 'from-emerald-500 to-teal-500',
  amber: 'from-amber-400 to-orange-500',
  rose: 'from-rose-500 to-pink-500',
  violet: 'from-violet-500 to-fuchsia-500',
  cyan: 'from-cyan-500 to-sky-500',
};

const StatsCard = ({ icon, label, value, color = 'indigo', trend, suffix = '', decimals = 0 }) => {
  const numericValue = typeof value === 'number' ? value : Number(String(value).replace(/[^\d.]/g, ''));
  const canAnimate = Number.isFinite(numericValue);

  return (
    <GlassCard hover className="min-h-[132px]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-medium text-[var(--text-muted)]">{label}</p>
          <p className="text-3xl font-bold text-[var(--text-primary)]">
            {canAnimate ? <AnimatedCounter value={numericValue} suffix={suffix || (String(value).includes('%') ? '%' : '')} decimals={decimals || (String(value).includes('.') ? 1 : 0)} /> : value}
          </p>
          {trend !== undefined && (
            <p className={`mt-2 text-xs font-medium ${trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {trend > 0 ? 'Up' : 'Down'} {Math.abs(trend)}%
            </p>
          )}
        </div>
        <motion.div
          whileHover={{ rotate: 5, scale: 1.08 }}
          className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${colorMap[color]} text-white shadow-lg`}
        >
          {icon}
        </motion.div>
      </div>
    </GlassCard>
  );
};

export default StatsCard;
