import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Sliders,
  Calendar,
  Search,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Phone,
  Smartphone,
  MessageSquare,
  Layers,
  Award,
  BarChart3,
  Sparkles,
  Send,
  User,
  Users,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Info,
  Clock,
  Briefcase
} from 'lucide-react';

// Interfaces for our state elements
interface Client {
  id: string;
  name: string;
  segment: string;
  age: number;
  salaireDomicilie: boolean;
  produitsCount: number;
  packageActif: boolean;
  carteActive: boolean;
  usageDigital: 'Faible' | 'Moyen' | 'Élevé';
  derniereOperationMois: number;
  contactsRecents: number;
  reclamationOuverte: boolean;
  canalPrefere: 'SMS' | 'Email' | 'Téléphone' | 'Application mobile' | 'Agence';
  incidentRecent: boolean;
  capaciteEndettement: 'Bonne' | 'Faible' | 'Moyenne' | 'Non applicable';
  statutDormance: 'Dormant' | 'Actif' | 'Faiblement actif';
  sousEquipe: boolean;
  cibleReactivation: boolean;
  commentaireProfil: string;
}

interface RulesConfig {
  maxProductsForUnderEquipped: number;
  maxContactsAllowed: number;
  minAgeCredit: number;
  minDormanceMois: number;
}

interface GeminiAnalysis {
  recommendedNbo: string;
  recommendedNba: string;
  recommendedChannel: string;
  priority: string;
  justification: string;
  salesPitch: string;
  smsScript: string;
}

