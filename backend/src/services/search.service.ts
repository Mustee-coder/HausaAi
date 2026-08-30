import { tavily } from "@tavily/core";

interface SearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  source: string;
  sourcePriority: number;
}

interface WebSearchResponse {
  answer: string | null;
  results: SearchResult[];
}

const tavilyApiKey = process.env.TAVILY_API_KEY;

if (!tavilyApiKey) {
  throw new Error("TAVILY_API_KEY is not defined");
}

const tvly = tavily({
  apiKey: tavilyApiKey,
});

// Trusted domains for current/factual information.
const TRUSTED_DOMAINS = [
  "reuters.com",
  "apnews.com",
  "bbc.com",
  "bbc.co.uk",
  "aljazeera.com",
  "techcrunch.com",
  "theverge.com",
  "openai.com",
  "google.com",
  "microsoft.com",
  "github.com",
  "who.int",
  "un.org",
] as const;

// Domains that should have lower priority when better sources exist.
const LOW_PRIORITY_DOMAINS = [
  "tiktok.com",
  "youtube.com",
  "medium.com",
  "wikipedia.org",
  "facebook.com",
  "x.com",
  "twitter.com",
] as const;

const getHostname = (url: string = ""): string => {
  try {
    return new URL(url)
      .hostname
      .replace(/^www\./, "")
      .toLowerCase();
  } catch {
    return "";
  }
};

const isNewsQuery = (query: string = ""): boolean => {
  const text = query.toLowerCase();

  const newsKeywords = [
    "labari",
    "labarai",
    "sabbin labarai",
    "latest news",
    "latest",
    "recent news",
    "news",
    "me ya faru",
    "what happened",
    "breaking",
    "breaking news",
  ];

  return newsKeywords.some((keyword) =>
    text.includes(keyword)
  );
};

const buildSearchQuery = (query: string): string => {
  if (isNewsQuery(query)) {
    return `${query} latest news today 2026`;
  }

  return query;
};

export const webSearch = async (
  query: string
): Promise<WebSearchResponse> => {
  try {
    const searchQuery = buildSearchQuery(query);

    const response = await tvly.search(searchQuery, {
      searchDepth: "advanced",
      maxResults: 8,
      includeAnswer: true,
      includeRawContent: false,

      ...(isNewsQuery(query) && {
        topic: "news",
      }),
    });

    if (!response?.results?.length) {
      return {
        answer: response?.answer || null,
        results: [],
      };
    }

    // Remove duplicate URLs.
    const seen = new Set<string>();

    const results: SearchResult[] = response.results
      .filter((result) => {
        if (!result?.url) {
          return false;
        }

        const normalizedUrl = result.url.split("#")[0];

        if (seen.has(normalizedUrl)) {
          return false;
        }

        seen.add(normalizedUrl);
        return true;
      })
      .map((result) => {
        const hostname = getHostname(result.url);

        let sourcePriority = 0;

        const isTrusted = TRUSTED_DOMAINS.some(
          (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
        );

        const isLowPriority = LOW_PRIORITY_DOMAINS.some(
          (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
        );

        if (isTrusted) {
          sourcePriority = 2;
        }

        if (isLowPriority) {
          sourcePriority = -1;
        }

        return {
          title: result.title || "",
          url: result.url || "",
          content: result.content || "",
          score: Number(result.score) || 0,
          source: hostname,
          sourcePriority,
        };
      })
      .sort((a, b) => {
        // Trusted sources first.
        if (b.sourcePriority !== a.sourcePriority) {
          return b.sourcePriority - a.sourcePriority;
        }

        // Then Tavily relevance score.
        return b.score - a.score;
      })
      .slice(0, 5);

    return {
      answer: response.answer || null,
      results,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        "Web search error:",
        error.message
      );
    } else {
      console.error(
        "Web search error:",
        error
      );
    }

    return {
      answer: null,
      results: [],
    };
  }
};

/**
 * Decide whether the user's message needs live web information.
 */
export const needsWebSearch = (
  message: string = ""
): boolean => {
  const keywords = [
    // Hausa
    "yanzu",
    "a yanzu",
    "a yau",
    "yau",
    "a wannan lokacin",
    "latest",
    "labari",
    "labarai",
    "sabbin labarai",
    "me ya faru",
    "ya mutu",
    "ya rasu",
    "yana raye",
    "har yanzu",
    "shugaban yanzu",
    "farashi",
    "farashin",
    "yanayi",
    "yanayin sama",
    "wa ne",
    "wanene",
    "bana",
    "shekarar nan",

    // English
    "today",
    "tonight",
    "current",
    "currently",
    "latest",
    "latest news",
    "recent",
    "recently",
    "this year",
    "this month",
    "who is",
    "what happened",
    "price",
    "prices",
    "weather",
    "alive",
    "president",
    "news",

    // Explicit years
    "2026",
    "2027",
  ];

  const text = message
    .toLowerCase()
    .trim();

  return keywords.some((keyword) =>
    text.includes(keyword)
  );
};