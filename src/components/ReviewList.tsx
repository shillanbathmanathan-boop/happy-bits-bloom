import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import StarRating from "@/components/StarRating";
import { formatDistanceToNow } from "date-fns";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_id: string;
}

interface ReviewListProps {
  pilotId: string;
  refreshKey: number;
}

const ReviewList = ({ pilotId, refreshKey }: ReviewListProps) => {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", pilotId, refreshKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("pilot_id", pilotId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Review[];
    },
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading reviews...</p>;
  if (reviews.length === 0) return <p className="text-sm text-muted-foreground">No reviews yet.</p>;

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-lg border border-input p-4 space-y-2">
          <div className="flex items-center justify-between">
            <StarRating rating={review.rating} size="sm" />
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
            </span>
          </div>
          {review.comment && (
            <p className="text-sm text-foreground leading-relaxed">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
