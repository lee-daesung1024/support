'use client';

import {useEffect, useState} from 'react';

export function LandingFixedCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector('[data-lp-hero]');
    if (!hero) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      {threshold: 0.08},
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={visible ? 'mobile-fixed is-visible' : 'mobile-fixed'} aria-hidden={!visible}>
      <a className="btn" href="#application-form" tabIndex={visible ? 0 : -1}>相談タイムを申し込む</a>
    </div>
  );
}
