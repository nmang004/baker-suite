import { TimelineView } from '@/components/features/timeline/TimelineView';

interface TimelinePageProps {
  params: {
    id: string;
  };
}

export default function TimelinePage({ params }: TimelinePageProps) {
  return (
    <div className="py-6">
      <TimelineView timelineId={params.id} />
    </div>
  );
}