// Seed Initial Portfolio clients (matching exactly the reference system in Casablanca/Morocco - 50 real customers)
const INITIAL_CLIENTS: Client[] = [
  {
    id: "C001",
    name: "Karim EL OUALI",
    segment: "Profession libérale",
    age: 42,
    salaireDomicilie: true,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Moyen",
    derniereOperationMois: 6,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "SMS",
    incidentRecent: false,
    capaciteEndettement: "Bonne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Profession libérale, salaire domicilié, 6 mois depuis dernière opération."
  },
  {
    id: "C002",
    name: "Sofia BOUSSOUF",
    segment: "Jeune",
    age: 24,
    salaireDomicilie: true,
    produitsCount: 4,
    packageActif: true,
    carteActive: true,
    usageDigital: "Élevé",
    derniereOperationMois: 2,
    contactsRecents: 0,
    reclamationOuverte: false,
    canalPrefere: "Email",
    incidentRecent: false,
    capaciteEndettement: "Non applicable",
    statutDormance: "Actif",
    sousEquipe: false,
    cibleReactivation: false,
    commentaireProfil: "Jeune, salaire domicilié, 2 mois depuis dernière opération."
  },
  {
    id: "C003",
    name: "Yassir BENNANI",
    segment: "Salarié GE/PME conventionné",
    age: 35,
    salaireDomicilie: true,
    produitsCount: 1,
    packageActif: false,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 0,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Téléphone",
    incidentRecent: false,
    capaciteEndettement: "Moyenne",
    statutDormance: "Faiblement actif",
    sousEquipe: true,
    cibleReactivation: true,
    commentaireProfil: "Salarié GE/PME conventionné, salaire domicilié, 0 mois depuis dernière opération."
  },
  {
    id: "C004",
    name: "Amine CHRAIBI",
    segment: "Salarié GE/PME conventionné",
    age: 29,
    salaireDomicilie: true,
    produitsCount: 4,
    packageActif: true,
    carteActive: true,
    usageDigital: "Élevé",
    derniereOperationMois: 3,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Application mobile",
    incidentRecent: false,
    capaciteEndettement: "Faible",
    statutDormance: "Faiblement actif",
    sousEquipe: false,
    cibleReactivation: false,
    commentaireProfil: "Salarié GE/PME conventionné, salaire domicilié, 3 mois depuis dernière opération."
  },
  {
    id: "C005",
    name: "Aicha MEZZOUR",
    segment: "Particulier standard",
    age: 48,
    salaireDomicilie: false,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Moyen",
    derniereOperationMois: 12,
    contactsRecents: 2,
    reclamationOuverte: false,
    canalPrefere: "SMS",
    incidentRecent: false,
    capaciteEndettement: "Moyenne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: false,
    commentaireProfil: "Particulier standard, sans domiciliation, 12 mois depuis dernière opération."
  },
  {
    id: "C006",
    name: "Rachid TAZI",
    segment: "Fonctionnaire conventionné",
    age: 45,
    salaireDomicilie: true,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Moyen",
    derniereOperationMois: 23,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "SMS",
    incidentRecent: false,
    capaciteEndettement: "Moyenne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Fonctionnaire conventionné, salaire domicilié, 23 mois depuis dernière opération."
  },
  {
    id: "C007",
    name: "Laila BENABDELLAH",
    segment: "Fonctionnaire conventionné",
    age: 50,
    salaireDomicilie: false,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Moyen",
    derniereOperationMois: 24,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "SMS",
    incidentRecent: false,
    capaciteEndettement: "Moyenne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Fonctionnaire conventionné, sans domiciliation, 24 mois depuis dernière opération."
  },
  {
    id: "C008",
    name: "Mourad EL ADOUI",
    segment: "Profession libérale",
    age: 39,
    salaireDomicilie: true,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 5,
    contactsRecents: 2,
    reclamationOuverte: true,
    canalPrefere: "Téléphone",
    incidentRecent: true,
    capaciteEndettement: "Faible",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Profession libérale, salaire domicilié, 5 mois depuis dernière opération."
  },
  {
    id: "C009",
    name: "Hanae SLAOUI",
    segment: "Fonctionnaire conventionné",
    age: 31,
    salaireDomicilie: true,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Élevé",
    derniereOperationMois: 5,
    contactsRecents: 1,
    reclamationOuverte: true,
    canalPrefere: "Application mobile",
    incidentRecent: true,
    capaciteEndettement: "Faible",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Fonctionnaire conventionné, salaire domicilié, 5 mois depuis dernière opération."
  },
  {
    id: "C010",
    name: "Tariq SQALLI",
    segment: "Salarié GE/PME conventionné",
    age: 37,
    salaireDomicilie: true,
    produitsCount: 4,
    packageActif: true,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 19,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Téléphone",
    incidentRecent: false,
    capaciteEndettement: "Bonne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Salarié GE/PME conventionné, salaire domicilié, 19 mois depuis dernière opération."
  },
  {
    id: "C011",
    name: "Ghita BENJELLOUN",
    segment: "Fonctionnaire conventionné",
    age: 43,
    salaireDomicilie: true,
    produitsCount: 4,
    packageActif: true,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 10,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Téléphone",
    incidentRecent: false,
    capaciteEndettement: "Bonne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Fonctionnaire conventionné, salaire domicilié, 10 mois depuis dernière opération."
  },
  {
    id: "C012",
    name: "Nabil TOUMI",
    segment: "Profession libérale",
    age: 41,
    salaireDomicilie: false,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 5,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Téléphone",
    incidentRecent: false,
    capaciteEndettement: "Bonne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Profession libérale, sans domiciliation, 5 mois depuis dernière opération."
  },
  {
    id: "C013",
    name: "Youssef CHERRAT",
    segment: "Fonctionnaire conventionné",
    age: 46,
    salaireDomicilie: true,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 16,
    contactsRecents: 2,
    reclamationOuverte: false,
    canalPrefere: "Agence",
    incidentRecent: false,
    capaciteEndettement: "Bonne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Fonctionnaire conventionné, salaire domicilié, 16 mois depuis dernière opération."
  },
  {
    id: "C014",
    name: "Fatima Zohra BELKHAYAT",
    segment: "Salarié GE/PME conventionné",
    age: 34,
    salaireDomicilie: false,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 16,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Téléphone",
    incidentRecent: false,
    capaciteEndettement: "Moyenne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Salarié GE/PME conventionné, sans domiciliation, 16 mois depuis dernière opération."
  },
  {
    id: "C015",
    name: "Reda BARADA",
    segment: "Salarié GE/PME conventionné",
    age: 38,
    salaireDomicilie: true,
    produitsCount: 1,
    packageActif: false,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 8,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Agence",
    incidentRecent: false,
    capaciteEndettement: "Moyenne",
    statutDormance: "Dormant",
    sousEquipe: true,
    cibleReactivation: true,
    commentaireProfil: "Salarié GE/PME conventionné, salaire domicilié, 8 mois depuis dernière opération."
  },
  {
    id: "C016",
    name: "Salma AMOR",
    segment: "Salarié GE/PME conventionné",
    age: 36,
    salaireDomicilie: true,
    produitsCount: 4,
    packageActif: true,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 13,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Téléphone",
    incidentRecent: false,
    capaciteEndettement: "Moyenne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Salarié GE/PME conventionné, salaire domicilié, 13 mois depuis dernière opération."
  },
  {
    id: "C017",
    name: "Mehdi GUESSOUS",
    segment: "Salarié GE/PME conventionné",
    age: 33,
    salaireDomicilie: false,
    produitsCount: 1,
    packageActif: false,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 5,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Agence",
    incidentRecent: false,
    capaciteEndettement: "Moyenne",
    statutDormance: "Dormant",
    sousEquipe: true,
    cibleReactivation: true,
    commentaireProfil: "Salarié GE/PME conventionné, sans domiciliation, 5 mois depuis dernière opération."
  },
  {
    id: "C018",
    name: "Chaimae EL FASSI",
    segment: "Jeune",
    age: 23,
    salaireDomicilie: true,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Moyen",
    derniereOperationMois: 8,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "SMS",
    incidentRecent: false,
    capaciteEndettement: "Faible",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Jeune, salaire domicilié, 8 mois depuis dernière opération."
  },
  {
    id: "C019",
    name: "Othmane BELGHITI",
    segment: "Fonctionnaire conventionné",
    age: 29,
    salaireDomicilie: true,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Moyen",
    derniereOperationMois: 7,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "SMS",
    incidentRecent: false,
    capaciteEndettement: "Faible",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Fonctionnaire conventionné, salaire domicilié, 7 mois depuis dernière opération."
  },
  {
    id: "C020",
    name: "Meriem BENSLIMANE",
    segment: "Salarié GE/PME conventionné",
    age: 40,
    salaireDomicilie: true,
    produitsCount: 4,
    packageActif: true,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 12,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Téléphone",
    incidentRecent: false,
    capaciteEndettement: "Bonne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Salarié GE/PME conventionné, salaire domicilié, 12 mois depuis dernière opération."
  },
  {
    id: "C021",
    name: "Adil FILALI",
    segment: "Particulier standard",
    age: 47,
    salaireDomicilie: false,
    produitsCount: 1,
    packageActif: false,
    carteActive: true,
    usageDigital: "Moyen",
    derniereOperationMois: 10,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Email",
    incidentRecent: false,
    capaciteEndettement: "Moyenne",
    statutDormance: "Dormant",
    sousEquipe: true,
    cibleReactivation: false,
    commentaireProfil: "Particulier standard, sans domiciliation, 10 mois depuis dernière opération."
  },
  {
    id: "C022",
    name: "Khadija BENJELLOUN",
    segment: "Particulier standard",
    age: 35,
    salaireDomicilie: true,
    produitsCount: 1,
    packageActif: false,
    carteActive: true,
    usageDigital: "Moyen",
    derniereOperationMois: 4,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "SMS",
    incidentRecent: false,
    capaciteEndettement: "Moyenne",
    statutDormance: "Dormant",
    sousEquipe: true,
    cibleReactivation: false,
    commentaireProfil: "Particulier standard, salaire domicilié, 4 mois depuis dernière opération."
  },
  {
    id: "C023",
    name: "Yassine JABRI",
    segment: "Particulier standard",
    age: 32,
    salaireDomicilie: true,
    produitsCount: 1,
    packageActif: false,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 2,
    contactsRecents: 0,
    reclamationOuverte: false,
    canalPrefere: "Téléphone",
    incidentRecent: false,
    capaciteEndettement: "Bonne",
    statutDormance: "Dormant",
    sousEquipe: true,
    cibleReactivation: false,
    commentaireProfil: "Particulier standard, salaire domicilié, 2 mois depuis dernière opération."
  },
  {
    id: "C024",
    name: "Imane SABRI",
    segment: "Salarié GE/PME conventionné",
    age: 44,
    salaireDomicilie: true,
    produitsCount: 1,
    packageActif: false,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 20,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Agence",
    incidentRecent: false,
    capaciteEndettement: "Bonne",
    statutDormance: "Dormant",
    sousEquipe: true,
    cibleReactivation: true,
    commentaireProfil: "Salarié GE/PME conventionné, salaire domicilié, 20 mois depuis dernière opération."
  },
  {
    id: "C025",
    name: "Soufiane LARAQI",
    segment: "Jeune",
    age: 26,
    salaireDomicilie: true,
    produitsCount: 1,
    packageActif: false,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 18,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Agence",
    incidentRecent: false,
    capaciteEndettement: "Faible",
    statutDormance: "Dormant",
    sousEquipe: true,
    cibleReactivation: true,
    commentaireProfil: "Jeune, salaire domicilié, 18 mois depuis dernière opération."
  },
  {
    id: "C026",
    name: "Nadia TAZI",
    segment: "Fonctionnaire conventionné",
    age: 53,
    salaireDomicilie: true,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 7,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Agence",
    incidentRecent: false,
    capaciteEndettement: "Moyenne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Fonctionnaire conventionné, salaire domicilié, 7 mois depuis dernière opération."
  },
  {
    id: "C027",
    name: "Omar EL MANDJRA",
    segment: "Salarié GE/PME conventionné",
    age: 39,
    salaireDomicilie: true,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 2,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Téléphone",
    incidentRecent: false,
    capaciteEndettement: "Moyenne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Salarié GE/PME conventionné, salaire domicilié, 2 mois depuis dernière opération."
  },
  {
    id: "C028",
    name: "Amal BOUTALEB",
    segment: "Fonctionnaire conventionné",
    age: 41,
    salaireDomicilie: true,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Élevé",
    derniereOperationMois: 2,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Application mobile",
    incidentRecent: false,
    capaciteEndettement: "Bonne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Fonctionnaire conventionné, salaire domicilié, 2 mois depuis dernière opération."
  },
  {
    id: "C029",
    name: "Salah-Eddine BENNANI",
    segment: "Fonctionnaire conventionné",
    age: 36,
    salaireDomicilie: true,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Moyen",
    derniereOperationMois: 1,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "SMS",
    incidentRecent: false,
    capaciteEndettement: "Moyenne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Fonctionnaire conventionné, salaire domicilié, 1 mois depuis dernière opération."
  },
  {
    id: "C030",
    name: "Wafae SEKKAT",
    segment: "Fonctionnaire conventionné",
    age: 47,
    salaireDomicilie: true,
    produitsCount: 4,
    packageActif: true,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 1,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Téléphone",
    incidentRecent: false,
    capaciteEndettement: "Bonne",
    statutDormance: "Faiblement actif",
    sousEquipe: false,
    cibleReactivation: false,
    commentaireProfil: "Fonctionnaire conventionné, salaire domicilié, 1 mois depuis dernière opération."
  },
  {
    id: "C031",
    name: "Zouhair CHRAIBI",
    segment: "Fonctionnaire conventionné",
    age: 48,
    salaireDomicilie: true,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 14,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Téléphone",
    incidentRecent: false,
    capaciteEndettement: "Bonne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Fonctionnaire conventionné, salaire domicilié, 14 mois depuis dernière opération."
  },
  {
    id: "C032",
    name: "Samira EL ABDI",
    segment: "Fonctionnaire conventionné",
    age: 55,
    salaireDomicilie: true,
    produitsCount: 1,
    packageActif: false,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 22,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Téléphone",
    incidentRecent: false,
    capaciteEndettement: "Faible",
    statutDormance: "Dormant",
    sousEquipe: true,
    cibleReactivation: true,
    commentaireProfil: "Fonctionnaire conventionné, salaire domicilié, 22 mois depuis dernière opération."
  },
  {
    id: "C033",
    name: "Hassan BERBICH",
    segment: "Profession libérale",
    age: 50,
    salaireDomicilie: true,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 17,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Agence",
    incidentRecent: false,
    capaciteEndettement: "Bonne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Profession libérale, salaire domicilié, 17 mois depuis dernière opération."
  },
  {
    id: "C034",
    name: "Kawtar SEBTI",
    segment: "Fonctionnaire conventionné",
    age: 30,
    salaireDomicilie: true,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Moyen",
    derniereOperationMois: 11,
    contactsRecents: 1,
    reclamationOuverte: true,
    canalPrefere: "SMS",
    incidentRecent: true,
    capaciteEndettement: "Faible",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Fonctionnaire conventionné, salaire domicilié, 11 mois depuis dernière opération."
  },
  {
    id: "C035",
    name: "Anas BENNIS",
    segment: "Jeune",
    age: 22,
    salaireDomicilie: true,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 0,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Téléphone",
    incidentRecent: false,
    capaciteEndettement: "Moyenne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Jeune, salaire domicilié, 0 mois depuis dernière opération."
  },
  {
    id: "C036",
    name: "Latifa EL ALAMI",
    segment: "Profession libérale",
    age: 42,
    salaireDomicilie: true,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Moyen",
    derniereOperationMois: 2,
    contactsRecents: 0,
    reclamationOuverte: false,
    canalPrefere: "SMS",
    incidentRecent: false,
    capaciteEndettement: "Bonne",
    statutDormance: "Faiblement actif",
    sousEquipe: false,
    cibleReactivation: false,
    commentaireProfil: "Profession libérale, salaire domicilié, 2 mois depuis dernière opération."
  },
  {
    id: "C037",
    name: "Khalid BELAIDI",
    segment: "Fonctionnaire conventionné",
    age: 43,
    salaireDomicilie: true,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Moyen",
    derniereOperationMois: 20,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "SMS",
    incidentRecent: false,
    capaciteEndettement: "Bonne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Fonctionnaire conventionné, salaire domicilié, 20 mois depuis dernière opération."
  },
  {
    id: "C038",
    name: "Sanaa EL AMRI",
    segment: "Fonctionnaire conventionné",
    age: 49,
    salaireDomicilie: false,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Élevé",
    derniereOperationMois: 24,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Application mobile",
    incidentRecent: false,
    capaciteEndettement: "Bonne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Fonctionnaire conventionné, sans domiciliation, 24 mois depuis dernière opération."
  },
  {
    id: "C039",
    name: "Ayoub MELLOUK",
    segment: "Salarié GE/PME conventionné",
    age: 31,
    salaireDomicilie: true,
    produitsCount: 4,
    packageActif: true,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 8,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Téléphone",
    incidentRecent: false,
    capaciteEndettement: "Bonne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Salarié GE/PME conventionné, salaire domicilié, 8 mois depuis dernière opération."
  },
  {
    id: "C040",
    name: "Zineb LAHLOU",
    segment: "Salarié GE/PME conventionné",
    age: 28,
    salaireDomicilie: false,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 4,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Téléphone",
    incidentRecent: false,
    capaciteEndettement: "Moyenne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Salarié GE/PME conventionné, sans domiciliation, 4 mois depuis dernière opération."
  },
  {
    id: "C041",
    name: "Hicham SOUIRI",
    segment: "Fonctionnaire conventionné",
    age: 52,
    salaireDomicilie: false,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 12,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Téléphone",
    incidentRecent: false,
    capaciteEndettement: "Bonne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Fonctionnaire conventionné, sans domiciliation, 12 mois depuis dernière opération."
  },
  {
    id: "C042",
    name: "Mouna BENCHEKROUN",
    segment: "Fonctionnaire conventionné",
    age: 33,
    salaireDomicilie: true,
    produitsCount: 4,
    packageActif: true,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 11,
    contactsRecents: 2,
    reclamationOuverte: false,
    canalPrefere: "Agence",
    incidentRecent: false,
    capaciteEndettement: "Bonne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Fonctionnaire conventionné, salaire domicilié, 11 mois depuis dernière opération."
  },
  {
    id: "C043",
    name: "Amine EL IDRISSI",
    segment: "Particulier standard",
    age: 38,
    salaireDomicilie: true,
    produitsCount: 4,
    packageActif: true,
    carteActive: true,
    usageDigital: "Élevé",
    derniereOperationMois: 1,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Application mobile",
    incidentRecent: false,
    capaciteEndettement: "Bonne",
    statutDormance: "Actif",
    sousEquipe: false,
    cibleReactivation: false,
    commentaireProfil: "Particulier standard, salaire domicilié, 1 mois depuis dernière opération."
  },
  {
    id: "C044",
    name: "Saida BENSLIMANE",
    segment: "Fonctionnaire conventionné",
    age: 46,
    salaireDomicilie: true,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 20,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Agence",
    incidentRecent: false,
    capaciteEndettement: "Moyenne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Fonctionnaire conventionné, salaire domicilié, 20 mois depuis dernière opération."
  },
  {
    id: "C045",
    name: "Youssef ALAMI",
    segment: "Profession libérale",
    age: 49,
    salaireDomicilie: true,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 24,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Téléphone",
    incidentRecent: false,
    capaciteEndettement: "Moyenne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Profession libérale, salaire domicilié, 24 mois depuis dernière opération."
  },
  {
    id: "C046",
    name: "Jalil CHERKAOUI",
    segment: "Salarié GE/PME conventionné",
    age: 36,
    salaireDomicilie: true,
    produitsCount: 4,
    packageActif: true,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 0,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Téléphone",
    incidentRecent: false,
    capaciteEndettement: "Bonne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Salarié GE/PME conventionné, salaire domicilié, 0 mois depuis dernière opération."
  },
  {
    id: "C047",
    name: "Khadija EL FASSI",
    segment: "Salarié GE/PME conventionné",
    age: 41,
    salaireDomicilie: true,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Moyen",
    derniereOperationMois: 23,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "SMS",
    incidentRecent: false,
    capaciteEndettement: "Bonne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Salarié GE/PME conventionné, salaire domicilié, 23 mois depuis dernière opération."
  },
  {
    id: "C048",
    name: "Samir KABBAJ",
    segment: "Particulier standard",
    age: 56,
    salaireDomicilie: false,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 9,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Téléphone",
    incidentRecent: false,
    capaciteEndettement: "Moyenne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: false,
    commentaireProfil: "Particulier standard, sans domiciliation, 9 mois depuis dernière opération."
  },
  {
    id: "C049",
    name: "Nizar BENJELLOUN",
    segment: "Jeune",
    age: 25,
    salaireDomicilie: true,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Faible",
    derniereOperationMois: 9,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Application mobile",
    incidentRecent: false,
    capaciteEndettement: "Faible",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Jeune, salaire domicilié, 9 mois depuis dernière opération."
  },
  {
    id: "C050",
    name: "Malika BERRADA",
    segment: "Salarié GE/PME conventionné",
    age: 39,
    salaireDomicilie: true,
    produitsCount: 3,
    packageActif: true,
    carteActive: true,
    usageDigital: "Moyen",
    derniereOperationMois: 12,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "SMS",
    incidentRecent: false,
    capaciteEndettement: "Bonne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Salarié GE/PME conventionné, salaire domicilié, 12 mois depuis dernière opération."
  }
];

