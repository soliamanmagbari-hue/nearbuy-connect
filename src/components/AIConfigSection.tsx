import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Bot, Save } from "lucide-react";

interface AIConfigSectionProps {
  businessId: string;
}

export function AIConfigSection({ businessId }: AIConfigSectionProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAIContent();
  }, [businessId]);

  const fetchAIContent = async () => {
    try {
      const { data, error } = await supabase
        .from('business_ai_content')
        .select('content')
        .eq('business_id', businessId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setContent(data.content);
      }
    } catch (error) {
      console.error('Error fetching AI content:', error);
      toast.error("Failed to load AI configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error("Please add some content for the AI");
      return;
    }

    setSaving(true);
    try {
      const { data: existing } = await supabase
        .from('business_ai_content')
        .select('id')
        .eq('business_id', businessId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('business_ai_content')
          .update({ content })
          .eq('business_id', businessId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('business_ai_content')
          .insert({ business_id: businessId, content });

        if (error) throw error;
      }

      toast.success("AI configuration saved successfully!");
    } catch (error) {
      console.error('Error saving AI content:', error);
      toast.error("Failed to save AI configuration");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card className="p-6 bg-card-gradient">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">AI Assistant Configuration</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Add information about your business that the AI will use to answer customer questions. 
        Include details about products, services, hours, policies, etc.
      </p>

      <Textarea
        placeholder="Example: We offer coffee and pastries. We're open 7am-9pm daily. We have WiFi and accept all major credit cards. Our specialty is Arabic coffee..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[200px] mb-4"
      />

      <Button onClick={handleSave} disabled={saving}>
        <Save className="h-4 w-4 mr-2" />
        {saving ? "Saving..." : "Save AI Configuration"}
      </Button>
    </Card>
  );
}