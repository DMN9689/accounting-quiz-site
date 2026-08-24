export function extractBodyMarkup(source: string): string {
  const bodyMatch = source.match(/<body(?:\s[^>]*)?>([\s\S]*?)<\/body>/i);

  if (!bodyMatch) {
    throw new Error('원본 HTML에서 body 내용을 찾을 수 없습니다.');
  }

  return bodyMatch[1].replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').trim();
}
