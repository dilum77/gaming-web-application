import React from 'react';

const BACKGROUND_IMAGES = [
  '/images/bgs/1.png',
  '/images/bgs/2.png',
  '/images/bgs/3.png',
  '/images/bgs/4.png',
  '/images/bgs/5.png',
  '/images/bgs/6.png',
  '/images/bgs/7.png',
  '/images/bgs/8.png',
];

interface JungleLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
}

export const JungleLayout: React.FC<JungleLayoutProps> = ({ children, showHeader = false }) => {
  const [backgroundImage, setBackgroundImage] = React.useState<string>(BACKGROUND_IMAGES[0]);

  React.useEffect(() => {
    const randomIndex = Math.floor(Math.random() * BACKGROUND_IMAGES.length);
    setBackgroundImage(BACKGROUND_IMAGES[randomIndex]);
  }, []);

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background image */}
      <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
        <img
          src={backgroundImage}
          alt="Banana Beast background"
          className="w-full h-full object-cover opacity-60"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/60" />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
