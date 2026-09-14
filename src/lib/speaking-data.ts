export type SpeakingPhoto = {
  src: string;
  alt: string;
  caption: string;
};

export type SpeakingEvent = {
  /** Conference / event name shown as the card title. */
  event: string;
  /** When the talk happened, e.g. "2025" or "June 2025". */
  date: string;
  /** Venue city/country if known; leave "" to hide. */
  location: string;
  /** Talk title; leave "" to hide. */
  talkTitle: string;
  /** Link to the event page, recording, or LinkedIn post; leave "" to hide. */
  url: string;
  /** One-sentence context shown under the title. */
  description: string;
  photos: SpeakingPhoto[];
};

/**
 * Speaking engagements shown on /speaking and the home page teaser.
 * Photo files live in public/speaking/.
 */
export const speakingEvents: SpeakingEvent[] = [
  {
    event: "CrowdStrike Adversary Simulation",
    date: "11 July 2026",
    location: "",
    talkTitle: "See More, Stop More",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7486366734661124096/",
    description:
      "Presented “See More, Stop More” at CrowdStrike’s Adversary Simulation event — on detection visibility and stopping more adversaries.",
    photos: [
      {
        src: "/speaking/speaking-stage.jpg",
        alt: "Mahmoud Halim presenting “See More, Stop More” with a microphone at the CrowdStrike Adversary Simulation event",
        caption: "On stage — presenting “See More, Stop More”.",
      },
      {
        src: "/speaking/speaking-networking.jpg",
        alt: "Mahmoud Halim discussing with fellow attendees between sessions at the CrowdStrike Adversary Simulation event",
        caption: "Between sessions — questions and discussions in the foyer.",
      },
    ],
  },
];
