"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Post } from "@/types/index";
import { Avatar } from "@components/ui/Avatar";
import { Button } from "@components/ui/Button";
import {
  Heart,
  MessageCircle,
  Share2,
  Trash2,
  Edit2,
  MoreVertical,
} from "lucide-react";
import { formatRelativeTime } from "@utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@store/index";
import { likePost, deletePost } from "@store/postSlice";

interface PostCardProps {
  post: Post;
  isOwnPost?: boolean;
  onEdit?: () => void;
}

export const PostCard = React.memo(
  ({ post, isOwnPost = false, onEdit }: PostCardProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const [isLiked, setIsLiked] = useState(
      user ? post.likes.includes(user.id) : false,
    );
    const [showMenu, setShowMenu] = useState(false);

    const handleLike = () => {
      setIsLiked(!isLiked);
      dispatch(likePost(post.id));
    };

    const handleDelete = () => {
      if (confirm("Are you sure you want to delete this post?")) {
        dispatch(deletePost(post.id));
        setShowMenu(false);
      }
    };

    return (
      <article className="w-full bg-card-bg rounded-lg shadow-sm border border-border mb-6 p-4 hover:shadow-md transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-3 flex-1">
            <Link href={`/profile/${post.user.username}`}>
              <Avatar
                firstName={post.user.firstName}
                lastName={post.user.lastName}
                src={post.user.profilePicture}
                size="md"
                className="hover:opacity-80 transition"
              />
            </Link>

            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/profile/${post.user.username}`}
                  className="font-semibold text-foreground hover:underline text-sm"
                >
                  {post.user.firstName} {post.user.lastName}
                </Link>
                <span className="text-text-secondary text-xs">
                  @{post.user.username}
                </span>
              </div>
              <span className="text-text-secondary text-xs">
                {formatRelativeTime(post.createdAt)}
              </span>
            </div>
          </div>

          {isOwnPost && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-primary/10 rounded-full transition text-text-secondary hover:text-primary"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-10 bg-background border border-border rounded-lg shadow-lg z-10 min-w-fit">
                  <button
                    onClick={onEdit}
                    className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-primary/10 w-full text-left text-sm transition border-b border-border"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 text-error hover:bg-error/10 w-full text-left text-sm transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mb-4">
          <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap break-words">
            {post.content}
          </p>
        </div>

        {post.image && (
          <div className="mb-4 rounded-lg overflow-hidden bg-black/5 max-h-96">
            <Image
              src={post.image}
              alt="Post image"
              width={600}
              height={400}
              className="w-full h-auto max-h-96 object-contain"
              priority={false}
            />
          </div>
        )}

        <div className="flex gap-6 text-xs text-text-secondary border-b border-border pb-3 mb-3">
          <span className="hover:text-primary cursor-pointer transition">
            {post.likes.length} <span className="hidden sm:inline">Likes</span>
          </span>
          <span className="hover:text-primary cursor-pointer transition">
            {post.comments.length}{" "}
            <span className="hidden sm:inline">Comments</span>
          </span>
          <span className="hover:text-primary cursor-pointer transition">
            Share
          </span>
        </div>

        <div className="flex gap-2 justify-around">
          <button
            onClick={handleLike}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition text-sm font-medium ${
              isLiked
                ? "text-error hover:bg-error/10"
                : "text-text-secondary hover:bg-primary/10 hover:text-primary"
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            <span className="hidden sm:inline">Like</span>
          </button>

          <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition text-sm font-medium text-text-secondary hover:bg-secondary/10 hover:text-secondary">
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Comment</span>
          </button>

          <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition text-sm font-medium text-text-secondary hover:bg-accent/10 hover:text-accent">
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </article>
    );
  },
);

PostCard.displayName = "PostCard";
