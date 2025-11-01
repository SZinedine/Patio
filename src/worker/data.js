const news_obj = [
    {
        "uuid": "faeeba50-cdb4-4290-93d9-4ac409094bdf",
        "title": "Reuters",
        "link": "https://www.reuters.com",
        "description": "International news agency providing breaking news and analysis",
        "children": [
            {
                "uuid": "3119ea04-5cf8-41d0-b0c6-9751e5f36ef9",
                "title": "Reuters - World News",
                "link": "https://www.reuters.com/world/",
                "description": "International news coverage from Reuters"
            },
            {
                "uuid": "5b948ef3-c7dc-4240-ac23-bdbf2d429aa6",
                "title": "Reuters - Business",
                "link": "https://www.reuters.com/business/",
                "description": "Business and financial news from Reuters"
            },
            {
                "uuid": "3a832885-72ff-45d8-9f2b-0e75949bfd08",
                "title": "Reuters - Technology",
                "link": "https://www.reuters.com/technology/",
                "description": "Technology and innovation news from Reuters"
            },
            {
                "uuid": "1b790b2c-30f8-44b7-9309-9de48bb828f7",
                "title": "Reuters - Health",
                "link": "https://www.reuters.com/life/",
                "description": "Health and medical news coverage from Reuters"
            }
        ],
        "type": "list"
    },
    {
        "uuid": "bbceed83-34bd-46b0-9edd-2f191a043780",
        "title": "Associated Press",
        "link": "https://apnews.com",
        "description": "Independent, not-for-profit news cooperative",
        "type": "list",
        "children": [
            {
                "uuid": "143fc70c-29d7-4d1c-b001-957543d5edf4",
                "title": "Associated Press - World News",
                "link": "https://apnews.com/world",
                "description": "International news coverage from Associated Press"
            },
            {
                "uuid": "b919e9b1-d8f1-45fd-9247-96418fd496d4",
                "title": "Associated Press - Politics",
                "link": "https://apnews.com/politics",
                "description": "Political news and election coverage from Associated Press"
            },
            {
                "uuid": "8a73bb14-3796-4f06-bcbe-c070f13f1aab",
                "title": "Associated Press - Business",
                "link": "https://apnews.com/business",
                "description": "Business and economic news from Associated Press"
            },
            {
                "uuid": "0ab50194-40c6-485a-b20a-b30b6361df24",
                "title": "Associated Press - Sports",
                "link": "https://apnews.com/sports",
                "description": "Sports news and coverage from Associated Press"
            },
            {
                "uuid": "21b4b0ff-21c4-44fb-8ee3-c0792ca8a4a1",
                "title": "Associated Press - Entertainment",
                "link": "https://apnews.com/entertainment",
                "description": "Entertainment and culture news from Associated Press"
            },
            {
                "uuid": "604d7a8e-bf9f-4c7a-bbdf-35592f68d0c6",
                "title": "Associated Press - Health",
                "link": "https://apnews.com/health",
                "description": "Health and medical news from Associated Press"
            },
            {
                "uuid": "8a9cdb5a-cc3f-4080-8174-ccb4a495376c",
                "title": "Associated Press - Technology",
                "link": "https://apnews.com/technology",
                "description": "Technology and science news from Associated Press"
            }
        ],
    },
    {
        "uuid": "cf7c01bb-6469-4f33-b33b-6b01cad29ce0",
        "title": "BBC News",
        "link": "https://www.bbc.com/news",
        "description": "British public service broadcaster's international news division"
    },
    {
        "uuid": "13e9e033-b396-41b9-bf7f-9af58f3b7975",
        "title": "The New York Times",
        "link": "https://www.nytimes.com",
        "description": "American newspaper known for its international coverage"
    },
    {
        "uuid": "837b66a4-5c31-4ed7-80f1-c767e86b0f3a",
        "title": "The Washington Post",
        "link": "https://www.washingtonpost.com",
        "description": "American daily newspaper based in Washington, D.C."
    },
    {
        "uuid": "81d63e1a-27ba-4aea-8259-c6a453b6bdb1",
        "title": "CNN",
        "link": "https://www.cnn.com",
        "description": "American news-based television and digital media company"
    },
    {
        "uuid": "e540de57-5450-44cc-b185-ca1240badf52",
        "title": "The Guardian",
        "link": "https://www.theguardian.com",
        "description": "British daily newspaper focusing on global news"
    },
    {
        "uuid": "6f8a8941-fde6-4fa1-b925-4da5dd6fea36",
        "title": "Al Jazeera",
        "link": "https://www.aljazeera.com",
        "description": "Qatari-based international news organization"
    },
    {
        "uuid": "f57e540c-c25b-48f0-9b4e-063c4c726eac",
        "title": "France 24",
        "link": "https://www.france24.com",
        "description": "French state-owned international news television network"
    },
    {
        "uuid": "9be8b087-b282-4769-9f91-026ddbcd513a",
        "title": "DW News",
        "link": "https://www.dw.com",
        "description": "German public international broadcaster"
    },
    {
        "uuid": "0c3c7438-f8ec-4ecc-99db-44dffc842b4f",
        "title": "The Times of India",
        "link": "https://timesofindia.indiatimes.com",
        "description": "English-language daily newspaper in India"
    },
    {
        "uuid": "25bb091f-f938-4c62-9d09-0c57e0ed36aa",
        "title": "China Daily",
        "link": "https://www.chinadaily.com.cn",
        "description": "English-language daily newspaper in China"
    },
    {
        "uuid": "64fb58a1-aae7-452b-b265-ce47a8d80d1f",
        "title": "Le Monde",
        "link": "https://www.lemonde.fr",
        "description": "French daily newspaper of record"
    },
    {
        "uuid": "0558c930-66c5-475f-99b4-0fe8a32ffaec",
        "title": "El País",
        "link": "https://www.elpais.com",
        "description": "Spanish daily newspaper based in Madrid"
    },
    {
        "uuid": "9dacb20d-eaa6-49cd-b722-16d3fb9a510d",
        "title": "The Sydney Morning Herald",
        "link": "https://www.smh.com.au",
        "description": "Australian daily newspaper published in Sydney"
    }
];

