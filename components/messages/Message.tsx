"use client";

import React from "react";
import Image from "next/image";
import { Message as MessageType } from "@/types/index";
import { formatRelativeTime } from "@utils/helpers";

interface MessageProps {
  message: MessageType;
  isOwn: boolean;
}

export const Message = React.memo(({ message, isOwn }: MessageProps) => {
  return (
    <div
      className={`flex gap-3 mb-4 ${isOwn ? "justify-end" : "justify-start"}`}
    >
      {isOwn && message.sender?.profilePicture && (
        <div className="flex-shrink-0 order-2">
          <Image
            src={message.sender.profilePicture}
            alt="Your avatar"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
      )}

      <div
        className={`flex flex-col gap-1 ${isOwn ? "items-end" : "items-start"}`}
      >
        <div
          className={`px-4 py-2 rounded-2xl max-w-xs break-words text-sm ${
            isOwn
              ? "bg-primary text-white rounded-br-none"
              : "bg-card-bg text-foreground rounded-bl-none"
          }`}
        >
          {message.text}
        </div>
        <span className="text-text-tertiary text-xs">
          {formatRelativeTime(message.createdAt)}
        </span>
      </div>

      {!isOwn && message.sender?.profilePicture && (
        <div className="flex-shrink-0">
          <Image
            src={message.sender.profilePicture}
            alt={`${message.sender.firstName}'s avatar`}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
      )}
    </div>
  );
});

Message.displayName = "Message";
