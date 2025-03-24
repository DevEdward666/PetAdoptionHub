import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchReports, updateReport } from '@/lib/adminApi';
import { AdminLayout } from '@/components/ui/admin-layout';
import { useToast } from '@/hooks/use-toast';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { Report } from "../../types/schema";
import { IonIcon } from '@ionic/react';
import { 
  eyeOutline, 
  closeOutline, 
  warningOutline, 
  locationOutline, 
  mailOutline, 
  personOutline
} from 'ionicons/icons';

export default function AdminReports() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'pending' | 'investigating' | 'resolved' | 'dismissed'>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  // Fetch all reports
  const { 
    data: reports = [], 
    isLoading: isLoadingReports 
  } = useQuery({
    queryKey: ['/api/admin/reports'],
    queryFn: fetchReports
  });

  // Update report mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Report> }) => 
      updateReport(id, data),
    onSuccess: () => {
      toast({
        title: 'Report Updated',
        description: 'The report has been updated successfully.'
      });
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reports'] });
      setShowDetailsDialog(false);
    },
    onError: () => {
      toast({
        title: 'Update Failed',
        description: 'Failed to update the report. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setAdminNotes(report.adminNotes || '');
    setShowDetailsDialog(true);
  };

  const handleStatusChange = (status: 'pending' | 'investigating' | 'resolved' | 'dismissed') => {
    if (selectedReport) {
      updateMutation.mutate({
        id: selectedReport.id,
        data: {
          status: status
        }
      });
    }
  };

  const handleSaveNotes = () => {
    if (selectedReport) {
      updateMutation.mutate({
        id: selectedReport.id,
        data: {
          adminNotes: adminNotes
        }
      });
    }
  };
  // Filter reports by status
  const filteredReports = reports.filter((report: Report) => {
    return filter === 'all' || report.status === filter;
  });

  return (
    <AdminLayout title="Cruelty Reports">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Cruelty Reports</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground mr-2">Filter:</span>
            <Select 
              value={filter} 
              onValueChange={(value: 'all' | 'pending' | 'investigating' | 'resolved' | 'dismissed') => setFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
            <CardDescription>
              Review and manage animal cruelty reports submitted by users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingReports ? (
              <div className="text-center p-4">Loading reports...</div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                No reports found matching your filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Anonymous</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report: Report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">#{report.id}</TableCell>
                        <TableCell className="capitalize">{report.type}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <IonIcon icon={locationOutline} className="w-4 h-4 mr-1 text-muted-foreground" />
                            <span className="truncate max-w-[180px]">{report.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {report.createdAt 
                            ? formatDistanceToNow(new Date(report.createdAt), { addSuffix: true }) 
                            : 'Unknown'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {report.anonymous ? (
                            <Badge variant="outline">Anonymous</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-50">Has Contact</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewDetails(report)}
                          >
                            <IonIcon icon={eyeOutline} className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Report Details Dialog */}
      {selectedReport && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <IonIcon icon={warningOutline} className="w-5 h-5 mr-2 text-red-500" />
                Report #{selectedReport.id} - {selectedReport.type}
              </DialogTitle>
              <DialogDescription>
                Submitted {selectedReport.createdAt
                  ? formatDistanceToNow(new Date(selectedReport.createdAt), { addSuffix: true })
                  : 'Unknown'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Report Details</h3>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="whitespace-pre-wrap">{selectedReport.description}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Location</h3>
                  <div className="flex items-start">
                    <IonIcon icon={locationOutline} className="w-5 h-5 mr-2 mt-0.5 text-muted-foreground" />
                    <p>{selectedReport.location}</p>
                  </div>
                </div>
                
                {!selectedReport.anonymous && selectedReport.contactInfo && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact Information</h3>
                    <div className="flex items-start">
                      <IonIcon icon={mailOutline} className="w-5 h-5 mr-2 mt-0.5 text-muted-foreground" />
                      <p>{selectedReport.contactInfo}</p>
                    </div>
                  </div>
                )}
                
                {selectedReport.anonymous && (
                  <div className="flex items-center p-2 bg-yellow-50 rounded-md">
                    <IonIcon icon={personOutline} className="w-5 h-5 mr-2 text-yellow-500" />
                    <p className="text-sm">This report was submitted anonymously</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Status</h3>
                  <Select 
                    defaultValue={selectedReport.status}
                    onValueChange={(value: 'pending' | 'investigating' | 'resolved' | 'dismissed') => handleStatusChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="investigating">Investigating</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="dismissed">Dismissed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Admin Notes</h3>
                  <Textarea 
                    placeholder="Add notes about this report and actions taken..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={8}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setShowDetailsDialog(false)}
              >
                <IonIcon icon={closeOutline} className="w-4 h-4 mr-1" />
                Close
              </Button>
              <Button 
                variant="default" 
                onClick={handleSaveNotes}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving..." : "Save Notes & Status"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
}