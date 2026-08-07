import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'دفتر وکالت مجید سواری',
    short_name: 'مجید سواری',
    description: 'مشاوره و وکالت تخصصی در دعاوی ملکی، چک و خانواده در اهواز.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f2e6',
    theme_color: '#0c3f6e',
    lang: 'fa',
    dir: 'rtl',
    icons: [
      { src: '/icon', sizes: '32x32', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