const social_media_obj = [
    {
        "uuid": "86d39252-2d95-4e41-b34d-6d8d9a55b179",
        "title": "Facebook",
        "link": "https://www.facebook.com",
        "description": "Social networking platform connecting billions of users worldwide"
    },
    {
        "uuid": "10867c51-63ce-42f6-a608-ac2e49117c0b",
        "title": "Instagram",
        "link": "https://www.instagram.com",
        "description": "Photo and video sharing social media platform"
    },
    {
        "uuid": "54aa41da-2cf7-4969-bf07-61985c42ffda",
        "title": "Twitter",
        "link": "https://www.twitter.com",
        "description": "Microblogging platform for sharing short messages and news"
    },
    {
        "uuid": "aaea0285-6b56-4f7a-a9bd-91b196abeb72",
        "title": "LinkedIn",
        "link": "https://www.linkedin.com",
        "description": "Professional networking platform for career and business connections"
    },
    {
        "uuid": "8621bb24-837f-4a06-b008-ac58e9dbe12f",
        "title": "TikTok",
        "link": "https://www.tiktok.com",
        "description": "Short-form video sharing platform popular for entertainment"
    },
    {
        "uuid": "892b3c8c-2225-47cf-bb3c-8f008f21e727",
        "title": "YouTube",
        "link": "https://www.youtube.com",
        "description": "Video sharing platform for content creators and viewers"
    },
    {
        "uuid": "60a5a849-4e08-477d-af47-306b40d31bc3",
        "title": "Snapchat",
        "link": "https://www.snapchat.com",
        "description": "Multimedia messaging app with disappearing content"
    },
    {
        "uuid": "ce06b451-3923-4753-8fce-745c4facfbe4",
        "title": "Reddit",
        "link": "https://www.reddit.com",
        "description": "Social news aggregation and discussion platform"
    },
    {
        "uuid": "32758423-131d-408d-914d-97a6541a8dcb",
        "title": "Pinterest",
        "link": "https://www.pinterest.com",
        "description": "Visual discovery and bookmarking platform for ideas"
    },
    {
        "uuid": "1191dc01-4e12-4813-94b4-2746e2ec6353",
        "title": "Discord",
        "link": "https://www.discord.com",
        "description": "Voice, video and text communication platform for communities"
    },
    {
        "uuid": "9e660218-677b-4cb1-81b3-daa25496a1e8",
        "title": "Twitch",
        "link": "https://www.twitch.tv",
        "description": "Live streaming platform primarily for video games and entertainment"
    },
    {
        "uuid": "b464ee26-9449-4d74-8a4c-e49b66ee25a8",
        "title": "Tumblr",
        "link": "https://www.tumblr.com",
        "description": "Microblogging and social networking platform"
    },
    {
        "uuid": "318d6793-4843-4703-9eca-d5f96ff0160e",
        "link": "https://www.whatsapp.com",
        "description": "Cross-platform messaging and voice-over-IP service"
    },
    {
        "uuid": "9193a681-0fda-49bb-95cc-843d4b5699cc",
        "title": "Telegram",
        "link": "https://web.telegram.org",
        "description": "Cloud-based instant messaging service with encryption"
    },
    {
        "uuid": "a0134524-ecb9-49bf-853f-9db05d2ecafd",
        "title": "Flickr",
        "link": "https://www.flickr.com",
        "description": "Photo sharing platform for photographers and image enthusiasts"
    },
    {
        "uuid": "fb4d0021-21a1-45d4-bd09-201fd2510343",
        "title": "Vimeo",
        "link": "https://vimeo.com",
        "description": "Video hosting platform focused on creative and professional content"
    },
    {
        "uuid": "a69279c9-9970-40f2-8647-0b509d8acf99",
        "title": "Medium",
        "link": "https://medium.com",
        "description": "Blogging platform for writers and readers of long-form content"
    },
    {
        "uuid": "6362efcc-5024-45d3-af3d-6d9282407bcd",
        "title": "Quora",
        "link": "https://www.quora.com",
        "description": "Question-and-answer platform for knowledge sharing"
    },
    {
        "uuid": "0ce2eeaa-61b8-47ef-8adc-0f43ffc5187e",
        "title": "Meetup",
        "link": "https://www.meetup.com",
        "description": "Platform for organizing and finding local group meetings"
    },
    {
        "uuid": "a5174026-ec9e-49ea-a471-f4a23084f636",
        "title": "Nextdoor",
        "link": "https://nextdoor.com",
        "description": "Social networking service for neighborhoods and local communities"
    }
];

const ai_obj = [
    {
        "uuid": "950dec5e-6835-4d44-bdd0-84f4b3cd402f",
        "title": "OpenAI",
        "link": "https://openai.com",
        "description": "Artificial intelligence research laboratory creating advanced AI models"
    },
    {
        "uuid": "3a5fedb2-2936-4c96-afd9-9cd9477096ea",
        "title": "Anthropic",
        "link": "https://anthropic.com",
        "description": "AI safety and research company developing constitutional AI"
    },
    {
        "uuid": "0739b0a3-dea3-4113-8502-8b6c09bc4a9a",
        "title": "Google AI",
        "link": "https://ai.google",
        "description": "Google's artificial intelligence research and products division"
    },
    {
        "uuid": "c1941dcb-86c9-4953-9135-f93fd1770ba7",
        "title": "Hugging Face",
        "link": "https://huggingface.co",
        "description": "Platform for machine learning and AI model sharing"
    },
    {
        "uuid": "7814458f-8e54-43e7-bdc4-9e4dea4884a5",
        "title": "DeepMind",
        "link": "https://deepmind.com",
        "description": "AI company developing general-purpose learning algorithms"
    },
    {
        "uuid": "c048584c-bac7-487b-91a4-17d808895cf6",
        "title": "Cohere",
        "link": "https://cohere.ai",
        "description": "AI company providing natural language processing tools"
    },
    {
        "uuid": "8b620f33-79e2-41e6-a818-5f7d8f58662d",
        "title": "Stability AI",
        "link": "https://stability.ai",
        "description": "Company focused on generative AI models and tools"
    },
    {
        "uuid": "ccaa9ffc-cdbc-4f48-a8b1-475127b01a38",
        "title": "Papers With Code",
        "link": "https://paperswithcode.com",
        "description": "Repository of AI research papers with code implementations"
    },
    {
        "uuid": "46f63f84-d174-4ed9-9b4d-c4ff86e7f157",
        "title": "EleutherAI",
        "link": "https://www.eleuther.ai",
        "description": "Open source AI research organization creating large language models"
    },
    {
        "uuid": "5abed708-8fcf-46d3-a34f-a3001e5b76c4",
        "title": "AI21 Labs",
        "link": "https://www.ai21.com",
        "description": "Israeli AI company developing advanced language models"
    }
];