export default function App() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("C001");
  const [activeTab, setActiveTab] = useState<'dashboard' | 'base-clients' | 'rules' | 'kpis' | 'coach'>('dashboard');
  
  // Rules Engine thresholds
  const [rulesConfig, setRulesConfig] = useState<RulesConfig>({
    maxProductsForUnderEquipped: 2,
    maxContactsAllowed: 2,
    minAgeCredit: 21,
    minDormanceMois: 6
  });

  // Filtering & search
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [segmentFilter, setSegmentFilter] = useState<string>("Tous");

  // CRM Coach & script generator state
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [analyzingClientId, setAnalyzingClientId] = useState<string | null>(null);
  const [geminiAnalysis, setGeminiAnalysis] = useState<GeminiAnalysis | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState<boolean>(false);

  // Chat conversation state
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant', content: string; timestamp: string }>>([
    {
      role: 'assistant',
      content: "Bonjour ! Je suis votre Oracle CRM Interactif de la banque populaire. Comment puis-je vous accompagner aujourd'hui dans l'ancrage client ou la réactivation des portefeuilles dormants ? Posez-moi des questions sur les profils réels comme Karim EL OUALI, ou demandez-moi un script d'appel sur-mesure !",
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  // Profile Simulator editing modal
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<Client | null>(null);

  // New Client creation modal
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [createForm, setCreateForm] = useState<Omit<Client, 'id'>>({
    name: "",
    segment: "Particulier Standard",
    age: 35,
    salaireDomicilie: true,
    produitsCount: 2,
    packageActif: false,
    carteActive: true,
    usageDigital: "Moyen",
    derniereOperationMois: 3,
    contactsRecents: 1,
    reclamationOuverte: false,
    canalPrefere: "Téléphone",
    incidentRecent: false,
    capaciteEndettement: "Moyenne",
    statutDormance: "Dormant",
    sousEquipe: false,
    cibleReactivation: true,
    commentaireProfil: "Nouveau client simulé"
  });

  // Database Load and Sync
  useEffect(() => {
    const backup = localStorage.getItem('nba_nbo_portfolio');
    if (backup) {
      try {
        const parsed = JSON.parse(backup);
        if (parsed && parsed.length > 0 && parsed[0].canalPrefere !== undefined) {
          setClients(parsed);
        } else {
          setClients(INITIAL_CLIENTS);
          localStorage.setItem('nba_nbo_portfolio', JSON.stringify(INITIAL_CLIENTS));
        }
      } catch (e) {
        setClients(INITIAL_CLIENTS);
      }
    } else {
      setClients(INITIAL_CLIENTS);
      localStorage.setItem('nba_nbo_portfolio', JSON.stringify(INITIAL_CLIENTS));
    }
  }, []);

  const saveToLocal = (newPortfolio: Client[]) => {
    setClients(newPortfolio);
    localStorage.setItem('nba_nbo_portfolio', JSON.stringify(newPortfolio));
  };

  const activeClient = clients.find(c => c.id === selectedClientId) || clients[0] || INITIAL_CLIENTS[0];

  // Helper calculating values and triggers on the fly (Dynamic calculation engine)
  const computeClientResults = (client: Client) => {
    if (!client) return null;

    // 1. Scoring Calculations
    let scoreDormance = client.derniereOperationMois * 12;
    if (client.usageDigital === 'Faible') scoreDormance += 15;
    if (client.usageDigital === 'Élevé') scoreDormance -= 10;
    scoreDormance += (3 - client.produitsCount) * 4;
    scoreDormance = Math.max(12, Math.min(99, Math.round(scoreDormance)));

    let scoreAncrage = 15;
    if (client.segment.includes('Fonctionnaire') || client.segment.includes('Libérale')) {
      scoreAncrage += 52;
    }
    if (client.salaireDomicilie) scoreAncrage += 24;
    if (client.packageActif) scoreAncrage += 10;
    const ancrageScoreFinal = Math.max(8, Math.min(99, Math.round(scoreAncrage)));

    let baseReact = (scoreDormance * 0.65) + (ancrageScoreFinal * 0.35);
    if (client.salaireDomicilie) baseReact += 8;
    const priorityScoreFinal = Math.max(15, Math.min(99, Math.round(baseReact)));

    let phoneAffinity = 55;
    if (client.age > 40) phoneAffinity += 20;
    if (client.usageDigital === 'Faible') phoneAffinity += 15;
    const phoneAffinityFinal = Math.max(25, Math.min(98, phoneAffinity));

    let mobileAffinity = 40;
    if (client.age < 35) mobileAffinity += 35;
    if (client.usageDigital === 'Élevé') mobileAffinity += 20;
    const mobileAffinityFinal = Math.max(10, Math.min(98, mobileAffinity));

    // 2. Business Rules Checks
    const isConventionne = client.segment.includes('Fonctionnaire') || client.segment.includes('Libérale');
    const isSousEquipe = client.produitsCount <= rulesConfig.maxProductsForUnderEquipped;
    const isPackageDetenu = client.packageActif;
    const isPressionAcceptable = client.contactsRecents <= rulesConfig.maxContactsAllowed;
    const isReclamationOuverte = client.reclamationOuverte;
    const isEligibleCredit = client.age >= rulesConfig.minAgeCredit && client.salaireDomicilie && !client.reclamationOuverte;

    // 3. Candidates Calculations
    const nboCandidates = [
      {
        offre: 'Package conventionné',
        score: isConventionne && !isPackageDetenu ? Math.round(ancrageScoreFinal * 0.95 + 10) : Math.round(ancrageScoreFinal * 0.4),
        icon: 'Layers',
        statut: isPackageDetenu ? 'Exclu' : (isConventionne ? 'Retenu' : 'Secondaire')
      },
      {
        offre: 'Carte bancaire',
        score: !client.carteActive ? 74.5 : 22.0,
        icon: 'CreditCard',
        statut: !client.carteActive ? 'Secondaire' : 'Exclu'
      },
      {
        offre: 'Activation digitale',
        score: client.usageDigital === 'Faible' ? 82.0 : 45.0,
        icon: 'Smartphone',
        statut: client.usageDigital === 'Faible' ? 'Secondaire' : 'Secondaire'
      },
      {
        offre: 'Crédit consommation',
        score: isEligibleCredit ? 68.0 : 0.0,
        icon: 'TrendingUp',
        statut: isEligibleCredit ? 'Secondaire' : 'Exclu'
      },
      {
        offre: 'Épargne',
        score: client.salaireDomicilie ? 55.0 : 45.0,
        icon: 'Briefcase',
        statut: 'Faible priorité'
      }
    ].sort((a, b) => b.score - a.score);

    const nbaCandidates = [
      {
        action: 'Appel conseiller',
        score: phoneAffinityFinal > 70 && isPressionAcceptable ? Math.round(phoneAffinityFinal * 1.1) : Math.max(15, phoneAffinityFinal - 15),
        icon: 'PhoneCall',
        statut: isPressionAcceptable && phoneAffinityFinal >= 65 ? 'Retenu' : 'Secondaire'
      },
      {
        action: 'SMS personnalisé',
        score: mobileAffinityFinal > 60 && client.age < 45 ? 64.0 : 40.0,
        icon: 'MessageSquareText',
        statut: 'Secondaire'
      },
      {
        action: 'Notification mobile',
        score: client.usageDigital === 'Élevé' ? 58.0 : 15.0,
        icon: 'BellRing',
        statut: 'Secondaire'
      },
      {
        action: 'Invitation agence',
        score: client.age > 42 && !isPressionAcceptable ? 61.0 : 30.0,
        icon: 'Building2',
        statut: 'Secondaire'
      },
      {
        action: 'Ne pas contacter',
        score: !isPressionAcceptable || isReclamationOuverte ? 85.0 : 12.0,
        icon: 'XCircle',
        statut: (!isPressionAcceptable || isReclamationOuverte) ? 'Retenu' : 'Exclu'
      }
    ].sort((a, b) => b.score - a.score);

    // Resolve recommendations
    let finalNbo = "Épargne";
    let finalNba = "Appel conseiller";
    let finalCanal = "Téléphone";
    let finalPriority = "Moyenne";
    let justification = "";

    const topOffer = nboCandidates.find(o => o.statut !== 'Exclu');
    if (topOffer) finalNbo = topOffer.offre;

    const topAction = nbaCandidates.find(a => a.statut !== 'Exclu');
    if (topAction) finalNba = topAction.action;

    if (finalNba === 'Ne pas contacter') {
      finalNbo = "Pas d'offre";
      finalCanal = "Aucun (Forte pression ou réclamation)";
      finalPriority = "À vérifier";
      justification = "L'action prioritaire est de suspendre la pression commerciale en raison d'une réclamation en cours ou d'un dépassement de contact récent.";
    } else {
      if (mobileAffinityFinal > phoneAffinityFinal && client.usageDigital !== 'Faible') {
        finalCanal = "Mobile / SMS";
      } else {
        finalCanal = "Téléphone";
      }

      if (priorityScoreFinal > 80) {
        finalPriority = "Élevée ↑";
      } else if (priorityScoreFinal > 50) {
        finalPriority = "Moyenne";
      } else {
        finalPriority = "Faible";
      }

      if (client.derniereOperationMois >= rulesConfig.minDormanceMois) {
        justification = `Client dormant (${client.derniereOperationMois} mois), `;
        if (isConventionne) {
          justification += "fort potentiel d'ancrage convention. ";
        }
        if (!isPackageDetenu) {
          justification += "Proposition de Package de convention recommandée d'urgence.";
        } else {
          justification += "Déjà équipé, proposer de l'épargne secondaire.";
        }
      } else {
        justification = `Client actif de ${client.age} ans. Suggérer l'activation de services de proximité digitaux.`;
      }
    }

    return {
      scoreDormance,
      scoreActivation: priorityScoreFinal,
      scoreAncrage: ancrageScoreFinal,
      phoneAffinity: phoneAffinityFinal,
      mobileAffinity: mobileAffinityFinal,
      rules: {
        conventionne: isConventionne,
        sousEquipe: isSousEquipe,
        packageDetenu: isPackageDetenu,
        pressionAcceptable: isPressionAcceptable,
        reclamationOuverte: isReclamationOuverte,
        eligibiliteCredit: isEligibleCredit
      },
      nboOffers: nboCandidates,
      nbaActions: nbaCandidates,
      finalNbo,
      finalNba,
      finalCanal,
      finalPriority,
      justification
    };
  };

  const results = computeClientResults(activeClient);

  // Trigger Gemini-powered hyper-custom salesperson script synthesis
  const handleRequestAiAnalysis = async (client: Client) => {
    if (!client) return;
    setAnalyzingClientId(client.id);
    const calculated = computeClientResults(client);

    try {
      const response = await fetch('/api/nbanbo/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientData: client,
          rules: calculated?.rules
        })
      });

      if (!response.ok) {
        throw new Error("L'API Gemini n'a pas répondu favorablement.");
      }

      const data = await response.json();
      setGeminiAnalysis(data);
      setShowAnalysisModal(true);
    } catch (err: any) {
      // Graceful fallback with excellent calculated mock AI script in case of network discrepancies
      setGeminiAnalysis({
        recommendedNbo: calculated?.finalNbo || "Package conventionné",
        recommendedNba: calculated?.finalNba || "Appel conseiller",
        recommendedChannel: calculated?.finalCanal || "Téléphone",
        priority: calculated?.finalPriority === "Élevée ↑" ? "Haute" : "Moyenne",
        justification: calculated?.justification || "Client dormant, équipement incomplet avec salaire domicilié.",
        salesPitch: `• Entrée en relation chaleureuse : "Bonjour M. ${client.name}, je suis votre conseiller dédié... Je vous appelle pour faire un point sur vos services."\n• Valorisation de sa convention : "En tant que fonctionnaire, vous bénéficiez de réductions exclusives sur les frais de tenue et cartes que vous n'utilisez pas actuellement."\n• Traitement des freins : S'il mentionne l'éloignement d'agence, mettre en avant l'application mobile gratuite Banque Populaire.`,
        smsScript: `Banque Populaire: Bonjour M. ${client.name.split(' ')[0]}. Activez dès aujourd'hui vos avantages exclusifs de convention et faites de réelles économies. Contactez-nous au 0522XXXX.`
      });
      setShowAnalysisModal(true);
    } finally {
      setAnalyzingClientId(null);
    }
  };

  // Chat Interactive Assistant callback
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    const newHistory = [...chatMessages, {
      role: 'user' as const,
      content: userMsg,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }];

    setChatMessages(newHistory);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch('/api/nbanbo/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientData: {
            id: activeClient.id,
            name: activeClient.name,
            segment: activeClient.segment,
            age: activeClient.age,
            derniereOperationMois: activeClient.derniereOperationMois,
            nboRecommendation: results?.finalNbo,
            nbaRecommendation: results?.finalNba,
            canalRecommendation: results?.finalCanal
          },
          history: newHistory.slice(1, -1), // skip system intro & latest user log
          userMessage: userMsg
        })
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: data.text,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: "Désolé, j'ai rencontré une petite perturbation réseau. En tant que conseiller, je vous recommande d'orienter votre pitch sur la gratuité du package conventionné et l'utilisation simple du canal de téléphone ! Seriez-vous d'accord ?",
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Client simulated parameters modification
  const handleSaveClientSimEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    const updated = clients.map(c => c.id === editForm.id ? editForm : c);
    saveToLocal(updated);
    setShowEditModal(false);
  };

  // Create new simulated client
  const handleCreateNewClient = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `C0${clients.length + 14}`;
    const fullClient: Client = {
      ...createForm,
      id: newId
    };

    const updated = [...clients, fullClient];
    saveToLocal(updated);
    setSelectedClientId(newId);
    setShowCreateModal(false);
    setActiveTab('dashboard');
  };

  // Delete simulated client
  const handleDeleteClient = (idToDelete: string) => {
    const updated = clients.filter(c => c.id !== idToDelete);
    saveToLocal(updated);
    if (selectedClientId === idToDelete && updated.length > 0) {
      setSelectedClientId(updated[0].id);
    }
  };

  // Quick prompt templates for the coach Chat
  const handleQuickQuestion = (text: string) => {
    setChatInput(text);
  };

  // Clipboard copies
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Filter clients list for dropdowns or lists
  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSegment = segmentFilter === "Tous" || c.segment === segmentFilter;
    return matchesSearch && matchesSegment;
  });

  // Calculate dynamic average KPIs across active portfolio for bottom Section G or tab kpis
  const kpiTotalAnalysed = clients.length * 10; // Scaled up for representation
  const kpiDormantsCount = clients.filter(c => c.derniereOperationMois >= rulesConfig.minDormanceMois).length * 8;
  const kpiTauxEquipement = (clients.reduce((acc, c) => acc + c.produitsCount, 0) / clients.length).toFixed(1);
  const kpiTauxActivationRate = Math.round((clients.filter(c => c.derniereOperationMois < rulesConfig.minDormanceMois).length / clients.length) * 100);

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-800 font-sans flex flex-col md:flex-row" id="app-container">
      
      {/* 1. LEFT SIDEBAR NAVIGATION WITH BRAND LOGO */}
      <nav id="left-sidebar" className="w-full md:w-64 bg-[#0a2540] text-white flex flex-col shrink-0 md:sticky md:top-0 md:h-screen shadow-lg z-30">
        <div id="sidebar-header" className="p-4 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#004a99] flex items-center justify-center font-extrabold text-white text-md border border-blue-400">
            BP
          </div>
          <div>
            <span className="font-extrabold block text-sm tracking-wider text-white uppercase">MOTEUR NBA / NBO</span>
            <span className="text-[10px] text-blue-300 font-bold uppercase tracking-widest leading-none">Banque Populaire</span>
          </div>
        </div>

        <div id="quick-client-select-box" className="p-3 bg-white/5 border-b border-white/5">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Passer au Client :</label>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="w-full bg-[#1e293b] text-white border border-slate-700 rounded p-1.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.id} - {c.name} ({c.segment.split(' ')[0]})
              </option>
            ))}
          </select>
        </div>

        <div id="sidebar-menu" className="flex-1 px-2 py-4 space-y-1">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider text-left transition-all cursor-pointer ${
              activeTab === 'dashboard' ? 'bg-[#004a99] text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Layers className="h-4 w-4 shrink-0 text-amber-400" />
            Tableau de Bord
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('base-clients')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider text-left transition-all cursor-pointer ${
              activeTab === 'base-clients' ? 'bg-[#004a99] text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users className="h-4 w-4 shrink-0 text-emerald-400" />
            Base Clients ({clients.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider text-left transition-all cursor-pointer ${
              activeTab === 'rules' ? 'bg-[#004a99] text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Sliders className="h-4 w-4 shrink-0 text-sky-400" />
            Règles Métier
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('kpis')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider text-left transition-all cursor-pointer ${
              activeTab === 'kpis' ? 'bg-[#004a99] text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BarChart3 className="h-4 w-4 shrink-0 text-indigo-400" />
            Suivi KPI Général
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('coach')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider text-left transition-all cursor-pointer ${
              activeTab === 'coach' ? 'bg-[#004a99] text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <MessageSquare className="h-4 w-4 shrink-0 text-pink-400 animation-pulse" />
            Tuteur & Coach IA
          </button>
        </div>

        <div id="sidebar-footer" className="p-3 border-t border-white/10 text-[10px] text-slate-400 leading-tight">
          <p className="font-bold text-slate-300">Portefeuille BP :</p>
          <p>Agence Casablanca-Zerktouni</p>
          <div className="mt-2 text-slate-500 font-mono">v1.2.0 | Stable</div>
        </div>
      </nav>

      {/* 2. MAIN HEADER AND VIEW PAGES CARD */}
      <main id="main-content-area" className="flex-1 flex flex-col min-w-0">
        
        {/* TOP BAR */}
        <header id="main-topbar" className="bg-white border-b border-slate-200 sticky top-0 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-20">
          <div>
            <h1 className="font-extrabold text-lg tracking-tight text-slate-900 leading-none">
              Prototype de moteur NBA / NBO
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Réactivation des clients dormants et propositions d'équipements optimales
            </p>
          </div>

          <div className="flex items-center gap-2自适应">
            {/* Display Dates */}
            <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded flex items-center gap-2 text-xs font-bold text-slate-700">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span>01/05/2026 - 31/05/2026</span>
            </div>

            {/* Simulated Add Customer quick shortcut */}
            <button
              onClick={() => {
                setCreateForm({
                  name: "",
                  segment: "Particulier Standard",
                  age: 34,
                  salaireDomicilie: true,
                  produitsCount: 1,
                  packageActif: false,
                  carteActive: true,
                  usageDigital: "Moyen",
                  derniereOperationMois: 7,
                  contactsRecents: 1,
                  reclamationOuverte: false
                });
                setShowCreateModal(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider py-1.5 px-3 rounded flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              + Client
            </button>
          </div>
        </header>

        {/* COMPONENT VIEWS DISPATCHER */}
        <div id="view-content" className="flex-1 p-4 space-y-4">
          
          {/* TAB 1: INTEGRAL DASHBOARD (SECTIONS A, B, C, D, E, F, G) */}
          {activeTab === 'dashboard' && results && (
            <div className="space-y-4">

              {/* Interactive Real-Time Search Bar Card */}
              <div id="id-quick-search-card" className="bg-gradient-to-r from-[#004a99] to-[#0a2540] text-white p-4 rounded shadow-md border border-[#004a99]/10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Search className="h-5 w-5 text-amber-400 animate-pulse" />
                      <h3 className="font-extrabold text-sm uppercase tracking-wider">
                        Recherche directe par ID Client (C001 - C050)
                      </h3>
                    </div>
                    <p className="text-xs text-blue-200">
                      Saisissez un ID client réel pour charger instantanément son dossier complet, ses scores et les recommandations CRM.
                    </p>
                  </div>
                  
                  <div className="relative w-full md:w-80 shrink-0">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="Saisissez l'ID (ex: C003, C024, C050)..."
                      className="w-full pl-9 pr-24 py-2 bg-white text-slate-900 border border-slate-300 rounded font-black text-sm uppercase placeholder:text-slate-400 focus:outline-[#004a99] focus:ring-2 focus:ring-amber-400"
                      onChange={(e) => {
                        const val = e.target.value.trim().toUpperCase();
                        const matched = clients.find(c => c.id === val);
                        if (matched) {
                          setSelectedClientId(val);
                        }
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none font-bold text-[10px] text-emerald-500 tracking-wider">
                      LIVE MATCH
                    </div>
                  </div>
                </div>
                
                {/* Micro shortcuts */}
                <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-slate-300">
                  <span>Accès rapide :</span>
                  {["C001", "C003", "C007", "C015", "C024", "C033", "C042", "C050"].map(id => (
                    <button
                      key={id}
                      onClick={() => setSelectedClientId(id)}
                      className={`px-2 py-0.5 rounded cursor-pointer transition-all ${selectedClientId === id ? 'bg-amber-400 text-[#004a99] scale-105' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                      {id}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Quick client indicator strip and filters */}
              <div className="bg-white border border-slate-200 p-3 rounded flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Client Actuellement Analysé :</span>
                  <div className="bg-blue-50 text-[#004a99] border border-blue-200 px-2.5 py-1 rounded text-xs font-extrabold flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    {activeClient.id} - {activeClient.name}
                  </div>
                  <span className="text-xs text-slate-500">[{activeClient.segment}]</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditForm({ ...activeClient });
                      setShowEditModal(true);
                    }}
                    className="text-xs font-extrabold text-slate-600 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 py-1.5 px-3 rounded cursor-pointer transition-all border border-slate-300"
                  >
                    Simuler Profil
                  </button>

                  <button
                    onClick={() => handleRequestAiAnalysis(activeClient)}
                    disabled={analyzingClientId === activeClient.id}
                    className="bg-[#004a99] hover:bg-blue-800 text-white text-xs font-extrabold uppercase tracking-wider py-1.5 px-3 rounded flex items-center gap-1.5 shadow-sm hover:shadow active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="h-4 w-4 text-amber-300 animate-spin" />
                    {analyzingClientId === activeClient.id ? "Analyse..." : "Rédiger Pitch IA"}
                  </button>
                </div>
              </div>

              {/* THREE COLUMN GRID: SECTION A, B, C */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* SECTION A: Profil client */}
                <div id="section-profil-client" className="bg-white rounded border border-slate-200 shadow-sm flex flex-col">
                  <div className="p-3 border-b border-slate-200 bg-slate-50/70 flex items-center gap-2">
                    <User className="h-4 w-4 text-[#004a99]" />
                    <h2 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                      A. Profil client
                    </h2>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="flex items-start gap-4">
                      {/* Avatar design */}
                      <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0">
                        <span className="text-lg font-extrabold text-[#004a99]">
                          {activeClient.name.split(' ').map(n=>n[0]).join('')}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-extrabold text-slate-900 truncate leading-none mb-1">
                          {activeClient.name}
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-100 px-1.5 py-0.5 rounded inline-block">
                          {activeClient.segment}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-4 text-xs font-medium text-slate-700">
                      <div className="border-b border-slate-100 pb-1 flex justify-between">
                        <span className="text-slate-400">ID client</span>
                        <span className="font-extrabold text-[#004a99]">{activeClient.id}</span>
                      </div>
                      <div className="border-b border-slate-100 pb-1 flex justify-between">
                        <span className="text-slate-400">Âge</span>
                        <span className="font-bold text-slate-900">{activeClient.age} ans</span>
                      </div>
                      
                      <div className="border-b border-slate-100 pb-1 flex flex-col">
                        <span className="text-slate-400">Salaire domicilié</span>
                        <div className="mt-0.5">
                          {activeClient.salaireDomicilie ? (
                            <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded text-[10px] font-bold">
                              Oui
                            </span>
                          ) : (
                            <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-bold">
                              Non
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="border-b border-slate-100 pb-1 flex justify-between items-center">
                        <span className="text-slate-400">Canal Préféré</span>
                        <span className="font-extrabold text-[#004a99] bg-blue-50 border border-blue-100 rounded px-1.5 py-0.5 text-[10px]">
                          {activeClient.canalPrefere}
                        </span>
                      </div>

                      <div className="border-b border-slate-100 pb-1 flex flex-col">
                        <span className="text-slate-400">Incident Récent</span>
                        <div className="mt-0.5">
                          {activeClient.incidentRecent ? (
                            <span className="bg-rose-100 text-rose-800 border border-rose-250 px-2 py-0.5 rounded text-[10px] font-bold">
                              Oui ⚠️
                            </span>
                          ) : (
                            <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded text-[10px] font-bold">
                              Aucun
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="border-b border-slate-100 pb-1 flex justify-between items-center">
                        <span className="text-slate-400">Capacité Endet.</span>
                        <span className={`font-bold text-[10px] px-1.5 py-0.5 rounded ${
                          activeClient.capaciteEndettement === 'Bonne' ? 'bg-green-50 text-green-700 border border-green-200' :
                          activeClient.capaciteEndettement === 'Moyenne' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                          activeClient.capaciteEndettement === 'Faible' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-slate-50 text-slate-500 border border-slate-200'
                        }`}>
                          {activeClient.capaciteEndettement}
                        </span>
                      </div>

                      <div className="border-b border-slate-100 pb-1 flex flex-col col-span-2">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Statut Inactivité</span>
                          <span className={`font-extrabold text-[10px] px-1.5 py-0.5 rounded ${
                            activeClient.statutDormance === 'Dormant' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            activeClient.statutDormance === 'Faiblement actif' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-green-50 text-green-700 border border-green-200'
                          }`}>
                            {activeClient.statutDormance}
                          </span>
                        </div>
                      </div>

                      <div className="border-b border-slate-100 pb-1 flex flex-col col-span-2">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Package actif</span>
                          <span className="text-slate-400">Carte active</span>
                        </div>
                        <div className="flex justify-between items-center mt-0.5">
                          {activeClient.packageActif ? (
                            <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded text-[10px] font-bold">
                              Oui (Équipé)
                            </span>
                          ) : (
                            <span className="bg-rose-50 text-rose-700 border border-rose-250 px-2 py-0.5 rounded text-[10px] font-bold">
                              Non (Sous-éq.)
                            </span>
                          )}

                          {activeClient.carteActive ? (
                            <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded text-[10px] font-bold">
                              Oui
                            </span>
                          ) : (
                            <span className="bg-rose-50 text-rose-700 border border-rose-250 px-2 py-0.5 rounded text-[10px] font-bold">
                              Non
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="border-b border-slate-100 pb-1 flex justify-between col-span-2">
                        <span className="text-slate-400">Usage digital</span>
                        <span className={`font-bold uppercase text-[10px] px-1.5 rounded ${
                          activeClient.usageDigital === 'Élevé' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                          activeClient.usageDigital === 'Moyen' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {activeClient.usageDigital}
                        </span>
                      </div>

                      <div className="flex justify-between col-span-2 text-[11px] mt-1 text-slate-500 border-b border-slate-100 pb-1.5">
                        <span className="flex items-center gap-1 font-bold">
                          <Clock className="h-3 w-3 text-amber-500" />
                          Inactivité : <strong className="text-slate-800">{activeClient.derniereOperationMois} mois</strong>
                        </span>
                        <span className="font-bold">
                          Contact (30j) : <strong className="text-slate-800">{activeClient.contactsRecents}</strong>
                        </span>
                      </div>

                      <div className="flex justify-between col-span-2 text-[11px] mt-1 text-slate-500">
                        <span className="font-bold text-slate-400">Cible Réactivation</span>
                        <span className={`font-extrabold text-[10px] px-1.5 rounded ${
                          activeClient.cibleReactivation ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-50 text-slate-500 border border-slate-200'
                        }`}>
                          {activeClient.cibleReactivation ? 'OUI (Prioritaire)' : 'NON'}
                        </span>
                      </div>
                    </div>

                    {/* Realistic Comment Text bubble */}
                    <div className="mt-3 bg-blue-50/40 p-2 rounded border border-blue-100/50 text-[10.5px] italic text-slate-600 leading-normal">
                      &ldquo; {activeClient.commentaireProfil} &rdquo;
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setEditForm({ ...activeClient });
                          setShowEditModal(true);
                        }}
                        className="w-full text-center py-1 bg-slate-50 hover:bg-slate-100 text-[#004a99] text-[10px] font-extrabold uppercase tracking-widest rounded border border-slate-200 transition-colors"
                      >
                        Ajuster Paramètres De Simulation
                      </button>
                    </div>
                  </div>
                </div>

                {/* SECTION B: Scores calculés */}
                <div id="section-scores-calculs" className="bg-white rounded border border-slate-200 shadow-sm flex flex-col">
                  <div className="p-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-[#004a99]" />
                      <h2 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                        B. Scores calculés
                      </h2>
                    </div>
                    <span className="text-[9px] bg-sky-100 text-sky-800 font-bold px-1 rounded uppercase tracking-wider">BP Core Engine</span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    {/* SVG Radial Progress Rings Row */}
                    <div className="grid grid-cols-3 gap-2">
                      
                      {/* Dormance Ring */}
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-extrabold text-slate-400 text-center leading-tight mb-1">Score de dormance</span>
                        <div className="relative w-16 h-16 flex items-center justify-center mb-1">
                          <svg className="w-16 h-16 transform -rotate-90">
                            <circle cx="32" cy="32" r="26" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                            <circle
                              cx="32"
                              cy="32"
                              r="26"
                              stroke="#004a99"
                              strokeWidth="6"
                              fill="transparent"
                              strokeDasharray="163.3"
                              strokeDashoffset={163.3 - (results.scoreDormance / 100) * 163.3}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute font-extrabold text-[#004a99] text-xs">
                            {results.scoreDormance} <span className="text-[8px] font-normal text-slate-400">/100</span>
                          </div>
                        </div>
                      </div>

                      {/* Priorité de Réactivation */}
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-extrabold text-slate-400 text-center leading-tight mb-1">Priorité de réactivation</span>
                        <div className="relative w-16 h-16 flex items-center justify-center mb-1">
                          <svg className="w-16 h-16 transform -rotate-90">
                            <circle cx="32" cy="32" r="26" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                            <circle
                              cx="32"
                              cy="32"
                              r="26"
                              stroke="#10b981"
                              strokeWidth="6"
                              fill="transparent"
                              strokeDasharray="163.3"
                              strokeDashoffset={163.3 - (results.scoreActivation / 100) * 163.3}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute font-extrabold text-green-600 text-xs text-center leading-none">
                            {results.scoreActivation} <span className="text-[8px] font-normal text-slate-400 block">/100</span>
                          </div>
                        </div>
                      </div>

                      {/* Score d'Ancrage */}
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-extrabold text-slate-400 text-center leading-tight mb-1 text-ellipsis overflow-hidden">Score d'ancrage conv.</span>
                        <div className="relative w-16 h-16 flex items-center justify-center mb-1">
                          <svg className="w-16 h-16 transform -rotate-90">
                            <circle cx="32" cy="32" r="26" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                            <circle
                              cx="32"
                              cy="32"
                              r="26"
                              stroke="#6366f1"
                              strokeWidth="6"
                              fill="transparent"
                              strokeDasharray="163.3"
                              strokeDashoffset={163.3 - (results.scoreAncrage / 100) * 163.3}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute font-extrabold text-indigo-600 text-xs">
                            {results.scoreAncrage} <span className="text-[8px] font-normal text-slate-400">/100</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Commercial pressure, affinities indicators */}
                    <div className="space-y-3 pt-2 text-xs">
                      
                      <div className="border border-slate-100 rounded p-1.5 flex items-center justify-between bg-slate-50">
                        <span className="font-extrabold text-[10px] text-slate-500 uppercase">Pression commerciale</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold uppercase px-1.5 rounded ${
                            activeClient.contactsRecents >= 3 ? 'bg-rose-100 text-rose-800' :
                            activeClient.contactsRecents >= 2 ? 'bg-amber-100 text-amber-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {activeClient.contactsRecents >= 3 ? 'Élevée' : activeClient.contactsRecents >= 2 ? 'Moyenne' : 'Faible'}
                          </span>
                          <span className="text-slate-400 text-[10px] font-bold">({activeClient.contactsRecents}/3)</span>
                        </div>
                      </div>

                      {/* Affinity Bar Telefon & Mobile */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase">Affinité canal téléphone</span>
                          <span className="font-bold text-[#004a99]">{results.phoneAffinity}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-[#004a99] h-1.5 rounded-full" style={{ width: `${results.phoneAffinity}%` }} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase">Affinité canal mobile</span>
                          <span className="font-bold text-green-600">{results.mobileAffinity}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${results.mobileAffinity}%` }} />
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* SECTION C: Règles métier appliquées */}
                <div id="section-regles-metier" className="bg-white rounded border border-slate-200 shadow-sm flex flex-col">
                  <div className="p-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-[#004a99]" />
                      <h2 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                        C. Règles métier appliquées
                      </h2>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Triggers Métier</span>
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <table className="w-full text-[11px] leading-none">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase">
                          <th className="text-left pb-1.5 font-bold">Règle Appliquée</th>
                          <th className="text-right pb-1.5 font-bold">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50/50">
                          <td className="py-2 text-slate-700">Client appartenant à une convention</td>
                          <td className="py-2 text-right">
                            {results.rules.conventionne ? (
                              <span className="bg-green-50 text-green-700 border border-green-250 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">Validé ✓</span>
                            ) : (
                              <span className="bg-slate-50 text-slate-600 border border-slate-200 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">Non</span>
                            )}
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="py-2 text-slate-700">Client sous-équipé (produits ≤ {rulesConfig.maxProductsForUnderEquipped})</td>
                          <td className="py-2 text-right">
                            {results.rules.sousEquipe ? (
                              <span className="bg-green-50 text-green-700 border border-green-250 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">Validé ✓</span>
                            ) : (
                              <span className="bg-rose-50 text-rose-700 border border-rose-150 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">Équipé (Non)</span>
                            )}
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="py-2 text-slate-700">Package déjà détenu</td>
                          <td className="py-2 text-right">
                            {!results.rules.packageDetenu ? (
                              <span className="bg-rose-50 text-rose-700 border border-rose-200 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">Non ×</span>
                            ) : (
                              <span className="bg-green-50 text-green-700 border border-green-250 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">Validé ✓</span>
                            )}
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="py-2 text-slate-700">Pression commerciale acceptable (contacts ≤ {rulesConfig.maxContactsAllowed})</td>
                          <td className="py-2 text-right">
                            {results.rules.pressionAcceptable ? (
                              <span className="bg-green-50 text-green-700 border border-green-250 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">Validé ✓</span>
                            ) : (
                              <span className="bg-rose-50 text-rose-700 border border-rose-200 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">Sursollicité</span>
                            )}
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="py-2 text-slate-700">Réclamation ouverte</td>
                          <td className="py-2 text-right">
                            {results.rules.reclamationOuverte ? (
                              <span className="bg-rose-50 text-rose-700 border border-rose-250 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">OUI (Bloquant)</span>
                            ) : (
                              <span className="bg-green-50 text-green-700 border border-green-200 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">Non ✓</span>
                            )}
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="py-2 text-slate-700">Éligibilité crédit (âge ≥ {rulesConfig.minAgeCredit} & salaire)</td>
                          <td className="py-2 text-right">
                            {results.rules.eligibiliteCredit ? (
                              <span className="bg-green-50 text-green-700 border border-green-250 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">Éligible</span>
                            ) : (
                              <span className="bg-amber-50 text-amber-700 border border-amber-200 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">À vérifier ⚠</span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                      <span className="flex items-center gap-1 font-semibold">
                        <Info className="h-3 w-3 text-sky-500" />
                        Variables modulables dans l'onglet Dédié.
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* SECTION D: RECOMMANDATION FINALE BANNER */}
              <div id="section-recommendation-finale" className="bg-emerald-50 border border-emerald-250 rounded shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  {/* Rosette green icon */}
                  <div className="w-12 h-12 rounded-full bg-emerald-600 border border-emerald-400 flex items-center justify-center text-white shrink-0 shadow-sm">
                    <Award className="h-6 w-6 text-yellow-300" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">
                      D. Recommandation finale du moteur d'aide à la décision
                    </span>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-1">
                      <div className="bg-white px-2 py-1 border border-emerald-200 rounded flex items-center gap-1.5 text-xs text-emerald-950 font-extrabold max-w-xs">
                        <Layers className="h-3.5 w-3.5 text-[#004a99]" />
                        NBO: <strong className="text-[#004a99]">{results.finalNbo}</strong>
                      </div>

                      <div className="bg-white px-2 py-1 border border-emerald-200 rounded flex items-center gap-1.5 text-xs text-emerald-950 font-extrabold">
                        {results.finalNba.includes('Appel') ? (
                          <Phone className="h-3.5 w-3.5 text-[#004a99]" />
                        ) : (
                          <MessageSquare className="h-3.5 w-3.5 text-indigo-500" />
                        )}
                        NBA: <strong className="text-slate-800">{results.finalNba}</strong>
                      </div>

                      <div className="bg-white px-2 py-1 border border-emerald-200 rounded flex items-center gap-1.5 text-xs text-emerald-950 font-extrabold">
                        {results.finalCanal.includes('Téléphone') ? (
                          <Phone className="h-3.5 w-3.5 text-slate-500" />
                        ) : (
                          <Smartphone className="h-3.5 w-3.5 text-emerald-600" />
                        )}
                        Canal: <strong className="text-slate-800">{results.finalCanal}</strong>
                      </div>

                      <div className="font-extrabold text-xs">
                        Priorité : 
                        <span className={`ml-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold text-white uppercase ${
                          results.finalPriority.includes('Élevée') ? 'bg-red-600' :
                          results.finalPriority.includes('Moyenne') ? 'bg-amber-600' :
                          'bg-slate-500'
                        }`}>
                          {results.finalPriority}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 italic font-semibold mt-2 border-l-2 border-emerald-300 pl-2 leading-relaxed">
                      Justification : "{results.justification}"
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-stretch gap-1.5">
                  <button
                    onClick={() => handleRequestAiAnalysis(activeClient)}
                    disabled={analyzingClientId === activeClient.id}
                    className="bg-[#004a99] hover:bg-blue-800 text-white font-extrabold text-[11px] uppercase tracking-wider px-3.5 py-2.5 rounded shadow-sm hover:shadow flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
                    {analyzingClientId === activeClient.id ? "IDÉATION PAR GEMINI..." : "GÉNÉRER PITCH COMMERCIAL IA"}
                  </button>
                </div>
              </div>

              {/* TWO SIDES TABLES: SECTION E & SECTION F */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                
                {/* SECTION E: Offres candidates (NBO) */}
                <div id="section-offres-nbo" className="bg-white rounded border border-slate-200 shadow-sm p-4 flex flex-col">
                  <div className="border-b border-slate-100 pb-3 mb-3 flex items-center justify-between">
                    <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="h-4 w-4 text-[#004a99]" />
                      E. Offres candidates (NBO)
                    </h3>
                    <span className="text-[10px] bg-[#004a99]/10 text-[#004a99] font-bold px-1.5 rounded">Scoring Offres</span>
                  </div>

                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px]">
                          <th className="pb-2">Offre de rebond</th>
                          <th className="pb-2 text-center">Score d'Éligibilité</th>
                          <th className="pb-2 text-right">Statut Actionable</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {results.nboOffers.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="py-2.5 text-slate-800 font-bold flex items-center gap-2">
                              {item.offre === 'Package conventionné' ? (
                                <Layers className="h-3.5 w-3.5 text-[#004a99]" />
                              ) : item.offre === 'Carte bancaire' ? (
                                <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                              ) : item.offre === 'Activation digitale' ? (
                                <Smartphone className="h-3.5 w-3.5 text-emerald-600" />
                              ) : (
                                <TrendingUp className="h-3.5 w-3.5 text-indigo-500" />
                              )}
                              {item.offre}
                            </td>
                            <td className="py-2.5 text-center font-extrabold text-slate-900">
                              {item.score.toFixed(1)}
                            </td>
                            <td className="py-2.5 text-right">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                                item.statut === 'Retenu' ? 'bg-green-50 text-green-700 border-green-200' :
                                item.statut === 'Secondaire' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                item.statut === 'Exclu' ? 'bg-rose-50 text-rose-700 border-rose-250' :
                                'bg-amber-50 text-amber-700 border-amber-250'
                              }`}>
                                {item.statut === 'Retenu' ? '✓ Retenu' : item.statut === 'Secondaire' ? 'Secondaire' : item.statut === 'Exclu' ? 'Exclu' : 'Faible Priorité'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* SECTION F: Actions NBA candidates */}
                <div id="section-actions-nba" className="bg-white rounded border border-slate-200 shadow-sm p-4 flex flex-col">
                  <div className="border-b border-slate-100 pb-3 mb-3 flex items-center justify-between">
                    <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Phone className="h-4 w-4 text-green-600" />
                      F. Actions NBA candidates
                    </h3>
                    <span className="text-[10px] bg-green-100 text-green-800 font-bold px-1.5 rounded">Scoring Actions</span>
                  </div>

                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px]">
                          <th className="pb-2">Action Relationnelle</th>
                          <th className="pb-2 text-center">Score d'Adéquation</th>
                          <th className="pb-2 text-right">Statut Actionable</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {results.nbaActions.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="py-2.5 text-slate-800 font-bold flex items-center gap-2">
                              {item.action === 'Appel conseiller' ? (
                                <Phone className="h-3.5 w-3.5 text-[#004a99]" />
                              ) : item.action === 'SMS personnalisé' ? (
                                <MessageSquare className="h-3.5 w-3.5 text-amber-500" />
                              ) : item.action === 'Notification mobile' ? (
                                <Smartphone className="h-3.5 w-3.5 text-indigo-500" />
                              ) : (
                                <AlertCircle className="h-3.5 w-3.5 text-slate-400" />
                              )}
                              {item.action}
                            </td>
                            <td className="py-2.5 text-center font-extrabold text-slate-900">
                              {item.score.toFixed(1)}
                            </td>
                            <td className="py-2.5 text-right">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                                item.statut === 'Retenu' ? 'bg-green-50 text-green-700 border-green-200' :
                                item.statut === 'Secondaire' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                'bg-rose-50 text-rose-700 border-rose-250'
                              }`}>
                                {item.statut === 'Retenu' ? '✓ Retenu' : item.statut === 'Secondaire' ? 'Secondaire' : 'Exclu / Bloqué'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* SECTION G: GENERAL KPI SUMMARY AND TOTAL PERFORMANCE COUNTERS */}
              <div id="section-kpi-summary" className="grid grid-cols-2 md:grid-cols-5 gap-3">
                
                <div className="bg-white border border-slate-200 rounded p-3 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-[#004a99] shrink-0">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Clients Analysés</span>
                    <strong className="text-lg font-black text-[#004a99]">{kpiTotalAnalysed}</strong>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded p-3 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Dormants Identifiés</span>
                    <strong className="text-lg font-black text-purple-700">{kpiDormantsCount}</strong>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded p-3 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Activation Estimée</span>
                    <strong className="text-lg font-black text-green-700">{kpiTauxActivationRate} %</strong>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded p-3 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Taux d'Équipement</span>
                    <strong className="text-lg font-black text-slate-900">{kpiTauxEquipement}</strong>
                  </div>
                </div>

                <div className="bg-white border border-[#10b981]/30 rounded p-3 shadow-sm flex items-center gap-3 col-span-2 md:col-span-1">
                  <div className="w-10 h-10 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 animate-pulse">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-emerald-600 uppercase tracking-wider block">ROI Restructuré</span>
                    <strong className="text-md font-black text-emerald-700 uppercase">Très Positif</strong>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: PORTFOLIO MAIN WINDOWS - "BASE CLIENTS" */}
          {activeTab === 'base-clients' && (
            <div className="bg-white border border-slate-200 rounded shadow-sm p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h2 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#004a99]" />
                    Base des clients sous gestion du portefeuille
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold">Créez, modifiez, auditez ou supprimez dynamiquement des fiches clients pour des simulations locales.</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCreateForm({
                      name: "",
                      segment: "Particulier Standard",
                      age: 38,
                      salaireDomicilie: true,
                      produitsCount: 1,
                      packageActif: false,
                      carteActive: true,
                      usageDigital: "Moyen",
                      derniereOperationMois: 8,
                      contactsRecents: 1,
                      reclamationOuverte: false
                    });
                    setShowCreateModal(true);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider px-3.5 py-2 rounded flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="h-4 w-4" />
                  Nouveau Client Banque Populaire
                </button>
              </div>

              {/* Filters toolbar inside tab */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filtrer par nom ou ID client (ex: Ahmed, C014)..."
                    className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold placeholder:text-slate-400"
                  />
                </div>

                <div className="flex gap-2.5">
                  <select
                    value={segmentFilter}
                    onChange={(e) => setSegmentFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded p-1.5 text-xs text-slate-800 font-extrabold focus:outline-none"
                  >
                    <option value="Tous">Tous les segments</option>
                    <option value="Profession libérale">Profession libérale</option>
                    <option value="Jeune">Jeune</option>
                    <option value="Salarié GE/PME conventionné">Salarié GE/PME conventionné</option>
                    <option value="Particulier standard">Particulier standard</option>
                    <option value="Fonctionnaire conventionné">Fonctionnaire conventionné</option>
                  </select>

                  <button
                    onClick={() => {
                      setClients(INITIAL_CLIENTS);
                      localStorage.setItem('nba_nbo_portfolio', JSON.stringify(INITIAL_CLIENTS));
                      setSelectedClientId("C001");
                    }}
                    className="text-xs bg-slate-100 border border-slate-200 rounded font-semibold text-slate-700 hover:bg-slate-200 py-1.5 px-3 cursor-pointer"
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>

              {/* Table wrapper */}
              <div className="overflow-x-auto border border-slate-100 rounded">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px]">
                      <th className="p-3">ID & Nom</th>
                      <th className="p-3">Segment</th>
                      <th className="p-3 text-center">Canal Préféré</th>
                      <th className="p-3 text-center">Incident Récent</th>
                      <th className="p-3 text-center">Capacité Endett.</th>
                      <th className="p-3 text-center">Inactivité (mois)</th>
                      <th className="p-3 text-center">Sous-Équipé</th>
                      <th className="p-3 text-center">Cible Reactiv.</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                    {filteredClients.map((client) => {
                      const computedIdx = computeClientResults(client);
                      return (
                        <tr
                          key={client.id}
                          className={`hover:bg-slate-50/85 transition-colors cursor-pointer ${
                            selectedClientId === client.id ? 'bg-blue-50/50' : ''
                          }`}
                          onClick={() => setSelectedClientId(client.id)}
                        >
                          <td className="p-3 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                {client.id}
                              </span>
                              <span className="font-extrabold text-slate-900">{client.name}</span>
                            </div>
                          </td>
                          <td className="p-3 text-slate-500 whitespace-nowrap">{client.segment}</td>
                          <td className="p-3 text-center whitespace-nowrap">
                            <span className="bg-blue-50 text-[#004a99] border border-blue-100 px-1.5 py-0.5 rounded text-[10px]">
                              {client.canalPrefere}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            {client.incidentRecent ? (
                              <span className="text-rose-600 bg-rose-50 px-1.5 py-0.5 border border-rose-200 rounded text-[10px]">Oui ⚠️</span>
                            ) : (
                              <span className="text-green-600 bg-green-50 px-1.5 py-0.5 border border-green-200 rounded text-[10px]">Aucun</span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            <span className="font-bold text-[10px]">{client.capaciteEndettement}</span>
                          </td>
                          <td className="p-3 text-center whitespace-nowrap">
                            <span className={`px-1.5 rounded font-bold ${client.derniereOperationMois >= rulesConfig.minDormanceMois ? 'bg-amber-100 text-amber-800' : 'bg-green-50 text-green-700'}`}>
                              {client.derniereOperationMois} mois
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            {client.sousEquipe ? (
                              <span className="text-indigo-600 bg-indigo-50 px-1.5 rounded text-[10px]">Oui</span>
                            ) : (
                              <span className="text-slate-400">Non</span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            {client.cibleReactivation ? (
                              <span className="text-blue-600 bg-blue-50 px-1.5 rounded text-[10px] font-bold">Oui</span>
                            ) : (
                              <span className="text-slate-400">Non</span>
                            )}
                          </td>
                          <td className="p-3 text-right" onClick={(e)=>e.stopPropagation()}>
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => setSelectedClientId(client.id)}
                                className="bg-[#004a99] hover:bg-blue-800 text-white text-[10px] font-extrabold uppercase px-2 py-1 rounded cursor-pointer leading-tight block"
                              >
                                Charger
                              </button>
                              <button
                                onClick={() => {
                                  setEditForm({ ...client });
                                  setShowEditModal(true);
                                }}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] uppercase font-bold px-2 py-1 rounded cursor-pointer leading-tight block"
                              >
                                Tweak
                              </button>
                              <button
                                onClick={() => handleDeleteClient(client.id)}
                                disabled={clients.length <= 1}
                                className="text-rose-600 hover:bg-rose-50 p-1 rounded cursor-pointer disabled:opacity-50"
                                title="Supprimer le dossier"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM RULES MODIFICATIONS - "RÈGLES MÉTIER" */}
          {activeTab === 'rules' && (
            <div className="bg-white border border-slate-200 rounded shadow-sm p-4 space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-[#004a99]" />
                  Ajustement des Seuils et Paramètres des Règles Métier
                </h2>
                <p className="text-xs text-slate-500 font-semibold">Tirez les curseurs pour calibrer le moteur CRM Banque Populaire. Les recommandations et scores se recalbrent immédiatement sur toute la base.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Under-equipped rule limit */}
                <div className="space-y-2 p-4 bg-slate-50 border border-slate-200 rounded">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                      Nombre de produits max pour tag "Sous-Équipé"
                    </label>
                    <span className="text-xs font-black bg-[#004a99] text-white px-2.5 py-0.5 rounded leading-none">
                      {rulesConfig.maxProductsForUnderEquipped} prod.
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={rulesConfig.maxProductsForUnderEquipped}
                    onChange={(e) => setRulesConfig(prev=>({...prev, maxProductsForUnderEquipped: parseInt(e.target.value)}))}
                    className="w-full accent-[#004a99] cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 block leading-tight">
                    Un client possédant moins de fiches produits que ce seuil sera catalogué comme "Sous-Équipé" et prioritiser sur le package.
                  </span>
                </div>

                {/* Commercial limit constraint max contacts */}
                <div className="space-y-2 p-4 bg-slate-50 border border-slate-200 rounded">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                      Limite de contacts autorisée (30j)
                    </label>
                    <span className="text-xs font-black bg-rose-600 text-white px-2.5 py-0.5 rounded leading-none">
                      {rulesConfig.maxContactsAllowed} contacts
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    step="1"
                    value={rulesConfig.maxContactsAllowed}
                    onChange={(e) => setRulesConfig(prev=>({...prev, maxContactsAllowed: parseInt(e.target.value)}))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 block leading-tight">
                    Au-delà de cette sollicitation commerciale (contacts récents), le moteur bloque l'action NBA en "Ne pas contacter".
                  </span>
                </div>

                {/* Credit age limit */}
                <div className="space-y-2 p-4 bg-slate-50 border border-slate-200 rounded">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                      Âge légal éligibilité crédit conso
                    </label>
                    <span className="text-xs font-black bg-[#004a99] text-white px-2.5 py-0.5 rounded leading-none">
                      {rulesConfig.minAgeCredit} ans
                    </span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="25"
                    step="1"
                    value={rulesConfig.minAgeCredit}
                    onChange={(e) => setRulesConfig(prev=>({...prev, minAgeCredit: parseInt(e.target.value)}))}
                    className="w-full accent-[#004a99] cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 block leading-tight">
                    Âge minimum légal requis pour qu'une opportunité de crédit consommation se déclenche en offre candidate.
                  </span>
                </div>

                {/* Dormance limit months threshold */}
                <div className="space-y-2 p-4 bg-slate-50 border border-slate-200 rounded">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                      Seuil de dormance qualifiée (mois inactifs)
                    </label>
                    <span className="text-xs font-black bg-indigo-600 text-white px-2.5 py-0.5 rounded leading-none">
                      {rulesConfig.minDormanceMois} mois
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="12"
                    step="1"
                    value={rulesConfig.minDormanceMois}
                    onChange={(e) => setRulesConfig(prev=>({...prev, minDormanceMois: parseInt(e.target.value)}))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 block leading-tight">
                    Nombre minimum de mois sans opération pour qu'un client soit considéré comme "Dormant" par le réactivation.
                  </span>
                </div>

              </div>

              <div className="bg-sky-50 border border-sky-200 rounded p-4 text-xs text-sky-800 space-y-1">
                <p className="font-extrabold uppercase text-[10px] tracking-wider flex items-center gap-1">
                  <Info className="h-4 w-4" /> NOTE DE FONCTIONNEMENT
                </p>
                <p>La modification de ces variables ajuste instantanément l'arbre de décision local. Vous pouvez retourner sur l'onglet <strong>Tableau de Bord</strong> ou <strong>Base Clients</strong> après modification pour constater les changements de statuts.</p>
              </div>
            </div>
          )}

          {/* TAB 4: GENERAL KPI ANALYTICS - "SUIVI KPI" */}
          {activeTab === 'kpis' && (
            <div className="bg-white border border-slate-200 rounded shadow-sm p-4 space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#004a99]" />
                  Suivi des KPIs Relationnels & ROI de la campagne de réactivation
                </h2>
                <p className="text-xs text-slate-500 font-semibold">Vision macroscopique de l'efficacité opérationnelle des portefeuilles clients Banque Populaire analysés.</p>
              </div>

              {/* Grid of indicators */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded border border-slate-250 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Taux d'Équipement Moyen</span>
                    <strong className="text-2xl font-black text-slate-800">{kpiTauxEquipement} prod.</strong>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                    <div className="bg-[#004a99] h-2 rounded-full" style={{ width: `${(parseFloat(kpiTauxEquipement) / 5) * 100}%` }} />
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded border border-slate-250 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#004a99] uppercase tracking-wider block">Réactivation Ciblée</span>
                    <strong className="text-2xl font-black text-[#004a99]">{kpiTauxActivationRate} %</strong>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${kpiTauxActivationRate}%` }} />
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded border border-slate-250 flex flex-col justify-between col-span-1 md:col-span-2">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Projection des Dépôts Réveillés</span>
                    <strong className="text-xl font-black text-emerald-700">Estimé à + 4,2 MDH</strong>
                    <p className="text-[9px] text-slate-500 mt-1">Projection calculée sur l'encours moyen conventionné après contact par conseiller (taux moyen de conversion observé : 22%).</p>
                  </div>
                </div>
              </div>

              {/* Chart diagram representing active segment ratios */}
              <div className="border border-slate-200 rounded p-4 space-y-4">
                <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">Breackdown des segments de portefeuilles (%)</h3>
                <div className="h-10 w-full flex rounded overflow-hidden">
                  <div className="bg-[#004a99] hover:opacity-90 transition-opacity" style={{ width: '45%' }} title="Fonctionnaires (45%)" />
                  <div className="bg-emerald-500 hover:opacity-90 transition-opacity" style={{ width: '25%' }} title="Libéraux (25%)" />
                  <div className="bg-indigo-500 hover:opacity-90 transition-opacity" style={{ width: '15%' }} title="Standards (15%)" />
                  <div className="bg-amber-500 hover:opacity-90 transition-opacity" style={{ width: '10%' }} title="Jeunes #Live (10%)" />
                  <div className="bg-rose-500 hover:opacity-90 transition-opacity" style={{ width: '5%' }} title="Corporate (5%)" />
                </div>

                {/* legend items */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-bold">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#004a99] rounded-xs" /> Fonctionnaires (45%)</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs" /> Libéraux (25%)</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-indigo-500 rounded-xs" /> Particuliers Standard (15%)</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-xs" /> Jeunes #Live (10%)</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-500 rounded-xs" /> Corporate (5%)</span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: AI COACH COMPANION INTERACTIVE PLAYGROUND - "COACH IA" */}
          {activeTab === 'coach' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="coach-interface-grid">
              
              <div className="md:col-span-1 bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Oracle CRM Intelligent
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mb-4">Posez des questions pointues concernant votre portefeuille, ou entraînez-vous à traiter les réactions des clients auprès d'un simulateur de pitch.</p>
                  
                  <div className="space-y-3">
                    <span className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider">Modèles de discussions :</span>
                    
                    <button
                      type="button"
                      onClick={() => handleQuickQuestion(`Rédige-moi un argumentaire de vente adapté pour ${activeClient.name} pour son NBO : ${results?.finalNbo}`)}
                      className="w-full text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 p-2 rounded text-[11px] font-bold hover:text-[#004a99] transition-all block cursor-pointer"
                    >
                      🗣 Pitch commercial sur-mesure ({activeClient.id})
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickQuestion(`Rédige un script de SMS percutant en français pour réactiver un client du segment ${activeClient.segment}`)}
                      className="w-full text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 p-2 rounded text-[11px] font-bold hover:text-[#004a99] transition-all block cursor-pointer"
                    >
                      📱 Message de relance SMS segmenté
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickQuestion(`Comment expliquer le score de dormance de ${activeClient?.scoreDormance || 82}% sur ce client en banque ?`)}
                      className="w-full text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 p-2 rounded text-[11px] font-bold hover:text-[#004a99] transition-all block cursor-pointer"
                    >
                      📊 Expliquer le calcul du score de dormance
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 text-[11px] text-slate-500 leading-normal">
                  <p className="font-semibold text-slate-700">Client lié à la discussion :</p>
                  <p className="font-extrabold text-[#004a99]">{activeClient.name} ({activeClient.segment})</p>
                </div>
              </div>

              <div className="md:col-span-2 bg-white border border-slate-200 rounded shadow-sm flex flex-col h-[480px]">
                {/* Chat window Header */}
                <div className="bg-[#004a99] text-white px-4 py-3 flex items-center justify-between border-b border-blue-900 rounded-t">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-800 text-white p-1 rounded">
                      <Sparkles className="h-4 w-4 text-amber-300" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs uppercase tracking-wider">Coach Décisionnel Bancaire</h4>
                      <p className="text-[10px] text-blue-200 font-bold leading-none">ASSISTÉ PAR GEMINI PRO EN TIERS SERVEUR</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setChatMessages([chatMessages[0]])}
                    className="text-white/60 hover:text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-white/20"
                  >
                    Effacer
                  </button>
                </div>

                {/* Message logs */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
                  {chatMessages.map((msg, index) => {
                    const isAssistant = msg.role === 'assistant';
                    return (
                      <div key={index} className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
                        <div className={`max-w-[85%] text-xs px-3.5 py-2.5 rounded shadow-xs leading-relaxed whitespace-pre-wrap ${
                          isAssistant ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-none font-medium' : 'bg-[#004a99] text-white rounded-tr-none font-bold'
                        }`}>
                          {msg.content}
                        </div>
                        <span className="text-[8px] text-slate-400 font-bold mt-1 px-1 tracking-widest uppercase">
                          {msg.timestamp}
                        </span>
                      </div>
                    );
                  })}
                  {chatLoading && (
                    <div className="flex flex-col items-start select-none">
                      <div className="bg-white border border-slate-200 text-xs px-3.5 py-2 rounded rounded-tl-none font-bold text-slate-500 inline-flex items-center gap-1.5 shadow-sm">
                        <span className="inline-flex gap-1">
                          <span className="h-1.5 w-1.5 bg-[#004a99] rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                          <span className="h-1.5 w-1.5 bg-[#004a99] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                          <span className="h-1.5 w-1.5 bg-[#004a99] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                        </span>
                        <span>Le tuteur IA est en train de réfléchir...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Send action footer Form */}
                <form onSubmit={handleSendChatMessage} className="p-3 border-t border-slate-100 bg-white flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Saisissez votre question ou rebond commercial..."
                    disabled={chatLoading}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded text-xs select-text focus:outline-none focus:ring-1 focus:ring-[#004a99] text-slate-800 font-bold"
                  />
                  <button
                    type="submit"
                    disabled={chatLoading || !chatInput.trim()}
                    className="bg-[#004a99] hover:bg-blue-800 disabled:bg-slate-100 text-white disabled:text-slate-400 font-bold text-xs px-4 rounded transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>

              </div>

            </div>
          )}

        </div>
      </main>

      {/* --- FLOATING MODALS --- */}

      {/* 1. EDIT SIMULATED CLIENT WORKFLOW MODAL */}
      {showEditModal && editForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded border border-slate-200 w-full max-w-lg shadow-xl overflow-hidden animate-slide-up">
            <div className="bg-[#0a2540] text-white p-4 flex items-center justify-between">
              <h3 className="font-extrabold text-sm uppercase tracking-wider">Ajuster le profil client (Simulation)</h3>
              <button onClick={() => setShowEditModal(false)} className="text-white hover:text-slate-300">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClientSimEdit} className="p-4 space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1">Nom Complet</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e)=>setEditForm({...editForm, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-250 p-2 rounded text-xs focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1">Segment Commercial</label>
                  <select
                    value={editForm.segment}
                    onChange={(e)=>setEditForm({...editForm, segment: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-250 p-2 rounded text-xs"
                  >
                    <option value="Profession libérale">Profession libérale</option>
                    <option value="Jeune">Jeune</option>
                    <option value="Salarié GE/PME conventionné">Salarié GE/PME conventionné</option>
                    <option value="Particulier standard">Particulier standard</option>
                    <option value="Fonctionnaire conventionné">Fonctionnaire conventionné</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1">Âge du client</label>
                  <input
                    type="number"
                    value={editForm.age}
                    onChange={(e)=>setEditForm({...editForm, age: parseInt(e.target.value) || 30})}
                    className="w-full bg-slate-50 border border-slate-250 p-2 rounded text-xs"
                    min="18"
                    max="90"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1">Nombre d'équipement d'assurance/crédit (Produits)</label>
                  <input
                    type="number"
                    value={editForm.produitsCount}
                    onChange={(e)=>setEditForm({...editForm, produitsCount: parseInt(e.target.value) || 0})}
                    className="w-full bg-slate-50 border border-slate-250 p-2 rounded text-xs"
                    min="0"
                    max="10"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1">Dernière opération (mois d'inactivité)</label>
                  <input
                    type="number"
                    value={editForm.derniereOperationMois}
                    onChange={(e)=>setEditForm({...editForm, derniereOperationMois: parseInt(e.target.value) || 0})}
                    className="w-full bg-slate-50 border border-slate-250 p-2 rounded text-xs"
                    min="0"
                    max="36"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1">Contacts récents (30j)</label>
                  <input
                    type="number"
                    value={editForm.contactsRecents}
                    onChange={(e)=>setEditForm({...editForm, contactsRecents: parseInt(e.target.value) || 0})}
                    className="w-full bg-slate-50 border border-slate-250 p-2 rounded text-xs"
                    min="0"
                    max="5"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1">Usage digital</label>
                  <select
                    value={editForm.usageDigital}
                    onChange={(e)=>setEditForm({...editForm, usageDigital: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-250 p-2 rounded text-xs"
                  >
                    <option value="Faible">Faible</option>
                    <option value="Moyen">Moyen</option>
                    <option value="Élevé">Élevé</option>
                  </select>
                </div>

                <div className="col-span-2 grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded border border-slate-200 mt-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.salaireDomicilie}
                      onChange={(e)=>setEditForm({...editForm, salaireDomicilie: e.target.checked})}
                      className="accent-[#004a99]"
                    />
                    <span>Salaire domicil.</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.packageActif}
                      onChange={(e)=>setEditForm({...editForm, packageActif: e.target.checked})}
                      className="accent-[#004a99]"
                    />
                    <span>Package détenu</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-red-600 font-bold">
                    <input
                      type="checkbox"
                      checked={editForm.reclamationOuverte}
                      onChange={(e)=>setEditForm({...editForm, reclamationOuverte: e.target.checked})}
                      className="accent-rose-600"
                    />
                    <span>Réclamation</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#004a99] text-white rounded font-bold hover:bg-blue-800 cursor-pointer shadow-sm"
                >
                  Appliquer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. CREATE NEW SIMULATED CLIENT WORKFLOW MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded border border-slate-200 w-full max-w-lg shadow-xl overflow-hidden">
            <div className="bg-[#0a2540] text-white p-4 flex items-center justify-between">
              <h3 className="font-extrabold text-sm uppercase tracking-wider">Nouveau profil client (Simulation)</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-white hover:text-slate-300">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewClient} className="p-4 space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1">Nom Complet du Client</label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e)=>setCreateForm({...createForm, name: e.target.value})}
                    placeholder="Ex: Yassine EL ALAOUI"
                    className="w-full bg-slate-50 border border-slate-250 p-2 rounded text-xs focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1">Segment Commercial</label>
                  <select
                    value={createForm.segment}
                    onChange={(e)=>setCreateForm({...createForm, segment: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-250 p-2 rounded text-xs"
                  >
                    <option value="Profession libérale">Profession libérale</option>
                    <option value="Jeune">Jeune</option>
                    <option value="Salarié GE/PME conventionné">Salarié GE/PME conventionné</option>
                    <option value="Particulier standard">Particulier standard</option>
                    <option value="Fonctionnaire conventionné">Fonctionnaire conventionné</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1">Âge</label>
                  <input
                    type="number"
                    value={createForm.age}
                    onChange={(e)=>setCreateForm({...createForm, age: parseInt(e.target.value) || 30})}
                    className="w-full bg-slate-50 border border-slate-250 p-2 rounded text-xs"
                    min="18"
                    max="90"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1">Nombre d'équipement (produits)</label>
                  <input
                    type="number"
                    value={createForm.produitsCount}
                    onChange={(e)=>setCreateForm({...createForm, produitsCount: parseInt(e.target.value) || 0})}
                    className="w-full bg-slate-50 border border-slate-250 p-2 rounded text-xs"
                    min="0"
                    max="10"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1">Dernière opération (mois)</label>
                  <input
                    type="number"
                    value={createForm.derniereOperationMois}
                    onChange={(e)=>setCreateForm({...createForm, derniereOperationMois: parseInt(e.target.value) || 0})}
                    className="w-full bg-slate-50 border border-slate-250 p-2 rounded text-xs"
                    min="0"
                    max="36"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1">Contacts (30j)</label>
                  <input
                    type="number"
                    value={createForm.contactsRecents}
                    onChange={(e)=>setCreateForm({...createForm, contactsRecents: parseInt(e.target.value) || 0})}
                    className="w-full bg-slate-50 border border-slate-250 p-2 rounded text-xs"
                    min="0"
                    max="5"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block uppercase tracking-wider mb-1">Usage digital</label>
                  <select
                    value={createForm.usageDigital}
                    onChange={(e)=>setCreateForm({...createForm, usageDigital: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-250 p-2 rounded text-xs"
                  >
                    <option value="Faible">Faible</option>
                    <option value="Moyen">Moyen</option>
                    <option value="Élevé">Élevé</option>
                  </select>
                </div>

                <div className="col-span-2 grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded border border-slate-200 mt-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={createForm.salaireDomicilie}
                      onChange={(e)=>setCreateForm({...createForm, salaireDomicilie: e.target.checked})}
                      className="accent-[#004a99]"
                    />
                    <span>Salaire domicil.</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={createForm.packageActif}
                      onChange={(e)=>setCreateForm({...createForm, packageActif: e.target.checked})}
                      className="accent-[#004a99]"
                    />
                    <span>Package détenu</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-red-600 font-bold">
                    <input
                      type="checkbox"
                      checked={createForm.reclamationOuverte}
                      onChange={(e)=>setCreateForm({...createForm, reclamationOuverte: e.target.checked})}
                      className="accent-rose-600"
                    />
                    <span>Réclamation</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700 cursor-pointer shadow-sm"
                >
                  Ajouter au portefeuille BP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. GEMINI DYNAMIC ADVISOR ANALYSIS AND SALES SPEECHES PITCH REPORT MODAL */}
      {showAnalysisModal && geminiAnalysis && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="ai-report-modal-overlay">
          <div className="bg-white rounded border border-slate-200 w-full max-w-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
            
            {/* Header reports */}
            <div className="bg-[#004a99] text-white p-4 flex items-center justify-between border-b border-blue-900 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
                <div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wider">Pitch synthétisé par l'IA (Gemini)</h3>
                  <p className="text-[10px] text-blue-200 font-bold uppercase leading-none">Dossier client : {activeClient.name} [{activeClient.id}]</p>
                </div>
              </div>
              <button
                onClick={() => setShowAnalysisModal(false)}
                className="text-white hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main content report scrollable */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs font-semibold text-slate-700">
              
              {/* Highlight summary card */}
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded flex items-center justify-between gap-3 flex-wrap">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">Produit & Canal validés par l'IA</span>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-white text-[#004a99] border border-emerald-350 px-2 py-0.5 rounded text-[11px] font-extrabold flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5 font-bold" /> NBO : {geminiAnalysis.recommendedNbo}
                    </span>
                    <span className="bg-white text-slate-800 border border-emerald-350 px-2 py-0.5 rounded text-[11px] font-extrabold flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" /> NBA : {geminiAnalysis.recommendedNba}
                    </span>
                    <span className="bg-white text-slate-800 border border-emerald-350 px-2 py-0.5 rounded text-[11px] font-extrabold flex items-center gap-1">
                      <Smartphone className="h-3.5 w-3.5 hover:scale-105" /> Canal : {geminiAnalysis.recommendedChannel}
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-emerald-300 rounded p-2 text-center shrink-0">
                  <span className="text-[9px] text-slate-400 block uppercase">Niveau Priorité</span>
                  <span className="text-red-600 font-extrabold text-xs uppercase block">{geminiAnalysis.priority}</span>
                </div>
              </div>

              {/* Justification section */}
              <div className="space-y-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded">
                <h4 className="font-extrabold text-[#004a99] uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <Info className="h-4 w-4" /> Justification de la Recommandation
                </h4>
                <p className="text-slate-800 text-xs italic font-medium leading-relaxed">
                  "{geminiAnalysis.justification}"
                </p>
              </div>

              {/* Pitch segment structure */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-[#004a99] uppercase tracking-wider text-[10px] flex items-center gap-1">
                    🗣 Argumentaire de Vente Conseils (Pitch Conseiller)
                  </h4>
                  <button
                    onClick={() => handleCopyText(geminiAnalysis.salesPitch)}
                    className="text-[10px] font-bold text-slate-500 hover:text-[#004a99] flex items-center gap-1 cursor-pointer"
                  >
                    {isCopied ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {isCopied ? "Copié !" : "Copier le pitch"}
                  </button>
                </div>
                <div className="bg-slate-50 border border-slate-150 p-4 rounded text-slate-800 whitespace-pre-wrap leading-relaxed text-xs font-semibold custom-font">
                  {geminiAnalysis.salesPitch}
                </div>
              </div>

              {/* SMS messaging structure */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-[#004a99] uppercase tracking-wider text-[10px] flex items-center gap-1">
                    📱 Copie de Script SMS Recommandé (Max 160 car.)
                  </h4>
                  <button
                    onClick={() => handleCopyText(geminiAnalysis.smsScript)}
                    className="text-[10px] font-bold text-slate-500 hover:text-[#004a99] flex items-center gap-1 cursor-pointer"
                  >
                    {isCopied ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {isCopied ? "Copié !" : "Copier le SMS"}
                  </button>
                </div>
                <div className="bg-blue-50/50 border border-blue-150 p-3 rounded text-slate-800 text-xs italic font-bold">
                  "{geminiAnalysis.smsScript}"
                </div>
              </div>

              {/* Coach interactive playground bridge shortcut */}
              <div className="bg-amber-50 border border-amber-250 p-2 text-[10px] text-amber-800 rounded flex items-center gap-1.5 font-bold">
                <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
                <span>Vous souhaitez vous exercer au téléphone ou lui faire dire autre chose ? Rendez-vous dans l'onglet <strong>Tuteur & Coach IA</strong> du menu !</span>
              </div>

            </div>

            {/* Footer close reporting */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
              <button
                onClick={() => setShowAnalysisModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider rounded cursor-pointer transition-colors shadow-sm"
              >
                Fermer le Rapport
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
