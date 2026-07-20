import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Deliberately text-free: Satori (which ImageResponse uses) doesn't reliably
// shape Arabic/Persian script without an explicitly embedded font, so this
// sticks to the same safe geometric seal mark as the favicon. Social platforms
// already render the page title/description as separate text next to this image.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0c3f6e',
        }}
      >
        <div
          style={{
            width: 220,
            height: 220,
            borderRadius: '50%',
            border: '14px solid #b08d45',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: 76, height: 76, borderRadius: '50%', background: '#b08d45', display: 'flex' }} />
        </div>
      </div>
    ),
    { ...size }
  );
}

