"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/button";
import { toast } from "@/lib/toast";
import { buildFacebookShareUrl } from "@/utils/share.utils";
import { exportMessages } from "@/messages/export";

export interface ShareFacebookButtonProps {
  shareUrl: string;
  isPublic?: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ShareFacebookButton({
  shareUrl,
  isPublic = true,
  label = exportMessages.facebook.label,
  size = "md",
  className,
}: ShareFacebookButtonProps) {
  const handleShare = () => {
    if (!isPublic) {
      toast.error(exportMessages.facebook.privateError);
      return;
    }

    const facebookUrl = buildFacebookShareUrl(shareUrl);
    window.open(
      facebookUrl,
      "facebook-share",
      "noopener,noreferrer,width=600,height=500",
    );
  };

  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      className={`gap-1.5 ${className ?? ""}`}
      onClick={handleShare}
    >
      <Share2 className="h-4 w-4" />
      {label}
    </Button>
  );
}
