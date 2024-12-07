import React, { useEffect, useRef, useState } from 'react';

import { GridItemContainer } from '../Grid.styled';
import { GridImage } from '../types';

interface GridItemProps {
  image: GridImage;
}

const GridItem: React.FC<GridItemProps> = ({ image }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }, // Adjust threshold as needed
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => {
      if (itemRef.current) {
        observer.unobserve(itemRef.current);
      }
    };
  }, []);

  return (
    <GridItemContainer
      width={image.scaledWidth}
      height={image.scaledHeight}
      isVisible={isVisible}
      ref={itemRef}
    >
      {isVisible && (
        <img
          src={image.src.large}
          alt={image.alt || 'Photo'}
          style={{}}
          loading="lazy"
        />
      )}
    </GridItemContainer>
  );
};

export default GridItem;
