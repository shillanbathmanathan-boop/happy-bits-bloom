import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "@/components/StarRating";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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
  onReviewChanged: () => void;
}

const ReviewList = ({ pilotId, refreshKey, onReviewChanged }: ReviewListProps) => {
  const { user } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [saving, setSaving] = useState(false);

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

  const startEdit = (review: Review) => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditRating(0);
    setEditComment("");
  };

  const saveEdit = async (reviewId: string) => {
    if (editRating === 0) { toast.error("Please select a rating."); return; }
    setSaving(true);
    const { error } = await supabase
      .from("reviews")
      .update({ rating: editRating, comment: editComment.trim() || null })
      .eq("id", reviewId);
    setSaving(false);
    if (error) { toast.error("Failed to update review."); return; }
    toast.success("Review updated!");
    cancelEdit();
    onReviewChanged();
  };

  const deleteReview = async (reviewId: string) => {
    const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
    if (error) { toast.error("Failed to delete review."); return; }
    toast.success("Review deleted.");
    onReviewChanged();
  };

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading reviews...</p>;
  if (reviews.length === 0) return <p className="text-sm text-muted-foreground">No reviews yet.</p>;

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const isOwner = user?.id === review.user_id;
        const isEditing = editingId === review.id;

        return (
          <div key={review.id} className="rounded-lg border border-input p-4 space-y-2">
            {isEditing ? (
              <div className="space-y-3">
                <StarRating rating={editRating} onRate={setEditRating} interactive />
                <Textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  maxLength={500}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => saveEdit(review.id)} disabled={saving} className="gap-1">
                    <Check className="h-3.5 w-3.5" /> {saving ? "Saving..." : "Save"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={cancelEdit} className="gap-1">
                    <X className="h-3.5 w-3.5" /> Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <StarRating rating={review.rating} size="sm" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                    </span>
                    {isOwner && (
                      <div className="flex gap-1">
                        <button onClick={() => startEdit(review)} className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete review?</AlertDialogTitle>
                              <AlertDialogDescription>This will permanently remove your review.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteReview(review.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-foreground leading-relaxed">{review.comment}</p>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;
