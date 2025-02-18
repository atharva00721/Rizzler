import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ResponseCardProps {
  message: string;
  rating: number;
  explanation: string;
  alternative: string;
  index: number;
  total: number;
}

export function ResponseCard({
  message,
  rating,
  explanation,
  alternative,
  index,
  total,
}: ResponseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 * index }}
      className="bg-card text-card-foreground rounded-xl shadow-lg p-6 md:p-8"
    >
      <div className="flex justify-between items-start mb-4 md:mb-6">
        <span className="text-sm text-muted-foreground">
          Response {index + 1} of {total}
        </span>
        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
          Rating: {rating}/10
        </span>
      </div>

      <div className="space-y-4 md:space-y-6">
        <ResponseSection title="Message:" content={message} isQuoted large />
        <ResponseSection title="Why this works:" content={explanation} />
        <ResponseSection title="Alternative:" content={alternative} isQuoted />

        <Button
          onClick={() => navigator.clipboard.writeText(message)}
          variant="secondary"
          className="w-full"
        >
          Copy Message
        </Button>
      </div>
    </motion.div>
  );
}

interface ResponseSectionProps {
  title: string;
  content: string;
  isQuoted?: boolean;
  large?: boolean;
}

function ResponseSection({
  title,
  content,
  isQuoted,
  large,
}: ResponseSectionProps) {
  return (
    <div>
      <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {title}
      </h4>
      <p
        className={`${
          large ? "text-lg md:text-xl" : "text-base"
        } text-gray-700 dark:text-gray-300`}
      >
        {isQuoted ? `"${content}"` : content}
      </p>
    </div>
  );
}