const books_obj = [
    {
        "uuid": "d41b3a86-28c1-46e0-a938-b096e2749fab",
        "title": "PubMed",
        "link": "https://pubmed.ncbi.nlm.nih.gov",
        "description": "Database of biomedical literature maintained by the National Library of Medicine"
    },
    {
        "uuid": "b6ae2786-41a6-4198-a968-567077a91056",
        "title": "Library Genesis",
        "link": "https://libgen.li",
        "description": "very good books",
        "children": [
            {
                "uuid": "cca19b39-3fc9-472a-8ea5-358d083bf56d",
                "title": "sci-hub",
                "link": "https://sci-hub.li",
                "description": "scientific journals"
            },
            {
                "uuid": "fe61b1fa-a493-495b-a364-2ae478efec98",
                "title": "sci-hub",
                "link": "https://sci-hub.ru",
                "description": "scientific journals. russian version"
            },
            {
                "uuid": "68095b15-9a49-4b07-a7a8-8767e27337c2",
                "title": "welib",
                "link": "https://welib.org",
                "description": "books and scientific journals"
            },
            {
                "uuid": "338082a7-e487-4a77-87ce-ea748dc763e8",
                "title": "welib",
                "link": "https://libgen.st",
                "description": "books"
            }
        ],
        "type": "list"
    },
    {
        "uuid": "8ab62ce0-4441-42f3-bb6f-e37285ed9aa3",
        "title": "Google Scholar",
        "link": "https://scholar.google.com",
        "description": "Academic search engine indexing scholarly literature across various disciplines",
        "children": [
            {
                "uuid": "e0031137-9ed1-44b9-a0c7-7192b7d0c3d2",
                "title": "sci-hub",
                "link": "https://sci-hub.li",
                "description": "scientific journals"
            },
            {
                "uuid": "ebe2be5b-d188-4d77-b257-4c3c22a4823d",
                "title": "sci-hub",
                "link": "https://sci-hub.ru",
                "description": "scientific journals. russian version"
            },
            {
                "uuid": "c8cba4b7-671d-4801-9106-14c5725c96ac",
                "title": "welib",
                "link": "https://welib.org",
                "description": "books and scientific journals"
            },
            {
                "uuid": "3198b6d9-20ba-4f41-9c99-f638ccf51dfe",
                "title": "welib",
                "link": "https://libgen.st",
                "description": "books"
            }
        ],
        "type": "list"
    },
    {
        "uuid": "4b6fa328-fd95-4396-a135-bc30cf802964",
        "title": "JSTOR",
        "link": "https://www.jstor.org",
        "description": "Digital library for academic journals, books, and primary sources"
    },
    {
        "uuid": "f6b54ed3-f434-496f-a257-1b3f7fa2d8e9",
        "title": "ScienceDirect",
        "link": "https://www.sciencedirect.com",
        "description": "Platform for scientific and medical research publications by Elsevier"
    },
    {
        "uuid": "bc4fb9f2-8009-4765-aaa5-cec24216c75c",
        "title": "IEEE Xplore",
        "link": "https://ieeexplore.ieee.org",
        "description": "Digital library for technical literature in engineering and computer science"
    },
    {
        "uuid": "45429877-b4b6-4a94-af1a-6b4c863a38ee",
        "title": "SpringerLink",
        "link": "https://link.springer.com",
        "description": "Platform for scientific, technical, and medical content by Springer"
    },
    {
        "uuid": "4144c5b4-b33c-4f08-bca9-37dc8511c101",
        "title": "Wiley Online Library",
        "link": "https://onlinelibrary.wiley.com",
        "description": "Platform for scientific, technical, medical, and scholarly research"
    },
    {
        "uuid": "5ce9d45e-adc1-4601-bc9c-9f4a32f31215",
        "title": "Taylor & Francis Online",
        "link": "https://www.tandfonline.com",
        "description": "Platform for academic research journals and books across various disciplines"
    }
];

