/**
 * Get the image URL for a part.
 * If the part has images, return the first image URL.
 * Otherwise, return a default avatar URL using the part's name.
 * @param {Object} part - The part object
 * @returns {string} The image URL
 */
export function getPartImageUrl(part) {
  if (part?.images && part.images.length > 0) {
    return `${import.meta.env.VITE_BASE_URL}/storage/${part.images[0]}`;
  }

  // Generate default avatar using part name
  const nameParts = part?.name?.split(' ') || ['Part'];
  const first = nameParts[0] || 'Part';
  const last = nameParts[1] || '';
  return `https://ui-avatars.com/api/?name=${first}+${last}&background=6366f1&color=fff&size=280`;
}
