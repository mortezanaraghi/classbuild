import type { PhraseCategory } from './types';

const storytelling: PhraseCategory = {
  id: 'storytelling',
  title: 'Storytelling',
  subtitle: 'Narrative connectives & flow',
  emoji: '🗣️',
  color: 'from-violet-900 to-purple-950',
  description: 'Phrases that carry stories forward with natural rhythm and timing.',
  phrases: [
    { id: 's1', text: "The moment I walked into that room, I knew everything was about to change.", difficulty: 1 },
    { id: 's2', text: "Looking back now, I can see exactly how each small decision led us to where we are today.", difficulty: 2 },
    { id: 's3', text: "It wasn't until much later that I finally understood what had really happened.", difficulty: 1 },
    { id: 's4', text: "And just when things seemed to be going smoothly, everything fell apart at once.", difficulty: 1 },
    { id: 's5', text: "The turning point came completely out of nowhere, as it so often does in these situations.", difficulty: 2, tip: "Breathe before 'as it so often does' — it's a natural pause point." },
    { id: 's6', text: "I remember thinking at the time that this was just a minor setback, nothing more.", difficulty: 1 },
    { id: 's7', text: "What nobody told me was that the hardest part wasn't starting — it was keeping going.", difficulty: 2, tip: "The dash is a dramatic pause. Use it!" },
    { id: 's8', text: "That experience changed the way I see everything, and I've never looked at it the same way since.", difficulty: 2 },
  ],
};

const transitions: PhraseCategory = {
  id: 'transitions',
  title: 'Smooth Transitions',
  subtitle: 'Link your ideas with confidence',
  emoji: '🔗',
  color: 'from-blue-900 to-indigo-950',
  description: 'Connect ideas fluently without reaching for "um" or "so".',
  phrases: [
    { id: 't1', text: "Building on that point, I'd like to add something that I think is equally important.", difficulty: 1 },
    { id: 't2', text: "That said, there is another perspective here that's definitely worth exploring.", difficulty: 1 },
    { id: 't3', text: "To bring all of this together, the answer really comes down to three core things.", difficulty: 1 },
    { id: 't4', text: "With that context in mind, let's take a closer look at what this means in practice.", difficulty: 2 },
    { id: 't5', text: "Now, you might be wondering how this connects to what we discussed earlier.", difficulty: 1 },
    { id: 't6', text: "Let me take a moment to make sure we're all on the same page before moving forward.", difficulty: 2, tip: "Say this slowly and deliberately — it's meant to slow the pace." },
    { id: 't7', text: "What this really boils down to is a straightforward question of priorities.", difficulty: 1 },
    { id: 't8', text: "And that brings me to the most important point I want to make today.", difficulty: 1 },
  ],
};

const persuasion: PhraseCategory = {
  id: 'persuasion',
  title: 'Confident Persuasion',
  subtitle: 'Phrases that move people',
  emoji: '💡',
  color: 'from-amber-900 to-orange-950',
  description: 'Sound decisive and trustworthy when making your case.',
  phrases: [
    { id: 'p1', text: "I genuinely believe that this approach is the right one for all of us moving forward.", difficulty: 1 },
    { id: 'p2', text: "What excites me most about this opportunity is the potential for meaningful, lasting change.", difficulty: 2 },
    { id: 'p3', text: "I've thought about this very carefully, and I'm confident in the direction we're heading.", difficulty: 2, tip: "Don't rush 'I've thought about this' — let it land." },
    { id: 'p4', text: "The reason I feel so strongly about this is because I've seen it work with my own eyes.", difficulty: 2 },
    { id: 'p5', text: "When I look at all the evidence, I see one clear path forward, and I want to share it with you.", difficulty: 2 },
    { id: 'p6', text: "I don't say this lightly, but I genuinely believe this could be a game changer for all of us.", difficulty: 2 },
    { id: 'p7', text: "The data supports this, the logic supports this, and frankly, so does my gut feeling.", difficulty: 2, tip: "Each 'this' is a beat — own each one." },
    { id: 'p8', text: "Give this approach a fair chance, and I think you'll be genuinely surprised by what's possible.", difficulty: 1 },
  ],
};

