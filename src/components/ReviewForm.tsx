import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "@/components/StarRating";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface ReviewFormProps {
  pilotId: string;
  onReviewSubmitted: () => void;
}

const ReviewForm = ({ pilotId, onReviewSubmitted }: ReviewFormProps) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="rounded-lg border border-input bg-muted/30 p-4 text-center">
        <p className="text-sm text-muted-foreground">
          <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link> to leave a review.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      pilot_id: pilotId,
      user_id: user.id,
      rating,
      comment: comment.trim() || null,
    });

    setSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        toast.error("You've already reviewed this pilot.");
      } else {
        toast.error("Failed to submit review.");
      }
      return;
    }

    toast.success("Review submitted!");
    setRating(0);
    setComment("");
    onReviewSubmitted();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-input p-4">
      <p className="text-sm font-medium">Leave a Review</p>
      <StarRating rating={rating} onRate={setRating} interactive />
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience (optional)"
        maxLength={500}
        rows={3}
      />
      <Button type="submit" size="sm" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
};

export default ReviewForm;
