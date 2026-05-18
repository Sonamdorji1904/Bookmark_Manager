import { getLinkPreview } from "link-preview-js";

export type LinkMetadata = {
  title: string | null;
  description: string | null;
  favicon: string | null;
  previewImage: string | null;
  domain: string;
};

const toAbsoluteUrl = (baseUrl: string, maybeRelative?: string | null) => {
  if (!maybeRelative) {
    return null;
  }

  try {
    return new URL(maybeRelative, baseUrl).toString();
  } catch {
    return maybeRelative;
  }
};

export const fetchLinkMetadata = async (url: string): Promise<LinkMetadata> => {
  const parsedUrl = new URL(url);

  try {
    const preview = await getLinkPreview(url, {
      timeout: 7000,
      followRedirects: "follow",
      headers: {
        "user-agent": "BookmarkManagerBot/1.0",
      },
    });

    if (preview && preview.url) {
      const pageTitle = "title" in preview ? preview.title : null;
      const pageDescription =
        "description" in preview ? preview.description ?? null : null;
      const image = "images" in preview ? preview.images?.[0] ?? null : null;
      const icon = "favicons" in preview ? preview.favicons?.[0] ?? null : null;

      return {
        title: pageTitle,
        description: pageDescription,
        previewImage: toAbsoluteUrl(preview.url, image),
        favicon: toAbsoluteUrl(preview.url, icon),
        domain: parsedUrl.hostname,
      };
    }
  } catch {
    // Metadata parsing can fail for blocked URLs or non-HTML content.
  }

  return {
    title: null,
    description: null,
    previewImage: null,
    favicon: null,
    domain: parsedUrl.hostname,
  };
};