const fav_bookmarks = [
    {
        "title": "Google",
        "link": "https://www.google.com",
        "description": "Google",
        "uuid": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8"
    },
    {
        "title": "DuckDuckGo",
        "link": "https://duckduckgo.com",
        "description": "DuckDuckGo",
        "uuid": "b2c3d4e5-f6g7-8901-h2i3-j4k5l6m7n8o9"
    },
    {
        "title": "X/Twitter",
        "link": "https://x.com",
        "description": "X/Twitter",
        "uuid": "c3d4e5f6-g7h8-9012-i3j4-k5l6m7n8o9p0"
    },
    {
        "title": "Facebook",
        "link": "https://www.facebook.com",
        "description": "Facebook",
        "uuid": "d4e5f6g7-h8i9-0123-j4k5-l6m7n8o9p0q1"
    },
    {
        "title": "YouTube",
        "link": "https://www.youtube.com",
        "description": "The leading video-sharing platform where users can watch, upload, and share videos.",
        "uuid": "e5f6g7h8-i9j0-1234-k5l6-m7n8o9p0q1r2"
    },
    {
        "title": "GitHub",
        "link": "https://github.com",
        "description": "A platform for developers to host, review, and manage code repositories using Git version control.",
        "uuid": "f6g7h8i9-j0k1-2345-l6m7-n8o9p0q1r2s3"
    },
    {
        "title": "Instagram",
        "link": "https://www.instagram.com",
        "description": "A photo and video sharing app focused on visual storytelling and social interaction.",
        "uuid": "g7h8i9j0-k1l2-3456-m7n8-o9p0q1r2s3t4"
    },
    {
        "title": "Reddit",
        "link": "https://www.reddit.com",
        "description": "A community-driven content aggregation and discussion website organized into topic-based subreddits.",
        "uuid": "h8i9j0k1-l2m3-4567-n8o9-p0q1r2s3t4u5"
    },
    {
        "title": "Academia",
        "link": "https://www.academia.edu",
        "description": "A platform for academics to share research papers, monitor their impact, and follow research interests.",
        "uuid": "i9j0k1l2-m3n4-5678-o9p0-q1r2s3t4u5v6"
    },
    {
        "title": "LinkedIn",
        "link": "https://www.linkedin.com",
        "description": "A professional networking site for career development, job searching, and business connections.",
        "uuid": "j0k1l2m3-n4o5-6789-p0q1-r2s3t4u5v6w7"
    },
    {
        "title": "Twitch",
        "link": "https://www.twitch.tv",
        "description": "A live streaming platform primarily focused on video game streaming, esports, and creative content.",
        "uuid": "k1l2m3n4-o5p6-7890-q1r2-s3t4u5v6w7x8"
    },
    {
        "title": "Bluesky",
        "link": "https://bsky.app",
        "description": "A decentralized social network offering an alternative to traditional platforms with user-controlled identity.",
        "uuid": "l2m3n4o5-p6q7-8901-r2s3-t4u5v6w7x8y9"
    },
    {
        "title": "ChatGPT",
        "link": "https://chatgpt.com",
        "description": "An AI-powered conversational assistant developed by OpenAI for answering questions and generating text.",
        "uuid": "m3n4o5p6-q7r8-9012-s3t4-u5v6w7x8y9z0"
    },
    {
        "title": "Gemini",
        "link": "https://gemini.google.com/app",
        "description": "Google's advanced AI assistant capable of understanding and generating natural language responses.",
        "uuid": "n4o5p6q7-r8s9-0123-t4u5-v6w7x8y9z0a1"
    },
    {
        "title": "Google AI Studio",
        "link": "https://aistudio.google.com",
        "description": "A tool from Google for experimenting with and building applications using generative AI models.",
        "uuid": "o5p6q7r8-s9t0-1234-u5v6-w7x8y9z0a1b2"
    },
    {
        "title": "DeepSeek (chinese AI)",
        "link": "https://chat.deepseek.com",
        "description": "A Chinese AI company developing large language models for various applications in Chinese and English.",
        "uuid": "p6q7r8s9-t0u1-2345-v6w7-x8y9z0a1b2c3"
    },
    {
        "title": "Claude",
        "link": "https://claude.ai",
        "description": "An AI assistant developed by Anthropic, designed to be helpful, harmless, and honest in conversations.",
        "uuid": "q7r8s9t0-u1v2-3456-w7x8-y9z0a1b2c3d4"
    },
    {
        "title": "Microsoft Copilot",
        "link": "https://copilot.microsoft.com",
        "description": "Microsoft's AI companion powered by GPT models, integrated into Windows and Microsoft 365 apps.",
        "uuid": "r8s9t0u1-v2w3-4567-x8y9-z0a1b2c3d4e5"
    },
    {
        "title": "NotebookLM",
        "link": "https://notebooklm.google.com",
        "description": "Google's AI-powered note-taking assistant that helps organize, summarize, and generate insights from your notes.",
        "uuid": "s9t0u1v2-w3x4-5678-y9z0-a1b2c3d4e5f6"
    },
    {
        "title": "Perplexity",
        "link": "https://www.perplexity.ai",
        "description": "An AI-powered answer engine that provides sourced, up-to-date information through conversational queries.",
        "uuid": "t0u1v2w3-x4y5-6789-z0a1-b2c3d4e5f6g7"
    },
    {
        "title": "Liner",
        "link": "https://getliner.ai/main",
        "description": "An AI tool for highlighting, summarizing, and organizing key information from articles and documents.",
        "uuid": "u1v2w3x4-y5z6-7890-a1b2-c3d4e5f6g7h8"
    },
    {
        "title": "LM Arena",
        "link": "https://lmarena.com",
        "description": "A platform for comparing and benchmarking different large language models through head-to-head evaluations.",
        "uuid": "v2w3x4y5-z6a7-8901-b2c3-d4e5f6g7h8i9"
    },
    {
        "title": "Substack",
        "link": "https://substack.com/home",
        "description": "A platform for writers to publish newsletters and build audiences directly, often monetized through subscriptions.",
        "uuid": "w3x4y5z6-a7b8-9012-c3d4-e5f6g7h8i9j0"
    },
    {
        "title": "Qwen",
        "link": "https://chat.qwen.ai",
        "description": "A series of large language models developed by Alibaba, offering capabilities in multiple languages and domains.",
        "uuid": "x4y5z6a7-b8c9-0123-d4e5-f6g7h8i9j0k1"
    },
    {
        "title": "Genspark",
        "link": "https://www.genspark.ai",
        "description": "An AI-powered search engine that generates concise answers and summaries from web content.",
        "uuid": "y5z6a7b8-c9d0-1234-e5f6-g7h8i9j0k1l2"
    },
    {
        "title": "Grok",
        "link": "https://grok.com",
        "description": "An AI chatbot developed by xAI, designed to answer questions with a humorous and rebellious personality.",
        "uuid": "z6a7b8c9-d0e1-2345-f6g7-h8i9j0k1l2m3"
    },
    {
        "title": "Kimi AI",
        "link": "https://www.kimi.com",
        "description": "A powerful AI assistant developed by Moonshot AI, capable of handling long context and complex reasoning tasks.",
        "uuid": "a7b8c9d0-e1f2-3456-g7h8-i9j0k1l2m3n4"
    },
    {
        "title": "GLM-4.5 (Z.ai)",
        "link": "https://chat.z.ai",
        "description": "A series of large language models developed by Zhipu AI, known for strong performance in Chinese and multilingual tasks.",
        "uuid": "b8c9d0e1-f2g3-4567-h8i9-j0k1l2m3n4o5"
    },
    {
        "title": "SkyWork",
        "link": "https://skywork.com",
        "description": "An AI platform offering tools and services for businesses to integrate artificial intelligence into workflows.",
        "uuid": "c9d0e1f2-g3h4-5678-i9j0-k1l2m3n4o5p6"
    },
    {
        "title": "Manus",
        "link": "https://manus.im/app",
        "description": "An AI research platform focusing on cutting-edge developments and analysis in the field of artificial intelligence.",
        "uuid": "d0e1f2g3-h4i5-6789-j0k1-l2m3n4o5p6q7"
    }
];

