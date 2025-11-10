import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Flame, Tv, CheckCircle2, Play } from 'lucide-react';
import { api, DonghuaCard as DonghuaCardType } from '@/lib/api';
import { DonghuaCard } from '@/components/DonghuaCard';
import { LoadingGrid } from '@/components/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

export default function Home() {
  const [latestRelease, setLatestRelease] = useState<DonghuaCardType[]>([]);
  const [ongoing, setOngoing] = useState<DonghuaCardType[]>([]);
  const [completed, setCompleted] = useState<DonghuaCardType[]>([]);
  const [popularSlider, setPopularSlider] = useState<DonghuaCardType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [homeData, ongoingData, completedData] = await Promise.all([
          api.getHome(1),
          api.getOngoing(1),
          api.getCompleted(1),
        ]);

        setLatestRelease(homeData.latest_release?.slice(0, 12) || []);
        setOngoing(ongoingData.ongoing_donghua?.slice(0, 8) || []);
        setCompleted(completedData.completed_donghua?.slice(0, 8) || []);
        setPopularSlider(completedData.completed_donghua?.slice(0, 5) || []);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Popular Slider Section */}
      <section className="relative w-full overflow-hidden">
        {loading ? (
          <div className="relative h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-primary animate-pulse" />
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 5000,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {popularSlider.map((donghua, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0">
                      <img
                        src={donghua.poster}
                        alt={donghua.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative h-full container mx-auto px-4 flex items-center">
                      <div className="max-w-2xl space-y-4 md:space-y-6 animate-fade-in">
                        <div className="inline-block px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30">
                          <span className="text-sm md:text-base font-semibold text-primary-foreground">
                            Popular Donghua
                          </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                          {donghua.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 text-sm md:text-base text-muted-foreground">
                          {donghua.status && (
                            <span className="px-3 py-1 rounded-full bg-card/50 backdrop-blur-sm border border-border">
                              {donghua.status}
                            </span>
                          )}
                          {donghua.rating && (
                            <span className="px-3 py-1 rounded-full bg-card/50 backdrop-blur-sm border border-border flex items-center gap-1">
                              ⭐ {donghua.rating}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <Link to={`/episode/${donghua.slug}-episode-1-subtitle-indonesia`}>
                            <Button size="lg" className="gap-2 text-base md:text-lg px-6 md:px-8 py-5 md:py-6 shadow-hover hover:scale-105 transition-all">
                              <Play className="h-5 w-5 md:h-6 md:w-6" fill="currentColor" />
                              Watch Now
                            </Button>
                          </Link>
                          <Link to={`/detail/${donghua.slug}`}>
                            <Button size="lg" variant="outline" className="gap-2 text-base md:text-lg px-6 md:px-8 py-5 md:py-6 shadow-hover hover:scale-105 transition-all">
                              More Info
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute bottom-8 right-8 flex gap-2">
              <CarouselPrevious className="relative inset-0 translate-x-0 translate-y-0 bg-card/80 backdrop-blur-sm border-border hover:bg-card shadow-lg" />
              <CarouselNext className="relative inset-0 translate-x-0 translate-y-0 bg-card/80 backdrop-blur-sm border-border hover:bg-card shadow-lg" />
            </div>
          </Carousel>
        )}
      </section>

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Latest Release */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-500/10">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Latest Release</h2>
            </div>
          </div>
          {loading ? (
            <LoadingGrid count={12} />
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {latestRelease.map((donghua, index) => (
                <DonghuaCard key={index} donghua={donghua} />
              ))}
            </div>
          )}
        </section>

        {/* Ongoing */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10">
                <Tv className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Ongoing Donghua</h2>
            </div>
            <Link to="/ongoing">
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          {loading ? (
            <LoadingGrid count={8} />
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {ongoing.map((donghua, index) => (
                <DonghuaCard key={index} donghua={donghua} />
              ))}
            </div>
          )}
        </section>

        {/* Completed */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/10">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Completed Donghua</h2>
            </div>
            <Link to="/completed">
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          {loading ? (
            <LoadingGrid count={8} />
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {completed.map((donghua, index) => (
                <DonghuaCard key={index} donghua={donghua} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
