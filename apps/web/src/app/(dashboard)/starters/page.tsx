'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StarterCard } from '@/components/features/starter/StarterCard';
import { useStarters } from '@/lib/hooks/useStarters';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FeedingLogger } from '@/components/features/starter/FeedingLogger';

export default function StartersPage() {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<'name' | 'createdDate' | 'lastFed' | 'health'>('lastFed');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [feedingDialogOpen, setFeedingDialogOpen] = useState(false);
  const [selectedStarterId, setSelectedStarterId] = useState<string | null>(null);

  const { data: starters, isLoading } = useStarters({
    sortBy,
    sortOrder,
  });

  const handleFeedNow = (starterId: string) => {
    setSelectedStarterId(starterId);
    setFeedingDialogOpen(true);
  };

  const selectedStarter = starters?.find(s => s.id === selectedStarterId);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Starters</h1>
          <p className="text-muted-foreground">
            Manage and track your sourdough starters
          </p>
        </div>
        <Link href="/starters/new">
          <Button>Add New Starter</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Sort by:</label>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lastFed">Last Fed</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="createdDate">Age</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Order:</label>
          <Select value={sortOrder} onValueChange={(value: any) => setSortOrder(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Starters Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading starters...</p>
        </div>
      ) : !starters || starters.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <h3 className="text-xl font-semibold">No starters yet</h3>
          <p className="text-muted-foreground">
            Create your first sourdough starter to get started
          </p>
          <Link href="/starters/new">
            <Button>Create Your First Starter</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {starters.map((starter) => (
            <StarterCard
              key={starter.id}
              starter={starter}
              onFeedNow={handleFeedNow}
            />
          ))}
        </div>
      )}

      {/* Feeding Dialog */}
      <Dialog open={feedingDialogOpen} onOpenChange={setFeedingDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Log Feeding</DialogTitle>
          </DialogHeader>
          {selectedStarter && (
            <FeedingLogger
              starter={selectedStarter}
              lastFeeding={selectedStarter.feedings?.[0]}
              onSuccess={() => setFeedingDialogOpen(false)}
              onCancel={() => setFeedingDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
