'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MilestoneItem } from '../action/getMilestonesReportData';
import { CheckCircle, Clock, ShoppingCart, Users, TrendingUp, Award } from 'lucide-react'; // Example icons

interface MilestonesReportClientProps {
  milestones: MilestoneItem[];
  error?: string;
}

// Helper to get a relevant Lucide icon based on milestone title keywords
const getMilestoneIcon = (title: string, iconString?: string) => {
  if (iconString) { // If an emoji/string icon is provided
    return <span className="text-2xl mr-2 rtl:mr-0 rtl:ml-2">{iconString}</span>;
  }
  if (title.includes('طلب')) return <ShoppingCart size={24} className="mr-2 rtl:mr-0 rtl:ml-2 text-primary" />;
  if (title.includes('عميل')) return <Users size={24} className="mr-2 rtl:mr-0 rtl:ml-2 text-primary" />;
  if (title.includes('مبيعات')) return <TrendingUp size={24} className="mr-2 rtl:mr-0 rtl:ml-2 text-primary" />;
  return <Award size={24} className="mr-2 rtl:mr-0 rtl:ml-2 text-primary" />; // Default
};

export default function MilestonesReportClient({
  milestones,
  error,
}: MilestonesReportClientProps) {
  if (error) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-destructive-foreground">{error}</CardContent>
      </Card>
    );
  }

  if (!milestones || milestones.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          لا توجد إنجازات أو أهداف لعرضها حاليًا.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {milestones.map((milestone, index) => (
        <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3 pt-4 px-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              {getMilestoneIcon(milestone.title, milestone.icon)}
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-card-foreground">{milestone.title}</CardTitle>
              {milestone.date && (
                <p className="text-xs text-muted-foreground">
                  {new Date(milestone.date).toLocaleDateString('ar-EG', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              )}
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-sm text-muted-foreground">{milestone.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
