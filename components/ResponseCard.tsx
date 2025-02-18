import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Copy } from "lucide-react";

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
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
    >
      <div className="flex justify-between items-start mb-6">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Response {index + 1} of {total}
        </span>
        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-full text-sm font-medium">
          Rating: {rating}/10
        </span>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-medium text-gray-800 dark:text-gray-100 mb-2">
            Message:
          </h3>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            "{message}"
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Why this works:
          </h4>
          <p className="text-gray-600 dark:text-gray-400">{explanation}</p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Alternative Approach:
          </h4>
          <p className="text-gray-600 dark:text-gray-400 italic">
            "{alternative}"
          </p>
        </div>

        <Button
          onClick={() => navigator.clipboard.writeText(message)}
          className="w-full mt-4 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-300"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Message
        </Button>
      </div>
    </motion.div>
  );
}
