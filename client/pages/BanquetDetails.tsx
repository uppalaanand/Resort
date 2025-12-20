
// import React, { useState, useEffect } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { api } from '../utils/api';
// import { Banquet, Review } from '../types';
// import { Star, CheckCircle, ArrowLeft, Calendar, Users, PartyPopper } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import { getImageUrl } from '../utils/images';

// const BanquetDetails = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { user } = useAuth();
  
//   const [banquet, setBanquet] = useState<Banquet | null>(null);
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeImage, setActiveImage] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!id) return;
//       try {
//         const data = await api.getBanquet(id);
//         setBanquet(data);
//         setActiveImage(data.images[0]);
        
//         const reviewsData = await api.getReviews('banquet', id);
//         setReviews(reviewsData);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id]);

//   if (loading) return <div className="pt-32 text-center text-vp-gold">Loading Details...</div>;
//   if (!banquet) return <div className="pt-32 text-center">Venue not found</div>;

//   return (
//     <div className="pt-20 bg-gray-50 min-h-screen animate-fadeIn">
//       {/* Header */}
//       <div className="bg-white shadow-sm py-4 sticky top-20 z-40">
//         <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
//           <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-vp-dark flex items-center gap-1 text-sm font-bold uppercase tracking-wide">
//             <ArrowLeft size={16} /> Back to Banquets
//           </button>
//           <Link to={`/book/banquet/${banquet._id}`} className="md:hidden bg-vp-gold text-vp-dark px-4 py-1 text-xs font-bold uppercase rounded">Request Proposal</Link>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
//           {/* Gallery */}
//           <div className="space-y-4">
//             <div className="h-[400px] overflow-hidden rounded-xl shadow-lg relative group">
//               <img src={getImageUrl(activeImage)} alt={banquet.name} className="w-full h-full object-cover transition-all duration-500" />
//               <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
//             </div>
//             <div className="grid grid-cols-4 gap-2">
//               {banquet.images.map((img, idx) => (
//                 <button 
//                   key={idx} 
//                   onClick={() => setActiveImage(img)}
//                   className={`h-24 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${activeImage === img ? 'border-vp-gold opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
//                 >
//                   <img src={getImageUrl(img)} alt="Thumbnail" className="w-full h-full object-cover" />
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Info */}
//           <div className="flex flex-col justify-center">
//             <div className="flex items-center gap-4 text-sm font-bold text-vp-gold uppercase tracking-widest mb-2">
//               <span className="bg-vp-dark px-3 py-1 text-white rounded">{banquet.supportedEvents[0]}</span>
//               <span className="flex items-center gap-1"><Star className="fill-current" size={14} /> {banquet.averageRating?.toFixed(1)} ({banquet.reviewCount} reviews)</span>
//             </div>
            
//             <h1 className="text-4xl md:text-5xl font-serif font-bold text-vp-dark mb-4 leading-tight">{banquet.name}</h1>
            
//             <p className="text-gray-600 leading-relaxed mb-8 text-lg font-light">
//               {banquet.description}
//             </p>

//             <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
//               <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
//                 <Users size={20} className="text-vp-gold"/>
//                 <span className="font-bold text-gray-700">Capacity: {banquet.capacity}</span>
//               </div>
//               <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
//                 <PartyPopper size={20} className="text-vp-gold"/>
//                 <span className="font-bold text-gray-700">Events: {banquet.supportedEvents.length}+ Types</span>
//               </div>
//             </div>

//             <Link 
//               to={`/book/banquet/${banquet._id}`} 
//               className="w-full bg-vp-dark text-white px-8 py-5 font-bold uppercase tracking-widest hover:bg-vp-gold hover:text-vp-dark transition-all shadow-xl rounded flex items-center justify-center gap-3 text-lg group"
//             >
//               <Calendar className="group-hover:scale-110 transition-transform"/> Request Proposal
//             </Link>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-gray-200">
//           {/* Amenities */}
//           <div className="md:col-span-1">
//             <h3 className="text-2xl font-serif font-bold text-vp-dark mb-6">Venue Amenities</h3>
//             <ul className="space-y-3">
//               {banquet.amenities.map((am, i) => (
//                 <li key={i} className="flex items-start gap-3 text-gray-600 group">
//                   <div className="bg-green-100 p-1 rounded-full mt-0.5"><CheckCircle size={12} className="text-green-600" /></div>
//                   <span className="group-hover:text-vp-dark transition-colors">{am}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Reviews */}
//           <div className="md:col-span-2">
//             <div className="flex justify-between items-end mb-6">
//                 <h3 className="text-2xl font-serif font-bold text-vp-dark">Client Reviews</h3>
//                 {user && <button className="text-sm text-vp-gold underline font-bold">Write a Review</button>}
//             </div>
            
