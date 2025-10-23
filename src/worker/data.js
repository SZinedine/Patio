


const news_obj = [
    { "title": "BBC News", "link": "https://www.bbc.com/news", "description": "UK-based global news organization delivering trusted world and local coverage." },
    { "title": "CNN", "link": "https://www.cnn.com", "description": "American news network offering 24-hour breaking news and analysis." },
    { "title": "The New York Times", "link": "https://www.nytimes.com", "description": "Prominent US newspaper providing in-depth journalism and global news." },
    { "title": "The Guardian", "link": "https://www.theguardian.com", "description": "British newspaper known for independent reporting and investigative work." },
    { "title": "Reuters", "link": "https://www.reuters.com", "description": "Global news agency providing accurate and unbiased news coverage." },
    { "title": "Al Jazeera", "link": "https://www.aljazeera.com", "description": "Qatar-based international news organization covering world affairs." },
    { "title": "The Washington Post", "link": "https://www.washingtonpost.com", "description": "US newspaper recognized for investigative journalism and political coverage." },
    { "title": "El País", "link": "https://elpais.com", "description": "Spanish newspaper offering national, European, and world news coverage." },
    { "title": "China Daily", "link": "https://www.chinadaily.com.cn", "description": "China’s leading English-language newspaper focused on national and world affairs." },
    { "title": "The Independent", "link": "https://www.independent.co.uk", "description": "UK online newspaper known for independent and progressive journalism." },
    { "title": "USA Today", "link": "https://www.usatoday.com", "description": "American daily covering national, sports, and lifestyle news." },
    { "title": "The Sydney Morning Herald", "link": "https://www.smh.com.au", "description": "Australia’s major newspaper offering news, analysis, and commentary." }
]

const social_media_obj = [
    { "title": "Facebook", "link": "https://www.facebook.com", "description": "Global social networking platform for connecting with friends and sharing content." },
    { "title": "YouTube", "link": "https://www.youtube.com", "description": "Video sharing platform for uploading, watching, and streaming videos." },
    { "title": "Instagram", "link": "https://www.instagram.com", "description": "Photo and video sharing app focused on lifestyle, creativity, and influencers." },
    { "title": "TikTok", "link": "https://www.tiktok.com", "description": "Short-form video platform for entertainment and viral trends." },
    { "title": "X (Twitter)", "link": "https://www.twitter.com", "description": "Microblogging platform for real-time updates, opinions, and news." },
    { "title": "LinkedIn", "link": "https://www.linkedin.com", "description": "Professional networking site for business connections and career development." },
    { "title": "Snapchat", "link": "https://www.snapchat.com", "description": "Multimedia messaging app for sharing temporary photos and videos." },
    { "title": "Reddit", "link": "https://www.reddit.com", "description": "Community-based platform for discussions, news, and memes." },
    { "title": "Pinterest", "link": "https://www.pinterest.com", "description": "Visual discovery platform for sharing ideas, designs, and inspiration." },
    { "title": "Tumblr", "link": "https://www.tumblr.com", "description": "Microblogging and social networking site for creative content and communities." },
    { "title": "Threads", "link": "https://www.threads.net", "description": "Meta’s text-based social platform linked with Instagram for conversations and posts." },
    { "title": "Weibo", "link": "https://www.weibo.com", "description": "Chinese microblogging platform similar to Twitter with massive user base." },
    { "title": "VK", "link": "https://www.vk.com", "description": "Russian social media platform offering messaging, media sharing, and communities." },
    { "title": "Quora", "link": "https://www.quora.com", "description": "Q&A platform where users share knowledge and insights." },
    { "title": "Discord", "link": "https://www.discord.com", "description": "Community chat platform for voice, video, and text communication." },
    { "title": "Twitch", "link": "https://www.twitch.tv", "description": "Live streaming platform for gaming, entertainment, and creative content." },
    { "title": "Telegram", "link": "https://www.telegram.org", "description": "Messaging app with encrypted communication and large group channels." },
    { "title": "Mastodon", "link": "https://www.joinmastodon.org", "description": "Decentralized social network offering open-source microblogging." },
    { "title": "LINE", "link": "https://line.me", "description": "Japanese messaging and social media platform offering calls and posts." },
    { "title": "KakaoTalk", "link": "https://www.kakaocorp.com/service/KakaoTalk", "description": "South Korean messaging app combining chat, media, and games." }
]

const ai_obj = [
    { "title": "ChatGPT", "link": "https://chat.openai.com", "description": "AI chatbot developed by OpenAI for conversation and assistance." },
    { "title": "Claude", "link": "https://claude.ai", "description": "Anthropic’s conversational AI designed for reasoning and safety." },
    { "title": "Gemini", "link": "https://gemini.google.com", "description": "Google’s AI assistant integrated with its ecosystem of services." },
    { "title": "Perplexity", "link": "https://www.perplexity.ai", "description": "AI search engine combining conversational answers with citations." },
    { "title": "Hugging Face", "link": "https://huggingface.co", "description": "Platform for sharing and hosting machine learning models and datasets." },
    { "title": "Cohere", "link": "https://cohere.com", "description": "Company providing NLP models and APIs for enterprise applications." },
    { "title": "Runway", "link": "https://runwayml.com", "description": "AI-powered creative suite for video and image editing." },
    { "title": "Midjourney", "link": "https://www.midjourney.com", "description": "AI system that generates images from natural language prompts." },
    { "title": "Stability AI", "link": "https://stability.ai", "description": "Company behind Stable Diffusion, focusing on open AI model development." },
    { "title": "Anthropic", "link": "https://www.anthropic.com", "description": "AI safety and research company that created the Claude assistant." }
]

