import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DirectContentPageProps {
    title: string;
    subtitle: string;
    description?: string;
    benefits: string[];
}

export default function DirectContentPage({ title, subtitle, description, benefits }: DirectContentPageProps) {
    return (
        <Layout>
            {/* Hero Section */}
            <section className="pt-32 pb-20 hero-gradient relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
                    <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
                </div>
                <div className="container-custom relative z-10">
                    <div className="max-w-3xl">
                        <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
                            {subtitle}
                        </span>
                        <h1 className="heading-1 text-primary-foreground mb-6">
                            {title}
                        </h1>
                        {description && (
                            <p className="body-large text-primary-foreground/80">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="section-padding bg-background">
                <div className="container-custom">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="heading-3 text-foreground mb-6">Key Capabilities</h2>
                            <ul className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-accent/30 transition-colors shadow-sm">
                                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <CheckCircle2 className="w-5 h-5 text-accent" />
                                        </div>
                                        <span className="text-foreground font-medium">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-muted/30 rounded-2xl p-8 border border-border">
                            <h3 className="heading-4 text-foreground mb-4">Why Choose NextGlide?</h3>
                            <p className="text-muted-foreground mb-8">
                                Our experts ensure you get the most out of your investment with tailored implementation and support strategies.
                            </p>
                            <div className="flex flex-col gap-4">
                                <Button variant="accent" size="lg" asChild className="w-full">
                                    <Link to="/contact#contact-form">
                                        Get Started with {title}
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                                <Button variant="outline" size="lg" asChild className="w-full">
                                    <Link to="/contact#contact-form">
                                        Talk to an Expert
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