//             {reviews.length > 0 ? (
//               <div className="grid gap-6">
//                 {reviews.map(rv => (
//                   <div key={rv._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//                     <div className="flex justify-between items-start mb-3">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
//                             {rv.user.name.charAt(0)}
//                         </div>
//                         <div>
//                             <h4 className="font-bold text-vp-dark text-sm">{rv.user.name}</h4>
//                             <span className="text-xs text-gray-400 block">{new Date(rv.createdAt).toLocaleDateString()}</span>
//                         </div>
//                       </div>
//                       <div className="flex text-vp-gold">
//                         {[...Array(5)].map((_, i) => (
//                           <Star key={i} size={14} className={i < rv.ratingStars ? "fill-current" : "text-gray-300"} />
//                         ))}
//                       </div>
//                     </div>
//                     {rv.verifiedStay && <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-green-100 inline-block mb-2">Verified Event</span>}
//                     <p className="text-gray-600 text-sm leading-relaxed">"{rv.comment}"</p>
//                     <div className="grid grid-cols-4 gap-2">
//                         {rv.photos.map((img, idx) => (
//                           <img src={getImageUrl(img)} alt="Thumbnail" className="w-full h-full object-cover" />
//                         ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="bg-gray-50 p-8 rounded-xl text-center border border-dashed border-gray-300">
//                 <p className="text-gray-500">No reviews yet. Be the first to review this venue.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BanquetDetails;



import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Banquet, Review } from '../types';
import { Star, CheckCircle, ArrowLeft, Calendar, Users, PartyPopper } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/images';

const BanquetDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [banquet, setBanquet] = useState<Banquet | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [ratingStars, setRatingStars] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<{ [key: string]: boolean }>({});



  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const data = await api.getBanquet(id);
        setBanquet(data);
        setActiveImage(data.images[0]);
        
        const reviewsData = await api.getReviews('banquet', id);
        setReviews(reviewsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmitReview = async () => {
  if (!ratingStars || !comment.trim()) {
    alert("Please provide rating and comment");
    return;
  }

  try {
    setSubmitting(true);

    await api.createReview({
      targetType: "banquet",
      targetId: banquet!._id,
      ratingStars,
      comment,
    });

    // refresh reviews
    const reviewsData = await api.getReviews("banquet", banquet!._id);
    setReviews(reviewsData);

    // reset form
    setRatingStars(0);
    setComment("");
    setShowReviewForm(false);
  } catch (error) {
    console.error(error);
    alert("Failed to submit review");
  } finally {
    setSubmitting(false);
  }
};

  const toggleReview = (id: string) => {
  setExpandedReviews(prev => ({
    ...prev,
    [id]: !prev[id],
  }));
};


  if (loading) return <div className="pt-32 text-center text-vp-gold">Loading Details...</div>;
  if (!banquet) return <div className="pt-32 text-center">Venue not found</div>;

  return (
    <div className="pt-20 bg-gray-50 min-h-screen animate-fadeIn">
      {/* Header */}
      <div className="bg-white shadow-sm py-4 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-vp-dark flex items-center gap-1 text-sm font-bold uppercase tracking-wide">
            <ArrowLeft size={16} /> Back to Banquets
          </button>
          <Link to={`/book/banquet/${banquet._id}`} className="md:hidden bg-vp-gold text-vp-dark px-4 py-1 text-xs font-bold uppercase rounded">Request Proposal</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="h-[400px] overflow-hidden rounded-xl shadow-lg relative group">
              <img src={getImageUrl(activeImage)} alt={banquet.name} className="w-full h-full object-cover transition-all duration-500" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {banquet.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(img)}
                  className={`h-24 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${activeImage === img ? 'border-vp-gold opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={getImageUrl(img)} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-4 text-sm font-bold text-vp-gold uppercase tracking-widest mb-2">
              <span className="bg-vp-dark px-3 py-1 text-white rounded">{banquet.supportedEvents[0]}</span>
              <span className="flex items-center gap-1"><Star className="fill-current" size={14} /> {banquet.averageRating?.toFixed(1)} ({banquet.reviewCount} reviews)</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-vp-dark mb-4 leading-tight">{banquet.name}</h1>
            
            <p className="text-gray-600 leading-relaxed mb-8 text-lg font-light">
              {banquet.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <Users size={20} className="text-vp-gold"/>
                <span className="font-bold text-gray-700">Capacity: {banquet.capacity}</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <PartyPopper size={20} className="text-vp-gold"/>
                <span className="font-bold text-gray-700">Events: {banquet.supportedEvents.length}+ Types</span>
              </div>
            </div>

            <Link 
              to={`/book/banquet/${banquet._id}`} 
              className="w-full bg-vp-dark text-white px-8 py-5 font-bold uppercase tracking-widest hover:bg-vp-gold hover:text-vp-dark transition-all shadow-xl rounded flex items-center justify-center gap-3 text-lg group"
            >
              <Calendar className="group-hover:scale-110 transition-transform"/> Request Proposal
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-gray-200">
          {/* Amenities */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-serif font-bold text-vp-dark mb-6">Venue Amenities</h3>
            <ul className="space-y-3">
              {banquet.amenities.map((am, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-600 group">
                  <div className="bg-green-100 p-1 rounded-full mt-0.5"><CheckCircle size={12} className="text-green-600" /></div>
                  <span className="group-hover:text-vp-dark transition-colors">{am}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Reviews */}
          <div className="md:col-span-2">
           
              {showReviewForm && (<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
    <h4 className="font-bold text-vp-dark mb-3">Write Your Review</h4>

    {/* Rating */}
    <div className="flex gap-2 mb-4 text-vp-gold">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={20}
          onClick={() => setRatingStars(star)}
          className={`cursor-pointer ${
            star <= ratingStars ? "fill-current" : "text-gray-300"
          }`}
        />
      ))}
    </div>

    {/* Comment */}
    <textarea
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      rows={4}
      placeholder="Share your experience..."
      className="w-full border border-gray-300 rounded-lg p-3 text-sm mb-4 focus:outline-none focus:ring-1 focus:ring-vp-gold"
    />

    {/* Actions */}
    <div className="flex gap-4">
      <button
        onClick={handleSubmitReview}
        disabled={submitting}
        className="bg-vp-gold text-vp-dark px-6 py-2 rounded font-bold text-sm uppercase tracking-wide"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>

      <button
        onClick={() => setShowReviewForm(false)}
        className="text-gray-500 underline text-sm"
      >
        Cancel
      </button>
    </div>
  </div>
)}
                 <div className="flex justify-between items-end mb-6">
                <h3 className="text-2xl font-serif font-bold text-vp-dark">Client Reviews</h3>
                {/* {user && <button className="text-sm text-vp-gold underline font-bold">Write a Review</button>} */}
                {user && ( <button onClick={() => setShowReviewForm(!showReviewForm)} className="text-sm text-vp-gold underline font-bold">
                  Write a Review
                  </button>)}
            </div>
            
            {reviews.length > 0 ? (
              <div className="grid gap-6">
                {reviews.map(rv => (
                  <div key={rv._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                            {rv.user.name.charAt(0)}
                        </div>
                        <div>
                            <h4 className="font-bold text-vp-dark text-sm">{rv.user.name}</h4>
                            <span className="text-xs text-gray-400 block">{new Date(rv.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex text-vp-gold">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < rv.ratingStars ? "fill-current" : "text-gray-300"} />
                        ))}
                      </div>
                    </div>
                    {rv.verifiedStay && <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-green-100 inline-block mb-2">Verified Event</span>}
                    {/* <p className="text-gray-600 text-sm leading-relaxed">"{rv.comment}"</p> */}
                    <p className="text-gray-600 text-sm leading-relaxed">
  "
  {expandedReviews[rv._id] || rv.comment.length <= 150
    ? rv.comment
    : `${rv.comment.slice(0, 150)}...`}
  "
</p>

{rv.comment.length > 150 && (
  <button
    onClick={() => toggleReview(rv._id)}
    className="text-vp-gold text-xs font-bold mt-1 underline"
  >
    {expandedReviews[rv._id] ? "Show less" : "Read more"}
  </button>
)}

                    <div className="grid grid-cols-4 gap-2">
                        {rv.photos.map((img, idx) => (
                          <img src={getImageUrl(img)} alt="Thumbnail" className="w-full h-full object-cover" />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-xl text-center border border-dashed border-gray-300">
                <p className="text-gray-500">No reviews yet. Be the first to review this venue.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BanquetDetails;