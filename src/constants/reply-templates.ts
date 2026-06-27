export interface ReplyTemplate {
  id: string;
  label: string;
  subject: string;
  body: string;
}

export const REPLY_TEMPLATES: ReplyTemplate[] = [
  {
    id: "general",
    label: "General Inquiry",
    subject: "Re: Your Inquiry",
    body: `<p>Thank you for reaching out through my portfolio website. I appreciate you taking the time to contact me.</p>
<p>I have reviewed your message and would be happy to assist you. Please let me know if you have any additional questions or would like to schedule a call to discuss further.</p>
<p>Looking forward to hearing from you.</p>`,
  },
  {
    id: "freelance",
    label: "Freelance",
    subject: "Re: Freelance Opportunity",
    body: `<p>Thank you for considering me for your freelance project. I'm excited to learn more about what you're building.</p>
<p>Could you please share more details about the project scope, timeline, and budget? This will help me provide an accurate proposal tailored to your needs.</p>
<p>I'm available for a discovery call at your convenience.</p>`,
  },
  {
    id: "hiring",
    label: "Hiring",
    subject: "Re: Hiring Opportunity",
    body: `<p>Thank you for reaching out regarding the hiring opportunity. I'm genuinely interested in learning more about the role and your team.</p>
<p>I'd appreciate it if you could share the job description, required skills, and next steps in the hiring process. I'm happy to share my resume and portfolio for your review.</p>
<p>Looking forward to connecting.</p>`,
  },
  {
    id: "internship",
    label: "Internship",
    subject: "Re: Internship Inquiry",
    body: `<p>Thank you for your interest in offering an internship opportunity. I'm always eager to learn and contribute to meaningful projects.</p>
<p>Could you please provide details about the internship duration, responsibilities, and whether it's remote or on-site? I'd love to discuss how my skills align with your team's needs.</p>`,
  },
  {
    id: "project",
    label: "Project Discussion",
    subject: "Re: Project Discussion",
    body: `<p>Thank you for reaching out about your project. It sounds like an exciting initiative, and I'd love to explore how I can contribute.</p>
<p>Please share more about the project goals, tech stack, and timeline so I can provide thoughtful feedback and next steps.</p>
<p>Happy to jump on a call whenever works best for you.</p>`,
  },
  {
    id: "collaboration",
    label: "Collaboration",
    subject: "Re: Collaboration Opportunity",
    body: `<p>Thank you for proposing a collaboration. I'm always open to working with talented people on interesting ideas.</p>
<p>I'd love to hear more about your vision, what role you envision for me, and how we might align our efforts. Let's schedule a time to brainstorm together.</p>`,
  },
  {
    id: "thank-you",
    label: "Thank You",
    subject: "Re: Thank You",
    body: `<p>Thank you so much for your kind message. It truly means a lot to me.</p>
<p>I'm grateful for your support and encouragement. Please don't hesitate to reach out if there's anything I can help you with in the future.</p>
<p>Wishing you all the best!</p>`,
  },
  {
    id: "accepted",
    label: "Accepted",
    subject: "Re: Accepted",
    body: `<p>Thank you for your offer — I'm delighted to accept!</p>
<p>I'm excited to move forward and contribute to this opportunity. Please let me know the next steps, any onboarding details, and a preferred start date.</p>
<p>Looking forward to working together.</p>`,
  },
  {
    id: "rejected",
    label: "Rejected",
    subject: "Re: Application Update",
    body: `<p>Thank you for considering me and for taking the time to review my application.</p>
<p>After careful consideration, I've decided to pursue other opportunities that align more closely with my current goals. I truly appreciate your interest and hope we can stay connected for future possibilities.</p>
<p>Wishing you and your team continued success.</p>`,
  },
];
