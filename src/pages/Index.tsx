import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { SolutionsPreview } from '@/components/home/SolutionsPreview';
import { IndustriesPreview } from '@/components/home/IndustriesPreview';
import { CTASection } from '@/components/home/CTASection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ServicesPreview />
      <SolutionsPreview />
      <IndustriesPreview />
      <CTASection />
    </Layout>
  );
};

export default Index;
