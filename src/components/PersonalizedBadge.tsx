'use client';

import { useState } from 'react';
import { generateBadge } from '@/ai/flows/personalized-badges';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Award, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function PersonalizedBadge({ clickCount }: { clickCount: number }) {
  const [badge, setBadge] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateBadge = async () => {
    setLoading(true);
    try {
      const result = await generateBadge({ clickRate: clickCount });
      setBadge(result.badgeDescription);
      toast({
        title: "Badge Generated!",
        description: "Your new personalized badge is ready.",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Could not generate badge. Please try again.",
        variant: "destructive",
      });
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-primary" />
          AI Badge Generator
        </CardTitle>
        <CardDescription>Create a unique badge based on your total clicks!</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 text-center">
        {badge ? (
          <div className="p-4 bg-secondary rounded-lg w-full">
            <Award className="mx-auto h-12 w-12 text-primary" />
            <p className="mt-2 font-semibold text-lg text-foreground">{badge}</p>
          </div>
        ) : (
          <div className="p-4 bg-secondary rounded-lg w-full">
             <p className="text-muted-foreground">Click the button below to generate your badge.</p>
          </div>
        )}
        <Button onClick={handleGenerateBadge} disabled={loading || clickCount === 0}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
             <Award className="mr-2 h-4 w-4" />
          )}
          {badge ? 'Generate New Badge' : 'Generate My Badge'}
        </Button>
      </CardContent>
    </Card>
  );
}
