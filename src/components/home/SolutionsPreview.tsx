import { useEffect, useState } from 'react';
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

// Mapping categories to icons for Solutions
const iconMap: Record<string, any> = {
  'ITSM': Monitor,
  'ITOM': Server,
  'CSM': Users,
  'HRSD': Briefcase,
  'GRC': Shield,
  'ITAM': Boxes,
  'App Engine': Settings,
  'Portal': LayoutDashboard,
  'SPM': TrendingUp,
  'Advisory': Lightbulb,
  'Development': Code,
  'Implementation': Rocket,
  'Support': Users,
};

const DefaultIcon = Lightbulb;

export function SolutionsPreview() {
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        const response = await fetch(`${apiUrl}/api/solutions`);
        if (response.ok) {
          const data = await response.json();
          setSolutions(data);
        }
      } catch (error) {
        console.error('Failed to fetch solutions', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, []);

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-7xl mx-auto">
          {loading ? (
            <div className="col-span-full flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : solutions.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-10">
              No solutions available at the moment.
            </div>
          ) : (
            solutions.slice(0, 6).map((solution) => {
              const Icon = iconMap[solution.name] || iconMap[solution.category] || DefaultIcon;

              return (
                <div
                  key={solution._id || solution.slug}
                  className="group bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 flex flex-col items-start h-full"
                >
                  {/* Top Row: Icon & Category */}
                  <div className="flex items-start justify-between w-full mb-5">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="inline-block px-2.5 py-1 rounded-md text-[10px] uppercase font-bold bg-white text-gray-600 tracking-wider border border-gray-100">
                      {solution.category}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                    <Link to={`/solutions/${solution.slug}`}>
                      {solution.name}
                    </Link>
                  </h3>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-5">
                    {solution.shortDescription}
                  </p>

                  {/* Features */}
                  {(solution.keyFeatures?.length > 0) && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {solution.keyFeatures.slice(0, 3).map((item: string, i: number) => (
                        <span key={i} className="text-xs text-gray-500 bg-white px-2.5 py-1 rounded-full border border-gray-100">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer (Price & Button) */}
                  <div className="mt-auto w-full pt-4 flex items-center justify-end border-t border-gray-200">

                    <Link
                      to={`/solutions/${solution.slug}`}
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm tracking-wide hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 active:scale-95"
                    >
                      {solution.ctaText || 'Learn More'} <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50" asChild>
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
