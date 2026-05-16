"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Conversation as ConversationType } from "@/types/index";

interface ConversationProps {
  conversation: ConversationType;
  isActive?: boolean;
  onClick?: () => void;
}

export const Conversation = React.memo(
  ({ conversation, isActive = false, onClick }: ConversationProps) => {
    const otherUser = conversation.participants?.[1];

    return (
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 p-3 rounded-lg transition duration-200 text-left ${
          isActive
            ? "bg-primary/20 border-l-4 border-primary"
            : "hover:bg-card-bg border-l-4 border-transparent"
        }`}
      >
        {otherUser?.profilePicture ? (
          <Image
            src={otherUser.profilePicture}
            alt={otherUser.username}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-primary">
            {otherUser?.firstName?.charAt(0)}
            {otherUser?.lastName?.charAt(0)}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm truncate">
            {otherUser?.firstName} {otherUser?.lastName}
          </p>
          <p className="text-text-secondary text-xs truncate">
            @{otherUser?.username}
          </p>
        </div>

        <div className="w-3 h-3 rounded-full bg-success flex-shrink-0" />
      </button>
    );
  },
);

Conversation.displayName = "Conversation";
