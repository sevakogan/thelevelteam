import type { ChannelType } from "./types";
import { SmsIcon, EmailIcon } from "./icons";

const CHANNEL_STYLES: Record<ChannelType, string> = {
  sms: "bg-green-500/10 text-green-400 border-green-500/20",
  email: "bg-accent-blue/10 text-accent-blue border-accent-blue/20",
  both: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

const CHANNEL_LABELS: Record<ChannelType, string> = {
  sms: "SMS",
  email: "Email",
  both: "SMS + Email",
};

export function ChannelBadge({ channel }: { readonly channel: ChannelType }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${CHANNEL_STYLES[channel]}`}
    >
      {channel === "email" ? (
        <EmailIcon className="w-2.5 h-2.5" />
      ) : channel === "sms" ? (
        <SmsIcon className="w-2.5 h-2.5" />
      ) : (
        <>
          <SmsIcon className="w-2.5 h-2.5" />
          <EmailIcon className="w-2.5 h-2.5" />
        </>
      )}
      {CHANNEL_LABELS[channel]}
    </span>
  );
}
