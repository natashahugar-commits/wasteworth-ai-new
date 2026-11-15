import React from 'react';
import {
  Box,
  Newspaper,
  Milk,
  Container,
  Cylinder,
  Anvil,
} from 'lucide-react';
import type { MaterialCategory } from '../types/waste';

export function MaterialIcon({
  material,
  className = 'w-5 h-5',
}: {
  material: MaterialCategory;
  className?: string;
}) {
  switch (material) {
    case 'Cardboard':
      return <Box className={className} aria-hidden="true" />;
    case 'Newspaper':
      return <Newspaper className={className} aria-hidden="true" />;
    case 'PET beverage bottles':
      return <Milk className={className} aria-hidden="true" />;
    case 'HDPE plastic':
      return <Container className={className} aria-hidden="true" />;
    case 'Aluminium cans':
      return <Cylinder className={className} aria-hidden="true" />;
    case 'Iron and steel':
      return <Anvil className={className} aria-hidden="true" />;
  }
}

export function formatShortDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function formatDateTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
