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
    event: "UIC Conference 2025",
    date: "2025",
    location: "",
    talkTitle: "",
    url: "",
    description:
      "Invited talk and discussions with attendees at the UIC 2025 conference.",
    photos: [
      {
        src: "/speaking/speaking-stage.jpg",
        alt: "Mahmoud Halim speaking with a microphone in front of the audience at the UIC 2025 conference",
        caption: "On stage with the microphone — wide view of the venue.",
      },
      {
        src: "/speaking/speaking-networking.jpg",
        alt: "Mahmoud Halim discussing with fellow attendees between sessions at the UIC 2025 conference",
        caption: "Between sessions — questions and discussions in the foyer.",
      },
    ],
  },
];
