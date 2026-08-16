import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'دفتر وکالت مجید سواری',
    short_name: 'مجید سواری',
    description: 'مشاوره حقوقی آنلاین سراسر ایران و خدمات حضوری مجید سواری در اهواز.',
    start_url: '/',
    display: 'standalone',
    background_color: '#e3f2fd',
    theme_color: '#0c3f6e',
    lang: 'fa',
    dir: 'rtl',
    icons: [
      { src: '/icon', sizes: '32x32', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
