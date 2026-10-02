import { Badge } from 'react-bootstrap';
import { TYPE_COLORS, TYPE_LABELS } from '../utils/labels';

export default function TypeBadge({ type }) {
  return (
    <Badge pill bg="" className="type-badge" style={{ backgroundColor: TYPE_COLORS[type] ?? '#777' }}>
      {TYPE_LABELS[type] ?? type}
    </Badge>
  );
}
