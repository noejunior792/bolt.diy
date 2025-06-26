export type TextPart = {
  type: 'text';
  text: string;
};

export type ImagePart = {
  type: 'image_url';
  image_url: { url: string };
};

export type Part = TextPart | ImagePart;

export type MessageContent = string | Part[];

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: MessageContent;
};