let testingData = [
    {
        "type": "thread",
        "title": "Default",
        "uuid": "14725cd1-6064-9621-12a1-49f09a0xf18p",
        "children": [
            {
                "type": "list",
                "title": "News Websites",
                "uuid": "0e7931cf-3a96-4dc8-a11e-c502e7a094d4",
                "children": [
                    {
                        "uuid": "faeeba50-cdb4-4290-93d9-4ac409094bdf",
                        "title": "Reuters",
                        "link": "https://www.reuters.com",
                        "description": "International news agency providing breaking news and analysis",
                        "children": [
                            {
                                "uuid": "3119ea04-5cf8-41d0-b0c6-9751e5f36ef9",
                                "title": "Reuters - World News",
                                "link": "https://www.reuters.com/world/",
                                "description": "International news coverage from Reuters"
                            },
                            {
                                "uuid": "5b948ef3-c7dc-4240-ac23-bdbf2d429aa6",
                                "title": "Reuters - Business",
                                "link": "https://www.reuters.com/business/",
                                "description": "Business and financial news from Reuters"
                            },
                            {
                                "uuid": "3a832885-72ff-45d8-9f2b-0e75949bfd08",
                                "title": "Reuters - Technology",
                                "link": "https://www.reuters.com/technology/",
                                "description": "Technology and innovation news from Reuters"
                            },
                            {
                                "uuid": "1b790b2c-30f8-44b7-9309-9de48bb828f7",
                                "title": "Reuters - Health",
                                "link": "https://www.reuters.com/life/",
                                "description": "Health and medical news coverage from Reuters"
                            }
                        ],
                        "type": "list"
                    },
                    {
                        "uuid": "bbceed83-34bd-46b0-9edd-2f191a043780",
                        "title": "Associated Press",
                        "link": "https://apnews.com",
                        "description": "Independent, not-for-profit news cooperative",
                        "children": [
                            {
                                "uuid": "143fc70c-29d7-4d1c-b001-957543d5edf4",
                                "title": "Associated Press - World News",
                                "link": "https://apnews.com/world",
                                "description": "International news coverage from Associated Press"
                            },
                            {
                                "uuid": "b919e9b1-d8f1-45fd-9247-96418fd496d4",
                                "title": "Associated Press - Politics",
                                "link": "https://apnews.com/politics",
                                "description": "Political news and election coverage from Associated Press"
                            },
                            {
                                "uuid": "8a73bb14-3796-4f06-bcbe-c070f13f1aab",
                                "title": "Associated Press - Business",
                                "link": "https://apnews.com/business",
                                "description": "Business and economic news from Associated Press"
                            },
                            {
                                "uuid": "0ab50194-40c6-485a-b20a-b30b6361df24",
                                "title": "Associated Press - Sports",
                                "link": "https://apnews.com/sports",
                                "description": "Sports news and coverage from Associated Press"
                            },
                            {
                                "uuid": "21b4b0ff-21c4-44fb-8ee3-c0792ca8a4a1",
                                "title": "Associated Press - Entertainment",
                                "link": "https://apnews.com/entertainment",
                                "description": "Entertainment and culture news from Associated Press"
                            },
                            {
                                "uuid": "604d7a8e-bf9f-4c7a-bbdf-35592f68d0c6",
                                "title": "Associated Press - Health",
                                "link": "https://apnews.com/health",
                                "description": "Health and medical news from Associated Press"
                            },
                            {
                                "uuid": "8a9cdb5a-cc3f-4080-8174-ccb4a495376c",
                                "title": "Associated Press - Technology",
                                "link": "https://apnews.com/technology",
                                "description": "Technology and science news from Associated Press"
                            }
                        ],
                        "type": "list"
                    },
                    {
                        "uuid": "cf7c01bb-6469-4f33-b33b-6b01cad29ce0",
                        "title": "BBC News",
                        "link": "https://www.bbc.com/news",
                        "description": "British public service broadcaster's international news division"
                    },
                    {
                        "uuid": "13e9e033-b396-41b9-bf7f-9af58f3b7975",
                        "title": "The New York Times",
                        "link": "https://www.nytimes.com",
                        "description": "American newspaper known for its international coverage"
                    },
                    {
                        "uuid": "837b66a4-5c31-4ed7-80f1-c767e86b0f3a",
                        "title": "The Washington Post",
                        "link": "https://www.washingtonpost.com",
                        "description": "American daily newspaper based in Washington, D.C."
                    },
                    {
                        "uuid": "81d63e1a-27ba-4aea-8259-c6a453b6bdb1",
                        "title": "CNN",
                        "link": "https://www.cnn.com",
                        "description": "American news-based television and digital media company"
                    },
                    {
                        "uuid": "e540de57-5450-44cc-b185-ca1240badf52",
                        "title": "The Guardian",
                        "link": "https://www.theguardian.com",
                        "description": "British daily newspaper focusing on global news"
                    },
                    {
                        "uuid": "6f8a8941-fde6-4fa1-b925-4da5dd6fea36",
                        "title": "Al Jazeera",
                        "link": "https://www.aljazeera.com",
                        "description": "Qatari-based international news organization"
                    },
                    {
                        "uuid": "f57e540c-c25b-48f0-9b4e-063c4c726eac",
                        "title": "France 24",
                        "link": "https://www.france24.com",
                        "description": "French state-owned international news television network"
                    },
                    {
                        "uuid": "9be8b087-b282-4769-9f91-026ddbcd513a",
                        "title": "DW News",
                        "link": "https://www.dw.com",
                        "description": "German public international broadcaster"
                    },
                    {
                        "uuid": "0c3c7438-f8ec-4ecc-99db-44dffc842b4f",
                        "title": "The Times of India",
                        "link": "https://timesofindia.indiatimes.com",
                        "description": "English-language daily newspaper in India"
                    },
                    {
                        "uuid": "25bb091f-f938-4c62-9d09-0c57e0ed36aa",
                        "title": "China Daily",
                        "link": "https://www.chinadaily.com.cn",
                        "description": "English-language daily newspaper in China"
                    },
                    {
                        "uuid": "64fb58a1-aae7-452b-b265-ce47a8d80d1f",
                        "title": "Le Monde",
                        "link": "https://www.lemonde.fr",
                        "description": "French daily newspaper of record"
                    },
                    {
                        "uuid": "0558c930-66c5-475f-99b4-0fe8a32ffaec",
                        "title": "El País",
                        "link": "https://www.elpais.com",
                        "description": "Spanish daily newspaper based in Madrid"
                    },
                    {
                        "uuid": "9dacb20d-eaa6-49cd-b722-16d3fb9a510d",
                        "title": "The Sydney Morning Herald",
                        "link": "https://www.smh.com.au",
                        "description": "Australian daily newspaper published in Sydney"
                    }
                ]
            },
            {
                "type": "list",
                "title": "Social Media",
                "uuid": "a1b913c1-88c0-42b7-818b-491e1527f945",
                "children": [
                    {
                        "uuid": "86d39252-2d95-4e41-b34d-6d8d9a55b179",
                        "title": "Facebook",
                        "link": "https://www.facebook.com",
                        "description": "Social networking platform connecting billions of users worldwide"
                    },
                    {
                        "uuid": "10867c51-63ce-42f6-a608-ac2e49117c0b",
                        "title": "Instagram",
                        "link": "https://www.instagram.com",
                        "description": "Photo and video sharing social media platform"
                    },
                    {
                        "uuid": "54aa41da-2cf7-4969-bf07-61985c42ffda",
                        "title": "Twitter",
                        "link": "https://www.twitter.com",
                        "description": "Microblogging platform for sharing short messages and news"
                    },
                    {
                        "uuid": "aaea0285-6b56-4f7a-a9bd-91b196abeb72",
                        "title": "LinkedIn",
                        "link": "https://www.linkedin.com",
                        "description": "Professional networking platform for career and business connections"
                    },
                    {
                        "uuid": "8621bb24-837f-4a06-b008-ac58e9dbe12f",
                        "title": "TikTok",
                        "link": "https://www.tiktok.com",
                        "description": "Short-form video sharing platform popular for entertainment"
                    },
                    {
                        "uuid": "892b3c8c-2225-47cf-bb3c-8f008f21e727",
                        "title": "YouTube",
                        "link": "https://www.youtube.com",
                        "description": "Video sharing platform for content creators and viewers"
                    },
                    {
                        "uuid": "60a5a849-4e08-477d-af47-306b40d31bc3",
                        "title": "Snapchat",
                        "link": "https://www.snapchat.com",
                        "description": "Multimedia messaging app with disappearing content"
                    },
                    {
                        "uuid": "ce06b451-3923-4753-8fce-745c4facfbe4",
                        "title": "Reddit",
                        "link": "https://www.reddit.com",
                        "description": "Social news aggregation and discussion platform"
                    },
                    {
                        "uuid": "32758423-131d-408d-914d-97a6541a8dcb",
                        "title": "Pinterest",
                        "link": "https://www.pinterest.com",
                        "description": "Visual discovery and bookmarking platform for ideas"
                    },
                    {
                        "uuid": "1191dc01-4e12-4813-94b4-2746e2ec6353",
                        "title": "Discord",
                        "link": "https://www.discord.com",
                        "description": "Voice, video and text communication platform for communities"
                    },
                    {
                        "uuid": "9e660218-677b-4cb1-81b3-daa25496a1e8",
                        "title": "Twitch",
                        "link": "https://www.twitch.tv",
                        "description": "Live streaming platform primarily for video games and entertainment"
                    },
                    {
                        "uuid": "b464ee26-9449-4d74-8a4c-e49b66ee25a8",
                        "title": "Tumblr",
                        "link": "https://www.tumblr.com",
                        "description": "Microblogging and social networking platform"
                    },
                    {
                        "uuid": "318d6793-4843-4703-9eca-d5f96ff0160e",
                        "link": "https://www.whatsapp.com",
                        "description": "Cross-platform messaging and voice-over-IP service"
                    },
                    {
                        "uuid": "9193a681-0fda-49bb-95cc-843d4b5699cc",
                        "title": "Telegram",
                        "link": "https://web.telegram.org",
                        "description": "Cloud-based instant messaging service with encryption"
                    },
                    {
                        "uuid": "a0134524-ecb9-49bf-853f-9db05d2ecafd",
                        "title": "Flickr",
                        "link": "https://www.flickr.com",
                        "description": "Photo sharing platform for photographers and image enthusiasts"
                    },
                    {
                        "uuid": "fb4d0021-21a1-45d4-bd09-201fd2510343",
                        "title": "Vimeo",
                        "link": "https://vimeo.com",
                        "description": "Video hosting platform focused on creative and professional content"
                    },
                    {
                        "uuid": "a69279c9-9970-40f2-8647-0b509d8acf99",
                        "title": "Medium",
                        "link": "https://medium.com",
                        "description": "Blogging platform for writers and readers of long-form content"
                    },
                    {
                        "uuid": "6362efcc-5024-45d3-af3d-6d9282407bcd",
                        "title": "Quora",
                        "link": "https://www.quora.com",
                        "description": "Question-and-answer platform for knowledge sharing"
                    },
                    {
                        "uuid": "0ce2eeaa-61b8-47ef-8adc-0f43ffc5187e",
                        "title": "Meetup",
                        "link": "https://www.meetup.com",
                        "description": "Platform for organizing and finding local group meetings"
                    },
                    {
                        "uuid": "a5174026-ec9e-49ea-a471-f4a23084f636",
                        "title": "Nextdoor",
                        "link": "https://nextdoor.com",
                        "description": "Social networking service for neighborhoods and local communities"
                    }
                ]
            },
            {
                "type": "list",
                "title": "AI websites",
                "uuid": "44615cd1-4984-4430-8a19-49f04c0cf98a",
                "children": [
                    {
                        "uuid": "950dec5e-6835-4d44-bdd0-84f4b3cd402f",
                        "title": "OpenAI",
                        "link": "https://openai.com",
                        "description": "Artificial intelligence research laboratory creating advanced AI models"
                    },
                    {
                        "uuid": "3a5fedb2-2936-4c96-afd9-9cd9477096ea",
                        "title": "Anthropic",
                        "link": "https://anthropic.com",
                        "description": "AI safety and research company developing constitutional AI"
                    },
                    {
                        "uuid": "0739b0a3-dea3-4113-8502-8b6c09bc4a9a",
                        "title": "Google AI",
                        "link": "https://ai.google",
                        "description": "Google's artificial intelligence research and products division"
                    },
                    {
                        "uuid": "c1941dcb-86c9-4953-9135-f93fd1770ba7",
                        "title": "Hugging Face",
                        "link": "https://huggingface.co",
                        "description": "Platform for machine learning and AI model sharing"
                    },
                    {
                        "uuid": "7814458f-8e54-43e7-bdc4-9e4dea4884a5",
                        "title": "DeepMind",
                        "link": "https://deepmind.com",
                        "description": "AI company developing general-purpose learning algorithms"
                    },
                    {
                        "uuid": "c048584c-bac7-487b-91a4-17d808895cf6",
                        "title": "Cohere",
                        "link": "https://cohere.ai",
                        "description": "AI company providing natural language processing tools"
                    },
                    {
                        "uuid": "8b620f33-79e2-41e6-a818-5f7d8f58662d",
                        "title": "Stability AI",
                        "link": "https://stability.ai",
                        "description": "Company focused on generative AI models and tools"
                    },
                    {
                        "uuid": "ccaa9ffc-cdbc-4f48-a8b1-475127b01a38",
                        "title": "Papers With Code",
                        "link": "https://paperswithcode.com",
                        "description": "Repository of AI research papers with code implementations"
                    },
                    {
                        "uuid": "46f63f84-d174-4ed9-9b4d-c4ff86e7f157",
                        "title": "EleutherAI",
                        "link": "https://www.eleuther.ai",
                        "description": "Open source AI research organization creating large language models"
                    },
                    {
                        "uuid": "5abed708-8fcf-46d3-a34f-a3001e5b76c4",
                        "title": "AI21 Labs",
                        "link": "https://www.ai21.com",
                        "description": "Israeli AI company developing advanced language models"
                    }
                ]
            }
        ]
    },
    {
        "type": "thread",
        "title": "Downloads",
        "uuid": "9b37f77a-9ef0-4add-ae82-bc3e71dd1ae2",
        "children": [
            {
                "type": "list",
                "title": "Favorite",
                "uuid": "4b38a0fa-911d-4806-a7fb-0584c3dbe54b",
                "children": [
                    {
                        "title": "Google",
                        "link": "https://www.google.com",
                        "description": "Google",
                        "uuid": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8"
                    },
                    {
                        "title": "DuckDuckGo",
                        "link": "https://duckduckgo.com",
                        "description": "DuckDuckGo",
                        "uuid": "b2c3d4e5-f6g7-8901-h2i3-j4k5l6m7n8o9"
                    },
                    {
                        "title": "X/Twitter",
                        "link": "https://x.com",
                        "description": "X/Twitter",
                        "uuid": "c3d4e5f6-g7h8-9012-i3j4-k5l6m7n8o9p0"
                    },
                    {
                        "title": "Facebook",
                        "link": "https://www.facebook.com",
                        "description": "Facebook",
                        "uuid": "d4e5f6g7-h8i9-0123-j4k5-l6m7n8o9p0q1"
                    },
                    {
                        "title": "YouTube",
                        "link": "https://www.youtube.com",
                        "description": "The leading video-sharing platform where users can watch, upload, and stream videos.",
                        "uuid": "e5f6g7h8-i9j0-1234-k5l6-m7n8o9p0q1r2"
                    },
                    {
                        "title": "GitHub",
                        "link": "https://github.com",
                        "description": "A platform for developers to host, review, and manage code repositories using Git version control.",
                        "uuid": "f6g7h8i9-j0k1-2345-l6m7-n8o9p0q1r2s3"
                    },
                    {
                        "title": "Instagram",
                        "link": "https://www.instagram.com",
                        "description": "A photo and video sharing app focused on visual storytelling and social interaction.",
                        "uuid": "g7h8i9j0-k1l2-3456-m7n8-o9p0q1r2s3t4"
                    },
                    {
                        "title": "Reddit",
                        "link": "https://www.reddit.com",
                        "description": "A community-driven content aggregation and discussion website organized into topic-based subreddits.",
                        "uuid": "h8i9j0k1-l2m3-4567-n8o9-p0q1r2s3t4u5"
                    },
                    {
                        "title": "Academia",
                        "link": "https://www.academia.edu",
                        "description": "A platform for academics to share research papers, monitor their impact, and follow research interests.",
                        "uuid": "i9j0k1l2-m3n4-5678-o9p0-q1r2s3t4u5v6"
                    },
                    {
                        "title": "LinkedIn",
                        "link": "https://www.linkedin.com",
                        "description": "A professional networking site for career development, job searching, and business connections.",
                        "uuid": "j0k1l2m3-n4o5-6789-p0q1-r2s3t4u5v6w7"
                    },
                    {
                        "title": "Twitch",
                        "link": "https://www.twitch.tv",
                        "description": "A live streaming platform primarily focused on video game streaming, esports, and creative content.",
                        "uuid": "k1l2m3n4-o5p6-7890-q1r2-s3t4u5v6w7x8"
                    },
                    {
                        "title": "Bluesky",
                        "link": "https://bsky.app",
                        "description": "A decentralized social network offering an alternative to traditional platforms with user-controlled identity.",
                        "uuid": "l2m3n4o5-p6q7-8901-r2s3-t4u5v6w7x8y9"
                    },
                    {
                        "title": "ChatGPT",
                        "link": "https://chatgpt.com",
                        "description": "An AI-powered conversational assistant developed by OpenAI for answering questions and generating text.",
                        "uuid": "m3n4o5p6-q7r8-9012-s3t4-u5v6w7x8y9z0"
                    },
                    {
                        "title": "Gemini",
                        "link": "https://gemini.google.com/app",
                        "description": "Google's advanced AI assistant capable of understanding and generating natural language responses.",
                        "uuid": "n4o5p6q7-r8s9-0123-t4u5-v6w7x8y9z0a1"
                    },
                    {
                        "title": "Google AI Studio",
                        "link": "https://aistudio.google.com",
                        "description": "A tool from Google for experimenting with and building applications using generative AI models.",
                        "uuid": "o5p6q7r8-s9t0-1234-u5v6-w7x8y9z0a1b2"
                    },
                    {
                        "title": "DeepSeek (chinese AI)",
                        "link": "https://chat.deepseek.com",
                        "description": "A Chinese AI company developing large language models for various applications in Chinese and English.",
                        "uuid": "p6q7r8s9-t0u1-2345-v6w7-x8y9z0a1b2c3"
                    },
                    {
                        "title": "Claude",
                        "link": "https://claude.ai",
                        "description": "An AI assistant developed by Anthropic, designed to be helpful, harmless, and honest in conversations.",
                        "uuid": "q7r8s9t0-u1v2-3456-w7x8-y9z0a1b2c3d4"
                    },
                    {
                        "title": "Microsoft Copilot",
                        "link": "https://copilot.microsoft.com",
                        "description": "Microsoft's AI companion powered by GPT models, integrated into Windows and Microsoft 365 apps.",
                        "uuid": "r8s9t0u1-v2w3-4567-x8y9-z0a1b2c3d4e5"
                    },
                    {
                        "title": "NotebookLM",
                        "link": "https://notebooklm.google.com",
                        "description": "Google's AI-powered note-taking assistant that helps organize, summarize, and generate insights from your notes.",
                        "uuid": "s9t0u1v2-w3x4-5678-y9z0-a1b2c3d4e5f6"
                    },
                    {
                        "title": "Perplexity",
                        "link": "https://www.perplexity.ai",
                        "description": "An AI-powered answer engine that provides sourced, up-to-date information through conversational queries.",
                        "uuid": "t0u1v2w3-x4y5-6789-z0a1-b2c3d4e5f6g7"
                    },
                    {
                        "title": "Liner",
                        "link": "https://getliner.ai/main",
                        "description": "An AI tool for highlighting, summarizing, and organizing key information from articles and documents.",
                        "uuid": "u1v2w3x4-y5z6-7890-a1b2-c3d4e5f6g7h8"
                    },
                    {
                        "title": "LM Arena",
                        "link": "https://lmarena.com",
                        "description": "A platform for comparing and benchmarking different large language models through head-to-head evaluations.",
                        "uuid": "v2w3x4y5-z6a7-8901-b2c3-d4e5f6g7h8i9"
                    },
                    {
                        "title": "Substack",
                        "link": "https://substack.com/home",
                        "description": "A platform for writers to publish newsletters and build audiences directly, often monetized through subscriptions.",
                        "uuid": "w3x4y5z6-a7b8-9012-c3d4-e5f6g7h8i9j0"
                    },
                    {
                        "title": "Qwen",
                        "link": "https://chat.qwen.ai",
                        "description": "A series of large language models developed by Alibaba, offering capabilities in multiple languages and domains.",
                        "uuid": "x4y5z6a7-b8c9-0123-d4e5-f6g7h8i9j0k1"
                    },
                    {
                        "title": "Genspark",
                        "link": "https://www.genspark.ai",
                        "description": "An AI-powered search engine that generates concise answers and summaries from web content.",
                        "uuid": "y5z6a7b8-c9d0-1234-e5f6-g7h8i9j0k1l2"
                    },
                    {
                        "title": "Grok",
                        "link": "https://grok.com",
                        "description": "An AI chatbot developed by xAI, designed to answer questions with a humorous and rebellious personality.",
                        "uuid": "z6a7b8c9-d0e1-2345-f6g7-h8i9j0k1l2m3"
                    },
                    {
                        "title": "Kimi AI",
                        "link": "https://www.kimi.com",
                        "description": "A powerful AI assistant developed by Moonshot AI, capable of handling long context and complex reasoning tasks.",
                        "uuid": "a7b8c9d0-e1f2-3456-g7h8-i9j0k1l2m3n4"
                    },
                    {
                        "title": "GLM-4.5 (Z.ai)",
                        "link": "https://chat.z.ai",
                        "description": "A series of large language models developed by Zhipu AI, known for strong performance in Chinese and multilingual tasks.",
                        "uuid": "b8c9d0e1-f2g3-4567-h8i9-j0k1l2m3n4o5"
                    },
                    {
                        "title": "SkyWork",
                        "link": "https://skywork.com",
                        "description": "An AI platform offering tools and services for businesses to integrate artificial intelligence into workflows.",
                        "uuid": "c9d0e1f2-g3h4-5678-i9j0-k1l2m3n4o5p6"
                    },
                    {
                        "title": "Manus",
                        "link": "https://manus.im/app",
                        "description": "An AI research platform focusing on cutting-edge developments and analysis in the field of artificial intelligence.",
                        "uuid": "d0e1f2g3-h4i5-6789-j0k1-l2m3n4o5p6q7"
                    }
                ]
            },
            {
                "type": "list",
                "title": "Books",
                "uuid": "ccbed686-8175-426b-9ea9-1b8c06ccbe8d",
                "children": [
                    {
                        "uuid": "d41b3a86-28c1-46e0-a938-b096e2749fab",
                        "title": "PubMed",
                        "link": "https://pubmed.ncbi.nlm.nih.gov",
                        "description": "Database of biomedical literature maintained by the National Library of Medicine"
                    },
                    {
                        "uuid": "b6ae2786-41a6-4198-a968-567077a91056",
                        "title": "Library Genesis",
                        "link": "https://libgen.li",
                        "description": "very good books",
                        "children": [
                            {
                                "uuid": "cca19b39-3fc9-472a-8ea5-358d083bf56d",
                                "title": "sci-hub",
                                "link": "https://sci-hub.li",
                                "description": "scientific journals"
                            },
                            {
                                "uuid": "fe61b1fa-a493-495b-a364-2ae478efec98",
                                "title": "sci-hub",
                                "link": "https://sci-hub.ru",
                                "description": "scientific journals. russian version"
                            },
                            {
                                "uuid": "68095b15-9a49-4b07-a7a8-8767e27337c2",
                                "title": "welib",
                                "link": "https://welib.org",
                                "description": "books and scientific journals"
                            },
                            {
                                "uuid": "338082a7-e487-4a77-87ce-ea748dc763e8",
                                "title": "welib",
                                "link": "https://libgen.st",
                                "description": "books"
                            }
                        ],
                        "type": "list"
                    },
                    {
                        "uuid": "8ab62ce0-4441-42f3-bb6f-e37285ed9aa3",
                        "title": "Google Scholar",
                        "link": "https://scholar.google.com",
                        "description": "Academic search engine indexing scholarly literature across various disciplines",
                        "children": [
                            {
                                "uuid": "e0031137-9ed1-44b9-a0c7-7192b7d0c3d2",
                                "title": "sci-hub",
                                "link": "https://sci-hub.li",
                                "description": "scientific journals"
                            },
                            {
                                "uuid": "ebe2be5b-d188-4d77-b257-4c3c22a4823d",
                                "title": "sci-hub",
                                "link": "https://sci-hub.ru",
                                "description": "scientific journals. russian version"
                            },
                            {
                                "uuid": "c8cba4b7-671d-4801-9106-14c5725c96ac",
                                "title": "welib",
                                "link": "https://welib.org",
                                "description": "books and scientific journals"
                            },
                            {
                                "uuid": "3198b6d9-20ba-4f41-9c99-f638ccf51dfe",
                                "title": "welib",
                                "link": "https://libgen.st",
                                "description": "books"
                            }
                        ],
                        "type": "list"
                    },
                    {
                        "uuid": "4b6fa328-fd95-4396-a135-bc30cf802964",
                        "title": "JSTOR",
                        "link": "https://www.jstor.org",
                        "description": "Digital library for academic journals, books, and primary sources"
                    },
                    {
                        "uuid": "f6b54ed3-f434-496f-a257-1b3f7fa2d8e9",
                        "title": "ScienceDirect",
                        "link": "https://www.sciencedirect.com",
                        "description": "Platform for scientific and medical research publications by Elsevier"
                    },
                    {
                        "uuid": "bc4fb9f2-8009-4765-aaa5-cec24216c75c",
                        "title": "IEEE Xplore",
                        "link": "https://ieeexplore.ieee.org",
                        "description": "Digital library for technical literature in engineering and computer science"
                    },
                    {
                        "uuid": "45429877-b4b6-4a94-af1a-6b4c863a38ee",
                        "title": "SpringerLink",
                        "link": "https://link.springer.com",
                        "description": "Platform for scientific, technical, and medical content by Springer"
                    },
                    {
                        "uuid": "4144c5b4-b33c-4f08-bca9-37dc8511c101",
                        "title": "Wiley Online Library",
                        "link": "https://onlinelibrary.wiley.com",
                        "description": "Platform for scientific, technical, medical, and scholarly research"
                    },
                    {
                        "uuid": "5ce9d45e-adc1-4601-bc9c-9f4a32f31215",
                        "title": "Taylor & Francis Online",
                        "link": "https://www.tandfonline.com",
                        "description": "Platform for academic research journals and books across various disciplines"
                    }
                ]
            }
        ]
    }
];

