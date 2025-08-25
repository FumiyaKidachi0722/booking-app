import React from 'react';

import { HEADER_HEIGHT, PAGE_HEADER_HEIGHT } from '@/lib/constants';

interface PageHeaderProps {
  title?: string;
  imageUrl?: string;
}

export function PageHeader({ title, imageUrl }: PageHeaderProps) {
  return (
    <div
      className="relative flex w-full items-center justify-center bg-gray-200 bg-cover bg-center"
      style={{
        backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
        height: PAGE_HEADER_HEIGHT,
        marginTop: -HEADER_HEIGHT,
        paddingTop: HEADER_HEIGHT,
      }}
    >
      {title && <h1 className="text-3xl font-bold text-white drop-shadow">{title}</h1>}
    </div>
  );
}
