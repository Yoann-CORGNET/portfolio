import { Project } from "@/types/project";

export const projects: Project[] = [
  {
    name: "Undrive",
    slug: "undrive",
    tagline: "Gamification des transports en commun",
    highlight: "Projet 4A - Architecture backend complète",
    status: "En développement",
    period: "Sept. 2025 - Fév. 2026",
    github: "#",
    demo: "#",

    // Story telling
    context: "Projet de 4e année à l'ESIEA",
    description:
      "Undrive est une application mobile innovante qui utilise la gamification pour encourager l'utilisation des transports en commun. L'objectif est de réduire l'empreinte carbone en rendant les trajets en transport public plus engageants et gratifiants.",
    problem: {
      title: "Le problème",
      small: "Faible adoption des transports en commun par manque de motivation",
      content:
        "Malgré les avantages environnementaux des transports en commun, leur adoption reste faible en raison du manque de motivation et d'engagement des utilisateurs. Les solutions existantes ne proposent pas d'incitation suffisante pour changer les habitudes de déplacement.",
    },
    solution: {
      title: "La solution",
      small:
        "Application mobile de gamification avec système de récompenses pour encourager l'usage des transports",
      content:
        "Undrive transforme chaque trajet en transport en commun en une expérience ludique avec un système de points, de récompenses et de défis. L'application utilise la géolocalisation pour tracker les trajets et récompenser les utilisateurs avec des avantages réels.",
    },
    impact: "API Django complète avec microservices Python, CI/CD automatisée et déploiement GCP",

    // Tech
    technicalDetails: {
      title: "Architecture technique",
      content:
        "Le projet repose sur une architecture microservices complète avec un backend Django robuste et une application mobile Flutter cross-platform. L'infrastructure est déployée sur Google Cloud Platform avec une CI/CD automatisée.",
      highlights: [
        "API RESTful Django avec Django REST Framework",
        "Microservices Python pour le traitement des données de géolocalisation",
        "Base de données PostgreSQL avec extension PostGIS pour les données spatiales",
        "Application mobile Flutter pour iOS et Android",
        "Pipeline CI/CD avec GitHub Actions",
        "Déploiement automatisé sur Google Cloud Platform",
        "Containerisation avec Docker et orchestration",
        "Tests unitaires et d'intégration automatisés",
      ],
    },
    features: [
      {
        name: "Système de points",
        description: "Gagnez des points à chaque trajet en transport en commun",
      },
      {
        name: "Défis quotidiens",
        description: "Relevez des défis pour multiplier vos récompenses",
      },
      {
        name: "Géolocalisation intelligente",
        description: "Détection automatique des trajets avec PostGIS",
      },
      {
        name: "Récompenses partenaires",
        description: "Échangez vos points contre des avantages réels",
      },
      {
        name: "Classements",
        description: "Comparez vos performances avec d'autres utilisateurs",
      },
      {
        name: "Statistiques environnementales",
        description: "Visualisez votre impact écologique",
      },
    ],
    stack: [
      { name: "Flutter", category: "Mobile" },
      { name: "Django", category: "Backend" },
      { name: "Python", category: "Backend" },
      { name: "PostgreSQL", category: "Database" },
      { name: "PostGIS", category: "Geolocation" },
      { name: "Docker", category: "DevOps" },
      { name: "GCP", category: "Cloud" },
      { name: "GitHub Actions", category: "CI/CD" },
    ],
    achievements: [
      "Architecture backend complète avec microservices",
      "Pipeline CI/CD automatisée de bout en bout",
      "Intégration de données géospatiales complexes",
      "Application mobile cross-platform performante",
    ],
  },
  {
    name: "StockElec",
    slug: "stockelec",
    tagline: "Gestion intelligente de stock électronique",
    highlight: "Médaille d'argent - Projet 2e année",
    status: "Complété - Médaille d'argent",
    period: "2023 - 2024",
    github: "#",
    demo: "#",

    // Story telling
    context: "Projet de 2e année à l'ESIEA",
    description:
      "StockElec est une application web complète de gestion de stock développée pour le laboratoire d'électronique de l'ESIEA. Le projet a remporté la médaille d'argent grâce à son interface intuitive et son architecture technique solide.",
    problem: {
      title: "Le problème",
      small: "Gestion manuelle et inefficace du stock du laboratoire d'électronique",
      content:
        "Le laboratoire d'électronique gérait son inventaire manuellement, entraînant des erreurs, des pertes de temps et une difficulté à suivre les composants disponibles. Il n'y avait pas de système centralisé pour gérer les emprunts et les retours de matériel.",
    },
    solution: {
      title: "La solution",
      small:
        "Application web de gestion de stock avec tableau analytique interactif et API RESTful",
      content:
        "StockElec offre une interface web moderne avec un tableau analytique interactif permettant de visualiser l'état du stock en temps réel, de gérer les emprunts, et d'automatiser les alertes de réapprovisionnement. Le système inclut une API RESTful complète pour des intégrations futures.",
    },
    impact: "Médaille d'argent - Développement en méthode agile avec recueil du besoin client",

    // Tech
    technicalDetails: {
      title: "Architecture technique",
      content:
        "L'application utilise une stack moderne avec Quasar/Vue.js pour le frontend et Spring Boot pour le backend. Le projet a été développé en méthode agile avec un recueil complet du besoin client auprès du laboratoire.",
      highlights: [
        "Frontend réactif avec Quasar Framework et Vue.js 3",
        "Styling moderne avec Tailwind CSS",
        "API RESTful Java Spring Boot",
        "Base de données MySQL avec modèle relationnel optimisé",
        "Authentification et gestion des rôles utilisateurs",
        "Tableau de bord analytique avec graphiques interactifs",
        "Système d'alertes automatiques",
        "Containerisation Docker pour le déploiement",
      ],
    },
    features: [
      {
        name: "Tableau de bord interactif",
        description: "Visualisez l'état du stock en temps réel avec des graphiques",
      },
      {
        name: "Gestion des emprunts",
        description: "Système complet de prêt et retour de matériel",
      },
      {
        name: "Alertes de stock",
        description: "Notifications automatiques pour les seuils bas",
      },
      {
        name: "Historique complet",
        description: "Traçabilité de tous les mouvements de stock",
      },
      {
        name: "Gestion multi-utilisateurs",
        description: "Différents niveaux d'accès selon les rôles",
      },
      {
        name: "Recherche avancée",
        description: "Filtrage et recherche rapide de composants",
      },
    ],
    stack: [
      { name: "Quasar", category: "Frontend" },
      { name: "Vue.js", category: "Frontend" },
      { name: "Tailwind CSS", category: "Styling" },
      { name: "Java Spring", category: "Backend" },
      { name: "MySQL", category: "Database" },
      { name: "Docker", category: "DevOps" },
    ],
    achievements: [
      "Médaille d'argent du projet de 2e année",
      "Développement en méthode agile avec sprints",
      "Recueil du besoin client et validation itérative",
      "Application déployée et utilisée par le laboratoire",
    ],
  },
];
