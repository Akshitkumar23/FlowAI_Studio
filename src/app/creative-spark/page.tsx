
"use client";

import { useState } from "react";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { getCreativeSpark, expandCreativeSpark } from "@/ai/flows/creative-spark-flow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";

export default function CreativeSparkPage() {
  const [spark, setSpark] = useState("");
  const [expandedSpark, setExpandedSpark] = useState("");
  const [isLoadingSpark, setIsLoadingSpark] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);

  const handleGetSpark = async () => {
    setIsLoadingSpark(true);
    setSpark("");
    setExpandedSpark("");
    try {
      const result = await getCreativeSpark();
      setSpark(result.spark);
    } catch (error) {
      console.error("Error getting creative spark:", error);
    } finally {
      setIsLoadingSpark(false);
    }
  };

  const handleExpandSpark = async () => {
    if (!spark) return;
    setIsExpanding(true);
    setExpandedSpark("");
    try {
      const result = await expandCreativeSpark({ spark });
      setExpandedSpark(result.expandedSpark);
    } catch (error) {
      console.error("Error expanding creative spark:", error);
    } finally {
      setIsExpanding(false);
    }
  };

  return (
    <div className="min-h-full animated-gradient-bg">
    <div className="container py-8">
      <PageHeader
        title="Creative Spark"
        description="Get random creative ideas and expand them into detailed paragraphs to kickstart your work."
      />

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Button onClick={handleGetSpark} disabled={isLoadingSpark}>
            {isLoadingSpark ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Spark...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Get a New Creative Spark
              </>
            )}
          </Button>
        </div>

        {spark && (
          <Card className="glass mb-8 animate-fade-in">
            <CardHeader>
              <CardTitle>Your Creative Spark</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{spark}</p>
              <div className="mt-4">
                <Button onClick={handleExpandSpark} disabled={isExpanding || !spark}>
                  {isExpanding ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Expanding...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Expand this Spark
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isExpanding && (
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {expandedSpark && (
          <Card className="glass animate-fade-in-up">
            <CardHeader>
              <CardTitle>Expanded Idea</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{expandedSpark}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
    </div>
  );
}
