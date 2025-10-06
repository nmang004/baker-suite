import { BakeDetail } from '@/components/features/bake/BakeDetail';

interface BakeDetailPageProps {
  params: {
    id: string;
  };
}

export default function BakeDetailPage({ params }: BakeDetailPageProps) {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <BakeDetail bakeId={params.id} />
    </div>
  );
}
