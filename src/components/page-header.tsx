import React from 'react';

interface PageHeaderProps {
  title?: string;
  imageUrl?: string;
}

export function PageHeader({ title, imageUrl }: PageHeaderProps) {
  return (
    <div
      className="relative flex h-40 w-full items-center justify-center bg-gray-200 bg-cover bg-center"
      style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
    >
      {title && <h1 className="text-3xl font-bold text-white drop-shadow">{title}</h1>}
    </div>
  );
}
