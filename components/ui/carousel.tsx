import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface CarouselContextType {
  currentIndex: number;
  totalItems: number;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  orientation: 'horizontal' | 'vertical';
}

const CarouselContext = createContext<CarouselContextType | undefined>(
  undefined
);

function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('Carousel components must be used within a Carousel');
  }
  return context;
}

interface CarouselProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

function Carousel({
  children,
  orientation = 'horizontal',
  className,
  autoPlay = false,
  autoPlayInterval = 3000,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemCount = React.Children.count(children);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const canScrollPrev = currentIndex > 0;
  const canScrollNext = currentIndex < itemCount - 1;

  const scrollPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const scrollNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(itemCount - 1, prev + 1));
  }, [itemCount]);

  useEffect(() => {
    if (!autoPlay) return;

    autoPlayTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= itemCount - 1) {
          return 0;
        }
        return prev + 1;
      });
    }, autoPlayInterval);

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, itemCount]);

  return (
    <CarouselContext.Provider
      value={{
        currentIndex,
        totalItems: itemCount,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        orientation,
      }}
    >
      <div
        className={cn('relative', className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

interface CarouselContentProps {
  className?: string;
  children: React.ReactNode;
}

function CarouselContent({ className, children }: CarouselContentProps) {
  const { currentIndex, orientation } = useCarousel();

  return (
    <div
      className={cn('overflow-hidden', className)}
      data-slot="carousel-content"
    >
      <div
        className={cn(
          'flex transition-transform duration-300 ease-out',
          orientation === 'horizontal' ? 'flex-row' : 'flex-col'
        )}
        style={{
          transform:
            orientation === 'horizontal'
              ? `translateX(-${currentIndex * 100}%)`
              : `translateY(-${currentIndex * 100}%)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

interface CarouselItemProps {
  className?: string;
  children: React.ReactNode;
}

function CarouselItem({ className, children }: CarouselItemProps) {
  const { orientation } = useCarousel();

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn('min-w-0 shrink-0 grow-0 basis-full', className)}
    >
      {children}
    </div>
  );
}

interface CarouselPreviousProps {
  className?: string;
}

function CarouselPrevious({ className }: CarouselPreviousProps) {
  const { scrollPrev, canScrollPrev, orientation } = useCarousel();

  return (
    <Button
      data-slot="carousel-previous"
      variant="outline"
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      className={cn(
        'absolute size-10 rounded-full p-0 flex items-center justify-center',
        orientation === 'horizontal'
          ? 'top-1/2 left-2 -translate-y-1/2'
          : 'top-2 left-1/2 -translate-x-1/2 -rotate-90',
        className
      )}
      aria-label="Previous slide"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </Button>
  );
}

interface CarouselNextProps {
  className?: string;
}

function CarouselNext({ className }: CarouselNextProps) {
  const { scrollNext, canScrollNext, orientation } = useCarousel();

  return (
    <Button
      data-slot="carousel-next"
      variant="outline"
      onClick={scrollNext}
      disabled={!canScrollNext}
      className={cn(
        'absolute size-10 rounded-full p-0 flex items-center justify-center',
        orientation === 'horizontal'
          ? 'top-1/2 right-2 -translate-y-1/2'
          : 'bottom-2 left-1/2 -translate-x-1/2 rotate-90',
        className
      )}
      aria-label="Next slide"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </Button>
  );
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel,
};
