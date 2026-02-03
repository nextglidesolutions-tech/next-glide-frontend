import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Lightbulb,
  Code,
  Brain,
  Rocket,
  Link2,
  Headphones,
  Globe,
  GraduationCap,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// 🔹 Static API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// 🔹 Icon mapping (static)
const iconMap: Record<string, any> = {
  Advisory: Lightbulb,
  Development: Code,
  AI: Brain,
  Implementation: Rocket,
  Integration: Link2,
  Support: Headphones,
  Remote: Globe,
  Training: GraduationCap,
};

const DefaultIcon = Lightbulb;

export function ServicesPreview() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchServices = async () => {
      try {
        setLoading(true);

        // ✅ Ask backend only for preview items
        const response = await fetch(
          `${API_URL}/api/services?limit=6`,
          { signal: controller.signal }
        );

        if (!response.ok) throw new Error('Fetch failed');

        const data = await response.json();
        setServices(data);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Failed to fetch services', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServices();

    // ✅ Cleanup on unmount
    return () => controller.abort();
  }, []);

  // 🔹 Memoized icon resolver
  const getIcon = useMemo(
    () => (service: any) =>
      iconMap[service.category] || DefaultIcon,
    []
  );

  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-wider mb-3 border border-blue-100">
            Our Services
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ServiceNow Expertise
          </h2>
          <p className="text-gray-600">
            End-to-end services to maximize your ServiceNow investment.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 max-w-7xl mx-auto">
          {loading ? (
            <div className="col-span-full flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : services.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-10">
              No services available at the moment.
            </div>
          ) : (
            services.map((service) => {
              const Icon = getIcon(service);

              const tags =
                service.technologies?.length > 0
                  ? service.technologies
                  : service.keyFeatures || [];

              return (
                <div
                  key={service._id || service.slug}
                  className="group bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 flex flex-col h-full"
                >
                  {/* Top */}
                  <div className="flex justify-between w-full mb-5">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-md text-[10px] uppercase font-bold bg-gray-50 text-gray-600 border">
                      {service.category}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-700">
                    <Link to={`/services/${service.slug}`}>
                      {service.name}
                    </Link>
                  </h3>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-5">
                    {service.shortDescription}
                  </p>

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {tags.slice(0, 3).map((item: string, i: number) => (
                        <span
                          key={i}
                          className="text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* CTA */}
                  <div className="mt-auto pt-4 flex justify-end border-t border-gray-50">
                    <Link
                      to={`/services/${service.slug}`}
                      className="inline-flex items-center px-5 py-2.5 rounded-xl border-2 border-green-500 text-green-600 font-bold text-sm hover:bg-green-50 transition active:scale-95"
                    >
                      {service.ctaText || 'Read More'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/services">
              View All Services
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
