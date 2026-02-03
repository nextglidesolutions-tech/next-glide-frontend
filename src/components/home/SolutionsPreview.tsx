import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Monitor,
  Server,
  Users,
  Briefcase,
  Shield,
  Boxes,
  Settings,
  LayoutDashboard,
  TrendingUp,
  Lightbulb,
  Code,
  Rocket,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// 🔹 Static outside component (not recreated)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Mapping categories to icons
const iconMap: Record<string, any> = {
  ITSM: Monitor,
  ITOM: Server,
  CSM: Users,
  HRSD: Briefcase,
  GRC: Shield,
  ITAM: Boxes,
  'App Engine': Settings,
  Portal: LayoutDashboard,
  SPM: TrendingUp,
  Advisory: Lightbulb,
  Development: Code,
  Implementation: Rocket,
  Support: Users,
};

const DefaultIcon = Lightbulb;

export function SolutionsPreview() {
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchSolutions = async () => {
      try {
        setLoading(true);

        // ✅ Ask backend only for what UI needs
        const response = await fetch(
          `${API_URL}/api/solutions?limit=6`,
          { signal: controller.signal }
        );

        if (!response.ok) throw new Error('Fetch failed');

        const data = await response.json();
        setSolutions(data);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Failed to fetch solutions', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();

    // ✅ Cleanup on unmount
    return () => controller.abort();
  }, []);

  // 🔹 Memoized icon resolver
  const getIcon = useMemo(
    () => (solution: any) =>
      iconMap[solution.name] ||
      iconMap[solution.category] ||
      DefaultIcon,
    []
  );

  return (
    <section className="py-8 bg-white overflow-hidden">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-xs uppercase tracking-wider mb-3 border border-blue-200">
            Our Solutions
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Transform Your Enterprise
          </h2>
          <p className="text-gray-600">
            Comprehensive solutions to streamline workflow and boost productivity.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 max-w-7xl mx-auto">
          {loading ? (
            <div className="col-span-full flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : solutions.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-10">
              No solutions available at the moment.
            </div>
          ) : (
            solutions.map((solution) => {
              const Icon = getIcon(solution);

              return (
                <div
                  key={solution._id || solution.slug}
                  className="group bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 flex flex-col h-full"
                >
                  {/* Top */}
                  <div className="flex justify-between w-full mb-5">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-md text-[10px] uppercase font-bold bg-white text-gray-600 border">
                      {solution.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-700">
                    <Link to={`/solutions/${solution.slug}`}>
                      {solution.name}
                    </Link>
                  </h3>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-5">
                    {solution.shortDescription}
                  </p>

                  {solution.keyFeatures?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {solution.keyFeatures.slice(0, 3).map((f: string, i: number) => (
                        <span key={i} className="text-xs bg-white px-2.5 py-1 rounded-full border">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto pt-4 flex justify-end border-t">
                    <Link
                      to={`/solutions/${solution.slug}`}
                      className="inline-flex items-center px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 active:scale-95"
                    >
                      {solution.ctaText || 'Learn More'}
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
            <Link to="/solutions">
              View All Solutions
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
