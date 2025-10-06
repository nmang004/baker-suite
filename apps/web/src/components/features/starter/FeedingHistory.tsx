'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { type StarterFeeding } from '@/lib/api/starters';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useStarterFeedings, useDeleteFeeding } from '@/lib/hooks/useStarters';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface FeedingHistoryProps {
  starterId: string;
  limit?: number;
}

export function FeedingHistory({ starterId, limit = 20 }: FeedingHistoryProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFeedingId, setSelectedFeedingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data: feedings, isLoading } = useStarterFeedings(starterId, { page, limit });
  const deleteMutation = useDeleteFeeding();

  const handleDeleteClick = (feedingId: string) => {
    setSelectedFeedingId(feedingId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedFeedingId) return;

    try {
      await deleteMutation.mutateAsync({
        starterId,
        feedingId: selectedFeedingId,
      });
      toast.success('Feeding deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedFeedingId(null);
    } catch (error) {
      toast.error('Failed to delete feeding');
      console.error('Delete feeding error:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Feeding History</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!feedings || feedings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Feeding History</CardTitle>
          <CardDescription>No feedings recorded yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Log your first feeding to start tracking your starter's health.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Feeding History</CardTitle>
          <CardDescription>
            {feedings.length} feeding{feedings.length !== 1 ? 's' : ''} recorded
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Ratio</TableHead>
                  <TableHead>Rise Height</TableHead>
                  <TableHead>Observations</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedings.map((feeding) => (
                  <TableRow key={feeding.id}>
                    <TableCell className="font-medium">
                      {format(new Date(feeding.fedAt), 'MMM d, yyyy')}
                      <br />
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(feeding.fedAt), 'h:mm a')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {feeding.ratio}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {feeding.riseHeight ? (
                        <span>{feeding.riseHeight} cm</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {feeding.observations ? (
                        <span className="text-sm">{feeding.observations}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(feeding.id)}
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Feeding?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this feeding record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
