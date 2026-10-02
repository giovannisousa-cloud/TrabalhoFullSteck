import { Pagination as BsPagination } from 'react-bootstrap';

const WINDOW = 2;

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const start = Math.max(1, page - WINDOW);
  const end = Math.min(totalPages, page + WINDOW);
  const pages = [];
  for (let number = start; number <= end; number += 1) pages.push(number);

  return (
    <BsPagination className="justify-content-center mt-4 flex-wrap">
      <BsPagination.First onClick={() => onChange(1)} disabled={page <= 1} />
      <BsPagination.Prev onClick={() => onChange(page - 1)} disabled={page <= 1} />
      {start > 1 && <BsPagination.Ellipsis disabled />}
      {pages.map((number) => (
        <BsPagination.Item key={number} active={number === page} onClick={() => onChange(number)}>
          {number}
        </BsPagination.Item>
      ))}
      {end < totalPages && <BsPagination.Ellipsis disabled />}
      <BsPagination.Next onClick={() => onChange(page + 1)} disabled={page >= totalPages} />
      <BsPagination.Last onClick={() => onChange(totalPages)} disabled={page >= totalPages} />
    </BsPagination>
  );
}
