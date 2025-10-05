"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const tvkTaglines = [
  "#2026",
  "Enna Nanba, Enna Nanbe",
  "Enna Thozhla, Enna Thozhli",
  "Whats Bro, It's Very Wrong Bro",
  "I  repeat - Our Ideology Enemy BJP & Our Political Enemy DMK",
];

export function TaglineCarousel() {
  const autoplayRef = React.useRef(
    Autoplay({ delay: 1500, stopOnInteraction: true })
  );

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [carouselApi, setCarouselApi] = React.useState(null);

  React.useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setCurrentIndex(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", onSelect);
    onSelect();

    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  const isLong = tvkTaglines[currentIndex]?.length > 35;

  return (
    <div className="rounded-2xl shadow-lg w-full flex flex-col p-8 mt-8 space-y-10">
      <Carousel
        opts={{
          loop: true,
          align: isLong ? "center" : "start",
        }}
        plugins={[autoplayRef.current]}
        setApi={setCarouselApi}
        className="w-full"
        onMouseEnter={() => autoplayRef.current.stop()}
        onMouseLeave={() => autoplayRef.current.play()}
      >
        <CarouselContent>
          {tvkTaglines.map((tagline, index) => {
            const isLongItem = tagline.length > 35;
            return (
              <CarouselItem
                key={index}
                className={`flex items-center ${
                  isLongItem ? "basis-full justify-center" : "basis-auto px-8"
                }`}
              >
                <span
                  className="text-4xl md:text-2xl lg:text-5xl font-bold whitespace-nowrap text-center leading-snug pb-2"
                  style={{
                    WebkitTextStroke: "2px red",
                    color: "whitesmoke",
                  }}
                >
                  "{tagline}"
                </span>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
