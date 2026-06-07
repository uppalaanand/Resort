import React, { useEffect, useState } from "react";
import { Trash2, Star } from "lucide-react";
import { api } from "@/utils/api";
import { getImageUrl } from "@/utils/images";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

interface Review {
  _id: string;
  user: {
    name: string;
  };
  targetType: "room" | "banquet";
  ratingStars: number;
  comment: string;
  photos?: string[];
  createdAt: string;
  room?: any;
  banquetHall?: any;
}

const ListReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<{ [key: string]: boolean }>({});


  const fetchReviews = async () => {
  try {
    const data = await api.getAllReviews(); // admin reviews API
    setReviews(data);
  } catch (error) {
    console.error("Failed to fetch reviews", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async () => {
  try {
    await api.deleteReview(deletingId); // DELETE /api/reviews/:id
    setDeleteOpen(false);
    setReviews((prev) => prev.filter((r) => r._id !== deletingId));
  } catch (error) {
    console.error(error);
    alert("Failed to delete review");
  }
};

    const toggleReview = (id: string) => {
        setExpandedReviews(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };


  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto animate-admin-fadeIn">
        <div className="h-8 w-56 rounded skeleton-pulse mb-6" />
        <div className="grid gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-admin-card rounded-xl border border-admin-border/50 p-5">
              <div className="flex justify-between items-center mb-3">
                <div className="space-y-2">
                  <div className="h-5 w-32 rounded skeleton-pulse" />
                  <div className="h-3 w-40 rounded skeleton-pulse" />
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="h-4 w-4 rounded skeleton-pulse" />
                  ))}
                </div>
              </div>
              <div className="h-3 w-full rounded skeleton-pulse mb-2" />
              <div className="h-3 w-3/4 rounded skeleton-pulse mb-3" />
              <div className="h-3 w-28 rounded skeleton-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto animate-admin-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-admin-heading">Manage Reviews</h1>
        <p className="text-admin-text text-sm mt-1">Monitor and manage guest feedback</p>
      </div>

      {reviews.length === 0 ? (
        <p className="text-admin-text">No reviews found</p>
      ) : (
        <div className="grid gap-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-admin-card rounded-xl border border-admin-border/50 p-5 relative"
            >
              {/* Delete Button */}
              <button
                onClick={() => {setDeletingId(review._id)
                    setDeleteOpen(true)
                }}
                disabled={deletingId === review._id}
                className="absolute top-4 right-4 text-admin-text/40 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10"
              >
                <Trash2 size={20} />
              </button>

              {/* Header */}
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h2 className="text-admin-heading font-semibold text-lg">
                    {review.user?.name}
                  </h2>
                  <p className="text-admin-text text-xs">
                    {review.targetType === "room"
                      ? `Room: ${review.room?.name}`
                      : `Banquet: ${review.banquetHall?.name}`}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < review.ratingStars
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-admin-border"
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Comment */}
              {/* <p className="text-gray-700 leading-relaxed mb-4">
                {review.comment}
              </p> */}
                <p className="text-admin-text text-sm leading-relaxed">
                    "
                    {expandedReviews[review._id] || review.comment.length <= 150
                        ? review.comment
                        : `${review.comment.slice(0, 150)}...`}
                    "
                </p>

                    {review.comment.length > 150 && (
                    <button
                        onClick={() => toggleReview(review._id)}
                        className="text-vp-gold hover:text-amber-400 text-xs font-bold mt-1 underline transition-colors"
                    >
                        {expandedReviews[review._id] ? "Show less" : "Read more"}
                    </button>
                    )}


              {/* Photos */}
              {/* {review.photos?.length > 0 && (
                <div className="flex gap-3 flex-wrap mb-3">
                  {review.photos.map((photo, idx) => (
                    <img
                      key={idx}
                      src={getImageUrl(photo)}
                      alt="review"
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                  ))}
                </div>
              )} */}

              {/* Footer */}
              <div className="text-xs text-admin-text/60 mt-3">
                Posted on {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDeleteModal open={deleteOpen} 
        title="Delete Room"
        description={`Are you sure you want to delete this Review? This action cannot be undone.`}
        onConfirm={handleDeleteReview}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
};

export default ListReviews;