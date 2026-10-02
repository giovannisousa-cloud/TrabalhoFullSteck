import { ProgressBar } from 'react-bootstrap';
import { STAT_LABELS } from '../utils/labels';

const MAX_BASE_STAT = 255;

function variantFor(value) {
  if (value >= 100) return 'success';
  if (value >= 60) return 'warning';
  return 'danger';
}

export default function StatBar({ name, value }) {
  return (
    <div className="stat d-flex align-items-center gap-2 mb-2">
      <span className="stat__label text-body-secondary small">{STAT_LABELS[name] ?? name}</span>
      <span className="stat__value fw-bold text-end">{value}</span>
      <ProgressBar
        className="flex-grow-1"
        now={value}
        max={MAX_BASE_STAT}
        variant={variantFor(value)}
        aria-label={STAT_LABELS[name] ?? name}
      />
    </div>
  );
}
