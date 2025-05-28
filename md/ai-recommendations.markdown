# AI for Personalized Content Recommendations

A sophisticated, multi-stage recommendation system developed using the Yelp dataset, engineered to deliver highly personalized business suggestions while overcoming critical challenges such as data sparsity, cold-start scenarios, and long-tail biases. This project represents a fusion of classical recommendation techniques and cutting-edge deep learning, deployed through a user-friendly web application.

---

## Introduction Video
[![AI for Personalized Content Recommendations](https://img.youtube.com/vi/HjFU1mshz1I/0.jpg)](https://youtu.be/HjFU1mshz1I)

For a detailed overview, please watch the introduction video linked above, which showcases the system's features and user experience.

---

## Project Overview

This project was undertaken as my Final Year Project (FYP) at the Hong Kong University of Science and Technology (HKUST) in 2024-25. The goal was to design and implement an advanced recommendation system capable of suggesting local businesses—such as restaurants, cafes, retail stores, and service providers—to Yelp users based on their preferences and behaviors. Unlike traditional recommendation systems, this solution was built to handle real-world complexities inherent in the Yelp dataset, which contains millions of user reviews, ratings, and business metadata.

The system adopts a multi-stage architecture, integrating retrieval and ranking phases to ensure both scalability and precision. It combines foundational techniques like collaborative filtering with state-of-the-art deep learning models, including the Deep Structured Semantic Model (DSSM) and Deep Factorization Machine (Deep FM). A web application was developed to bring the system to life, offering an interactive interface for users to explore personalized recommendations.

- **Dataset**: Yelp Open Dataset (over 6.9 million reviews, 150,000+ businesses, 1.2 million users)
- **Technologies Used**: Python (Pandas, NumPy, TensorFlow), Flask, React.js, SQLite, AWS
![System Components](./screenshots/ai-recommendation-system/system-component.jpg)
- **My Role**: System Design & Integration, Frontend Development, Documentation

---

## Significance of the Project

Recommendation systems are at the heart of modern digital platforms, driving user engagement and business growth. For Yelp, delivering accurate and diverse suggestions enhances user satisfaction and supports local businesses by increasing their visibility. This project stands out due to its focus on addressing three pervasive challenges in recommendation systems:

1. **Data Sparsity**: With a sparsity rate of 99.99% in the Yelp dataset (due to most users reviewing only a handful of businesses), traditional methods struggle to generate meaningful recommendations.
2. **Cold-Start Problem**: New users or businesses with limited interaction histories pose a significant hurdle for personalization.
3. **Long-Tail Biases**: Popular businesses tend to dominate recommendations, leaving niche or less-reviewed options underexposed.

By tackling these issues, the project not only demonstrates technical innovation but also aligns with real-world needs, making it a valuable addition to my portfolio.

---

## Methodology

The recommendation system is designed as a two-stage pipeline: **Retrieval** and **Ranking**. This modular approach ensures scalability (handling millions of candidates) and precision (delivering top-quality suggestions).
![Overview of Content Recommendation System](./screenshots/ai-recommendation-system/overview-content-recommendation.jpg)

The system implements various recommendation models. For instance, the Deep Structured Semantic Model (DSSM) used in the retrieval stage is a deep learning framework that maps users and businesses into a shared latent space, capturing semantic relationships and improving retrieval accuracy even in sparse datasets.
![DSSM Architecture](./screenshots/ai-recommendation-system/model-design-example.jpg)

---

## Demo Application

To demonstrate the system’s practical utility, I developed a web application deployed on AWS for scalability and reliability. Key features include:

- **Personalized Recommendations**: Users with sufficient review history receive tailored suggestions.
- **Fallback Options**: New or sparse users are shown recent popular items or category-based picks.
- **Interactive Interface**: Built with React.js, featuring a clean dashboard and real-time suggestion updates.

As shown in the introduction video above, here is the user journey of the demo application:
![User Journey of the Demo Application](./screenshots/ai-recommendation-system/user-flow-chart.jpg)

---

## My Contributions

As a core member of the three-person team, I played a pivotal role in shaping the project. My responsibilities included:
- **System Design & Integration**: 
  - Architected the multi-stage pipeline, ensuring seamless interaction between retrieval and ranking components.
  - Integrated diverse models (CF, DSSM, Deep FM) into a cohesive system using Python and TensorFlow.
- **Frontend Development**: 
  - Designed and implemented the React-based web app, focusing on responsiveness and user experience.
  - Connected the frontend to a Flask backend with SQLite for data management.
- **Report Writing & Documentation**: 
  - Authored a 40-page final report detailing methodology, results, and analyses.
  - Created visualizations (e.g., architecture diagrams, performance plots) to communicate findings effectively.

This project reflects my strengths in machine learning, software development, and problem-solving, as well as my passion for building user-centric solutions.

---

## Repository

[GitHub Repository](https://github.com/tonyctyy/content-recommendation)  
See the ![Final Report](./projects/ai-recommendations-report.pdf) for detailed methodology and results.

---

## License

This project is licensed under the MIT License.

---

## Future Work

Looking ahead, I plan to:
- Incorporate real-time user feedback to refine recommendations dynamically.
- Experiment with reinforcement learning to optimize long-term user engagement.
- Scale the system to handle larger datasets, such as Yelp’s full historical data.

---

This project not only deepened my technical expertise but also reinforced my commitment to solving impactful problems through AI and design. I’m excited to discuss how these skills can contribute to future opportunities!