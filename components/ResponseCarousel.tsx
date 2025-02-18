"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ResponseCard } from "./ResponseCard";
import { type Response } from "@/types";

interface ResponseCarouselProps {
  responses: Response[];
}

export function ResponseCarousel({ responses }: ResponseCarouselProps) {
  return (
    <Carousel className="w-full max-w-xl mx-auto">
      <CarouselContent>
        {responses.map((response, index) => (
          <CarouselItem key={response.id}>
            <ResponseCard
              {...response}
              index={index}
              total={responses.length}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
