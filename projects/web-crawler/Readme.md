# COMP4321 Crawler

COMP4321 Crawler is a web crawler project developed as part of the COMP4321 Information Retrieval course. It aims to provide basic web crawling and indexing functionalities, along with a simple search engine interface.

## Overview

COMP4321 Crawler is an ongoing project focused on building a web crawler and search engine using Java. The project consists of four main functions:

1. **Spider Function**: Fetches pages recursively from a given website.
2. **Indexer**: Extracts keywords from a page and inserts them into an inverted file.
3. **Retrieval Function**: Compares a list of query terms against the inverted file and returns the top documents, up to a maximum of 50, to the user in a ranked order according to the vector space model. Supports phrase queries, e.g., "hong kong universities".
4. **Web Interface**: Accepts a user query in a text box, submits the query to the search engine, and displays the returned results to the user.

## Key Features

- **Web Crawling**: Fetches pages from the web recursively.
- **Keyword Indexing**: Extracts and indexes keywords from web pages.
- **Vector Space Model**: Ranks documents based on relevance to user queries.
- **Simple Web Interface**: Allows users to input queries and view search results.

## Technology Stack

- **Programming Language**: Java
- **OpenJDK Version**: 21.0.2

## Usage

The project is still under development and may not be fully functional. To run the project, ensure you have OpenJDK version 21.0.2 installed on your system. Further instructions on how to compile and run the project will be provided once it reaches a more stable state.

## Repository

Find the source code and additional information in the [COMP4321-Crawler GitHub repository](https://github.com/tonyctyy/COMP4321-Crawler).

## License

This project is open-source and available under the [MIT License](LICENSE).