const books_obj = [
    {
        "title": "Library Genesis", "link": "https://libgen.li", "description": "very good books", "children": [
            { "title": "sci-hub", "link": "https://sci-hub.li", "description": "scientific journals" },
            { "title": "sci-hub", "link": "https://sci-hub.ru", "description": "scientific journals. russian version" },
            { "title": "welib", "link": "https://welib.org", "description": "books and scientific journals" },
            { "title": "welib", "link": "https://libgen.st", "description": "books" },
        ]
    },
    { "title": "arXiv", "link": "https://arxiv.org", "description": "Preprint repository for physics, math, CS, and related fields." },
    { "title": "PubMed Central", "link": "https://www.ncbi.nlm.nih.gov/pmc", "description": "Free archive of biomedical and life sciences journal literature." },
    { "title": "DOAJ", "link": "https://doaj.org", "description": "Directory of open access journals across all disciplines." },
    { "title": "Project Gutenberg", "link": "https://www.gutenberg.org", "description": "Free public-domain ebooks and literary works." },
    { "title": "Internet Archive", "link": "https://archive.org", "description": "Digital library offering books, audio, video, and web archives." },
    { "title": "CORE", "link": "https://core.ac.uk", "description": "Aggregator of open access research papers from repositories and journals." },
    { "title": "DOAB", "link": "https://www.doabooks.org", "description": "Directory of Open Access Books offering scholarly ebooks." },
    { "title": "OAPEN", "link": "https://www.oapen.org", "description": "Open access academic books in humanities and social sciences." },
    { "title": "HathiTrust", "link": "https://www.hathitrust.org", "description": "Partnership of academic & research institutions offering digitized content." },
    { "title": "Open Library", "link": "https://openlibrary.org", "description": "Catalog of books with many public-domain and lendable digital copies." },
    { "title": "BASE", "link": "https://base-search.net", "description": "Bielefeld Academic Search Engine indexing open access repositories." },
    { "title": "Semantic Scholar", "link": "https://www.semanticscholar.org", "description": "AI-powered research paper search with many open-access links." },
    { "title": "Europe PMC", "link": "https://europepmc.org", "description": "Repository of life sciences literature and preprints." },
    { "title": "bioRxiv", "link": "https://www.biorxiv.org", "description": "Preprint server for biology research." },
    { "title": "chemRxiv", "link": "https://chemrxiv.org", "description": "Preprint server for chemistry research." },
    { "title": "SSRN (open papers)", "link": "https://www.ssrn.com", "description": "Repository for social science and humanities working papers; many are open access." },
    { "title": "JSTOR Open Content", "link": "https://about.jstor.org/oa-and-free", "description": "Collection of free and open content from JSTOR." },
    { "title": "National Academies Press", "link": "https://www.nap.edu", "description": "Free PDFs of many U.S. National Academies reports and books." },
    { "title": "OpenStax", "link": "https://openstax.org", "description": "Free, peer-reviewed open textbooks for college courses." },
    { "title": "OpenDOAR", "link": "https://v2.sherpa.ac.uk/view/repository_visualisations/feeds", "description": "Directory of global open access repositories and services." }
]


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
                "children": news_obj,
            },
            {
                "type": "list",
                "title": "Social Media",
                "uuid": "a1b913c1-88c0-42b7-818b-491e1527f945",
                "children": social_media_obj,
            },
            {
                "type": "list",
                "title": "AI websites",
                "uuid": "44615cd1-4984-4430-8a19-49f04c0cf98a",
                "children": ai_obj,
            },
        ],
    },
    {
        "type": "thread",
        "title": "Downloads",
        "uuid": "9b37f77a-9ef0-4add-ae82-bc3e71dd1ae2",
        "children": [
            {
                "type": "list",
                "title": "Books",
                "uuid": "ccbed686-8175-426b-9ea9-1b8c06ccbe8d",
                "children": books_obj,
            }
        ],
    },
]


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
                    { "title": "Google", "link": "https://google.com", "description": "Search Engine", "uuid": "9a673c01-a2ef-493b-b7cf-3eacf90a88d8" },
                    { "title": "Facebook", "link": "https://www.facebook.com", "description": "Global social networking platform for connecting with friends and sharing content.", "uuid": "60bf75fd-75b0-46fe-b5f2-3034de1000c8" },
                    { "title": "YouTube", "link": "https://www.youtube.com", "description": "Video sharing platform for uploading, watching, and streaming videos.", "uuid": "38dc657e-79d1-4ed7-84ca-bd891e78ce9a" },
                    { "title": "Reddit", "link": "https://www.reddit.com", "description": "Community-based platform for discussions, news, and memes.", "uuid": "5f1c679c-e152-47ec-8100-566965c18540" },

                ],
            },
        ],
    },
]

