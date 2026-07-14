'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className="bg-card border border-sand rounded-sm overflow-hidden">
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-right"
              aria-expanded={isOpen}
            >
              <span className="font-bold text-charcoal">{item.q}</span>
              {isOpen ? (
                <Minus size={18} className="text-gold shrink-0" aria-hidden="true" />
              ) : (
                <Plus size={18} className="text-gold shrink-0" aria-hidden="true" />
              )}
            </button>
            {isOpen && (
              <div className="px-6 pb-5">
                <p className="text-sm text-muted leading-7">{item.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
