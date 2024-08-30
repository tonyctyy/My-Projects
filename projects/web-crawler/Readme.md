# COMP4321-Crawler
COMP4321-Crawler is a web crawler and search engine project developed as part of the COMP4321 Information Retrieval course. The project focuses on building a functional search engine with a web crawler and indexing system, utilizing Java and Apache Tomcat.

## Overview
COMP4321-Crawler is designed to fetch, index, and retrieve web pages efficiently, featuring a web interface that allows users to search for information. The project implements essential components of a search engine, including a spider for web crawling, an indexer for keyword extraction, and a retrieval function that ranks results based on relevance.

### Key Features:
1. **Spider Function**: Recursively fetches pages from a given website.
2. **Indexer**: Extracts keywords from pages and inserts them into an inverted file.
3. **Retrieval Function**: Compares query terms against the inverted file and returns the top-ranked documents, supporting phrase queries.
4. **Web Interface**: Allows users to input queries, submit them to the search engine, and view ranked results.

## System Design
### Backend: Web Crawler and Indexer (Java)
- **Crawler**: Implements a Breadth-First Search (BFS) algorithm to explore and index web pages.
- **Indexer**: Handles text processing, including stop word removal, stemming, and n-gram extraction.
- **Database**: Stores indexed data in a structured format, using JDBM for efficient data retrieval.

### Frontend: Search Engine Interface (Apache Tomcat)
- **Search Engine**: Provides a simple, user-friendly interface for submitting queries and displaying results.
- **Result Ranking**: Employs a vector space model to rank results based on cosine similarity.

## Technology Stack
- **Programming Language**: Java
- **Frontend**: Apache Tomcat
- **Database**: JDBM
- **Java Version**: OpenJDK 21.0.2

## Installation
For detail information, please refer to the project [documentation](https://github.com/tonyctyy/COMP4321-Crawler/blob/main/docs/COMP4321%20Project%20Report.pdf).

## Screenshots
### Search Result
![Search Result](./screenshots/search-result.jpg)

### Advance Search with OR/AND Operator
![and-or-search](./screenshots/and-or-search.jpg)

### Keyword Table
![Keyword Table](./screenshots/keyword-table.jpg)

## Future Work
I am currently working on a larger and more advanced project focused on developing a **Content Recommendation System** using Python. This project aims to explore more sophisticated techniques in information retrieval and recommendation algorithms, applying them in real-world scenarios. The system will leverage various machine learning models and data-driven approaches to provide personalized content recommendations.

## Repository
Find the source code and additional information in the [COMP4321-Crawler GitHub repository](https://github.com/tonyctyy/COMP4321-Crawler).

## License
This project is open-source and available under the [MIT License](LICENSE).