const casual: PhraseCategory = {
  id: 'casual',
  title: 'Natural Conversation',
  subtitle: 'Sound warm and effortless',
  emoji: '☕',
  color: 'from-emerald-900 to-teal-950',
  description: 'Everyday phrases that sound natural and put people at ease.',
  phrases: [
    { id: 'c1', text: "That's a really interesting perspective — I hadn't thought about it quite that way before.", difficulty: 1 },
    { id: 'c2', text: "Honestly, I think the answer is a lot more nuanced than it first appears.", difficulty: 1 },
    { id: 'c3', text: "You know, I was just thinking about something very similar to this the other day.", difficulty: 1, tip: "'You know' is fine here — it's natural, not a filler." },
    { id: 'c4', text: "That's a fair point — let me take a moment to think about how to put this into words.", difficulty: 1 },
    { id: 'c5', text: "I'd genuinely love to hear more about your experience with that, if you're open to sharing.", difficulty: 2 },
    { id: 'c6', text: "It's funny you mention that, because I was just reading something on exactly this topic.", difficulty: 2 },
    { id: 'c7', text: "I completely agree, and I actually think there's an even bigger picture to consider here.", difficulty: 1 },
    { id: 'c8', text: "To be completely honest with you, this is something I've been wrestling with for a while.", difficulty: 2 },
  ],
};

const professional: PhraseCategory = {
  id: 'professional',
  title: 'Professional Presence',
  subtitle: 'Own any room you walk into',
  emoji: '💼',
  color: 'from-slate-800 to-gray-950',
  description: 'Business and presentation phrases for meetings, pitches, and talks.',
  phrases: [
    { id: 'pr1', text: "What I'd like to walk you through today is a simple but genuinely powerful framework.", difficulty: 1 },
    { id: 'pr2', text: "The data clearly shows us that we need to fundamentally rethink our current approach.", difficulty: 2 },
    { id: 'pr3', text: "Let me draw your attention to something that might initially seem counterintuitive.", difficulty: 2, tip: "Pause after 'attention' and after 'something'." },
    { id: 'pr4', text: "The key insight here is that small, consistent changes in behavior can lead to dramatic results.", difficulty: 2 },
    { id: 'pr5', text: "Before I get into the details, let me give you the big picture view first.", difficulty: 1 },
    { id: 'pr6', text: "What makes this approach different is that it addresses root causes rather than symptoms.", difficulty: 2 },
    { id: 'pr7', text: "The research consistently points to three factors that matter more than anything else.", difficulty: 1 },
    { id: 'pr8', text: "I want to leave you today with one question that I think is worth sitting with for a while.", difficulty: 2 },
  ],
};

const advanced: PhraseCategory = {
  id: 'advanced',
  title: 'Challenge Mode',
  subtitle: 'Long sentences — no pausing allowed',
  emoji: '🔥',
  color: 'from-red-900 to-rose-950',
  description: 'Extended sentences that build stamina, breath control, and fluency at speed.',
  phrases: [
    { id: 'a1', text: "The reason most people struggle to communicate clearly isn't a lack of knowledge, but rather an overwhelming focus on how they appear rather than what they're actually saying.", difficulty: 3, tip: "One breath per half-sentence. Split at 'but rather'." },
    { id: 'a2', text: "When you stop trying to impress and start genuinely trying to understand, your conversations naturally become more meaningful, more memorable, and far more effective.", difficulty: 3 },
    { id: 'a3', text: "The single most powerful thing you can do to improve your public speaking is to practice out loud, every single day, on real material that stretches and challenges you.", difficulty: 3, tip: "Slow down at 'every single day' — let it emphasize itself." },
    { id: 'a4', text: "What separates truly great communicators from everyone else isn't vocabulary or natural charisma — it's the ability to make complex ideas feel simple, personal, and immediate.", difficulty: 3 },
    { id: 'a5', text: "Research in cognitive science shows that people remember stories far better than abstract facts, which is exactly why the best communicators always lead with narrative and example.", difficulty: 3 },
    { id: 'a6', text: "The fear of pausing is one of the greatest obstacles to truly fluent speech — but a well-timed pause is actually one of the most powerful tools in any skilled speaker's toolkit.", difficulty: 3, tip: "Ironic as it is, pause deliberately before 'pause is actually'." },
    { id: 'a7', text: "If you can learn to get comfortable with silence, to breathe between your thoughts, and to trust that your audience will wait for you, you will become a fundamentally better communicator.", difficulty: 3 },
    { id: 'a8', text: "Every great speaker you have ever admired has spent thousands of hours practicing in private so that they could deliver with apparent ease and genuine confidence in public.", difficulty: 3 },
  ],
};

export const CATEGORIES: PhraseCategory[] = [
  storytelling, transitions, persuasion, casual, professional, advanced,
];

export function getCategory(id: string): PhraseCategory | undefined {
  return CATEGORIES.find(c => c.id === id);
}
