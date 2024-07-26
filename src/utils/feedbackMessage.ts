import { cookies } from 'next/headers';

const DEFAULT_FEEDBACK_MESSAGE_KEY = 'ondeir:default-feedback-message';

export type FeedbackMessage = {
  type: 'error' | 'success';
  content: string;
};

type SetFeedbackMessageProps = FeedbackMessage & {
  duration?: number; // in milliseconds
};

function setFeedbackMessage({
  content,
  duration = 1000,
  type,
}: SetFeedbackMessageProps) {
  cookies().set(
    DEFAULT_FEEDBACK_MESSAGE_KEY,
    JSON.stringify({ type, content }),
    {
      httpOnly: true,
      expires: new Date(Date.now() + duration),
    },
  );
}

function getFeedbackMessage() {
  const message = cookies().get(DEFAULT_FEEDBACK_MESSAGE_KEY)?.value;

  if (!message) {
    return null;
  }

  return JSON.parse(message) as FeedbackMessage;
}

export const feedbackMessage = Object.freeze({
  setFeedbackMessage,
  getFeedbackMessage,
});
