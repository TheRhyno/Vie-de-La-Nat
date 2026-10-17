// ✏️ TOUT CE QUI SE PERSONNALISE EST ICI (textes, liens, données)
export const SITE = {
  nom: "Lycée Hub",
  // Un lundi d'une semaine A (format AAAA-MM-JJ) : sert de référence au calcul A/B
  semaineAReference: "2026-09-07",
  liens: [
    { nom: "Pronote", icone: "📒", url: "https://ferdinand-buisson.ent.auvergnerhonealpes.fr/" }
  ],
  // Menu de la cantine : remplace le fichier menu.pdf chaque semaine (même nom !)
  menuPdf: "menu.pdf",
  // Prochains événements (date + heure ISO)
  evenements: [
    { nom: "Vacances de la Toussaint", date: "2026-10-17T12:00:00" },
    { nom: "Vacances de Noël",         date: "2026-12-19T12:00:00" },
    { nom: "Épreuve de spécialité du BAC", date: "2027-03-15T08:00:00" },
    { nom: "Philosophie (BAC)",        date: "2027-06-15T08:00:00" }
  ],
  matieres: ["Maths", "Français", "Histoire-Géo", "Anglais", "Physique-Chimie", "SVT", "SES", "Autre"],
  typesConseil: ["Conseil", "Aide", "Fiche de révision"],
  clubs: [
    { nom: "Club Théâtre", horaire: "Mardi 17h-19h", salle: "Salle 12", desc: "Improvisation et mise en scène." },
    { nom: "Club Échecs",  horaire: "Jeudi 12h30",   salle: "CDI",      desc: "Tous niveaux, tournois internes." },
    { nom: "Journal du lycée", horaire: "Vendredi 13h", salle: "Salle 3", desc: "Écris, photographie, publie." }
  ],
  lieux: ["Kebab", "Boulangerie", "Tacos", "Supermarché"],
  // Changez l'id chaque semaine pour démarrer un nouveau sondage vierge
  sondage: {
    id: "2026-s42",
    question: "Quelle animation pour la fin de période ?",
    options: ["Tournoi de foot", "Soirée jeux", "Concert lycéen", "Vente de crêpes"]
  }
};