const defaultData = [
    {
        "type": "thread",
        "title": "Default",
        "uuid": "a4ed5f49-b269-4afb-bbcd-8d9de2331f01",
        "children": [
            {
                "type": "list",
                "title": "Websites",
                "uuid": "e458f79b-6678-4aec-9b31-6b0f5313b40b",
                "children": [
                    {
                        "title": "Google",
                        "link": "https://google.com",
                        "description": "Search Engine",
                        "uuid": "9a673c01-a2ef-493b-b7cf-3eacf90a88d8"
                    },
                    {
                        "title": "Facebook",
                        "link": "https://www.facebook.com",
                        "description": "Global social networking platform for connecting with friends and sharing content.",
                        "uuid": "60bf75fd-75b0-46fe-b5f2-3034de1000c8"
                    },
                    {
                        "title": "YouTube",
                        "link": "https://www.youtube.com",
                        "description": "Video sharing platform for uploading, watching, and streaming videos.",
                        "uuid": "38dc657e-79d1-4ed7-84ca-bd891e78ce9a"
                    },
                    {
                        "title": "Reddit",
                        "link": "https://www.reddit.com",
                        "description": "Community-based platform for discussions, news, and memes.",
                        "uuid": "5f1c679c-e152-47ec-8100-566965c18540"
                    }
                ]
            }
        ]
    }
];
