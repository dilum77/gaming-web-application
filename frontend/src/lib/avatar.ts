/**
 * Generate avatar URL using DiceBear API
 * @param username - Username to generate avatar for
 * @param style - Avatar style (default: 'adventurer')
 * @returns Avatar URL
 */
export const getAvatarUrl = (username: string, style: string = 'adventurer'): string => {
  // Use username as seed for consistent avatars
  const seed = encodeURIComponent(username);
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
};

/**
 * Get avatar URL with custom options
 * @param username - Username to generate avatar for
 * @param options - Additional options for avatar generation
 * @returns Avatar URL
 */
export const getAvatarUrlWithOptions = (
  username: string,
  options: {
    style?: string;
    size?: number;
    backgroundColor?: string;
  } = {}
): string => {
  const { style = 'adventurer', size = 200, backgroundColor } = options;
  const seed = encodeURIComponent(username);
  const params = new URLSearchParams({
    seed,
    size: size.toString(),
  });
  
  if (backgroundColor) {
    params.append('backgroundColor', backgroundColor);
  }
  
  return `https://api.dicebear.com/7.x/${style}/svg?${params.toString()}`;
};

