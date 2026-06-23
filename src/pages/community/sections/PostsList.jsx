import React, { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ChevronDown, MessageSquare, Send, ThumbsUp, Loader2 } from "lucide-react";
import { ROUTES } from "../../../config";
import { selectUser, selectIsAuthenticated } from "../../../features/slices/authSlice";
import { useGetCommentsQuery, useCreateCommentMutation, useToggleLikePostMutation } from "../../../features/api/postApi";

const PostCommentSection = ({ postId, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { data: commentsData, isLoading } = useGetCommentsQuery(postId);
  const [createComment, { isLoading: isSubmitting }] = useCreateCommentMutation();
  const [commentText, setCommentText] = useState("");

  const comments = commentsData?.comments || [];

  const handleSendComment = async () => {
    if (!isAuthenticated) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to comment.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#22c55e",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "Login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(ROUTES.LOGIN);
        }
      });
      return;
    }
    if (!commentText.trim()) return;
    try {
      await createComment({ postId, content: commentText.trim() }).unwrap();
      setCommentText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  return (
    <div className="mt-6 rounded-lg border border-gray-100 bg-[#FAFAFA] p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-lg sm:text-xl font-semibold text-[#1B1B1B]">
          {t("community.posts.replyPanelTitle")}
        </h4>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          {t("community.posts.close")}
          <ChevronDown size={16} className="rotate-180" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="animate-spin h-6 w-6 text-green-500/60" />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-md bg-white px-4 py-3 border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="block text-xs font-semibold text-gray-800">
                  {comment.user?.name || "Anonymous"}
                </span>
                <span className="text-[10px] text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-gray-700">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center py-2">
          No comments yet. Be the first to reply!
        </p>
      )}

      <div className="mt-4 flex items-center gap-3 rounded-lg bg-white border border-gray-100 p-3">
        <input
          type="text"
          placeholder={t("community.posts.writeReplyPlaceholder")}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
          className="w-full bg-transparent text-sm sm:text-base text-gray-700 placeholder:text-gray-400 outline-none"
        />
        <button
          type="button"
          onClick={handleSendComment}
          disabled={isSubmitting || !commentText.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-green-500/60 text-white transition-colors disabled:opacity-50"
          aria-label={t("community.posts.sendReplyAria")}
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin h-4 w-4 text-white" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
    </div>
  );
};

const PostsList = memo(({ posts }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openReplyIndex, setOpenReplyIndex] = useState(null);
  const currentUser = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [toggleLikePost] = useToggleLikePostMutation();

  const toggleReplies = (index) => {
    if (!isAuthenticated) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to see comments.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#22c55e",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "Login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(ROUTES.LOGIN);
        }
      });
      return;
    }
    setOpenReplyIndex((currentIndex) =>
      currentIndex === index ? null : index,
    );
  };

  const handleLike = async (postId) => {
    if (!isAuthenticated) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to like this post.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#22c55e",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "Login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(ROUTES.LOGIN);
        }
      });
      return;
    }
    try {
      await toggleLikePost(postId).unwrap();
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  return (
    <div className="space-y-4">
      {posts.map((post, idx) => {
        const isLikedByMe = post.likes?.some(
          (like) => like.userId === currentUser?.id || like === currentUser?.id
        );

        return (
          <div
            key={post.id || idx}
            className="border bg-white border-gray-100 rounded-lg p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow"
          >
            <span className="text-base text-gray-400 font-medium tracking-tight">
              {post.user?.name || "Anonymous"}
            </span>
            <h3 className="text-2xl text-[#1B1B1B] mt-2 mb-3">{post.title}</h3>
            <p className="text-gray-500 text-base leading-relaxed mb-6 border-b border-gray-100 pb-6">
              {post.content}
            </p>
            <div className="flex items-center gap-4 text-gray-400">
              <button
                type="button"
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
                  isLikedByMe ? "text-green-500/60" : "hover:text-gray-600"
                }`}
              >
                <ThumbsUp size={18} fill={isLikedByMe ? "currentColor" : "none"} />
                <span className="text-base font-medium">{post.likesCount || 0}</span>
              </button>
              <div className="w-px h-3 bg-gray-200"></div>
              <button
                type="button"
                onClick={() => toggleReplies(idx)}
                className="flex items-center gap-1.5 cursor-pointer hover:text-gray-600 transition-colors"
              >
                <MessageSquare size={18} />
                <span className="text-base font-medium">
                  {t("community.posts.replyCount", { count: post._count?.comments || 0 })}
                </span>
              </button>
            </div>

            {openReplyIndex === idx && (
              <PostCommentSection
                postId={post.id}
                onClose={() => toggleReplies(idx)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
});

PostsList.displayName = "PostsList";

export default PostsList;
