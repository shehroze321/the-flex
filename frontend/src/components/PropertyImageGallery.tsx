import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Building2 } from 'lucide-react'

interface PropertyImageGalleryProps {
  images: string[]
  propertyName: string
  className?: string
}

export const PropertyImageGallery = ({ 
  images, 
  propertyName, 
  className 
}: PropertyImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  if (!images || images.length === 0) {
    return (
      <div className={`relative h-[600px] bg-gradient-to-br from-primary/40 via-primary/20 to-primary/10 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="flex-living-floating">
            <Building2 className="h-40 w-40 text-white/90 mx-auto mb-6" />
          </div>
          <p className="text-white/95 text-2xl font-semibold mb-2">Property Showcase</p>
          <p className="text-white/80 text-lg">Beautiful property images coming soon</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative h-[600px] overflow-hidden ${className}`}>
      <Image
        src={images[currentImageIndex]}
        alt={propertyName}
        fill
        className="object-cover"
        priority
      />
      
      {/* Navigation Controls */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white"
            onClick={goToPreviousImage}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white"
            onClick={goToNextImage}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <span
                key={index}
                className={`h-2 w-2 rounded-full bg-white ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-50'
                } cursor-pointer`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
