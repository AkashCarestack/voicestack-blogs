"use client";
import ContentVideoTabs from './content-video-tabs';

export default function ContentVideoTabsDemo() {
  const tabsData = [
    {
      key: 'patient-call',
      title: 'Patient Call',
      category: 'VMIP Systems',
      heading: 'Never miss a Patient call',
      description:
        'Ensure every patient call is answered promptly with our intelligent call routing system that connects patients to the right person at the right time.',
      features: [
        'AI Receptionist',
        '24/7 Call Routing',
        'Call Flow Analytics',
        'Intake Voicemail',
      ],
      ctaText: 'Book Free Demo',
      ctaLink: '#',
      video: {
        videoPlatform: 'youtube',
        videoId: 'dQw4w9WgXcQ', // Replace with actual video ID
      },
    },
    {
      key: 'voicemail',
      title: 'Voicemail',
      category: 'AI Receptionist',
      heading: 'Never lose patient call to Voicemail',
      description:
        'Transform voicemails into actionable insights with AI-powered transcription and automated follow-up workflows.',
      features: [
        'AI Transcription',
        'Automated Follow-up',
        'Two-way texting & Graphics',
      ],
      ctaText: 'Book Free Demo',
      ctaLink: '#',
      video: {
        videoPlatform: 'youtube',
        videoId: 'dQw4w9WgXcQ', // Replace with actual video ID
      },
    },
    {
      key: 'satisfaction',
      title: 'Call Analysis',
      category: 'Call Analytics',
      heading: 'Know your patients satisfaction',
      description:
        'Gain deep insights into patient interactions with advanced call analytics and sentiment analysis.',
      features: [
        'Sentiment Analysis',
        'Call Quality Metrics',
        'Patient Feedback',
      ],
      ctaText: 'Book Free Demo',
      ctaLink: '#',
      video: {
        videoPlatform: 'youtube',
        videoId: 'dQw4w9WgXcQ', // Replace with actual video ID
      },
    },
    {
      key: 'coaching',
      title: 'Insights',
      category: 'Insights',
      heading: 'Coach your team',
      description:
        'Empower your team with actionable insights and performance metrics to improve patient communication.',
      features: [
        'Performance Metrics',
        'Team Coaching Tools',
        'Best Practices',
      ],
      ctaText: 'Book Free Demo',
      ctaLink: '#',
      video: {
        videoPlatform: 'youtube',
        videoId: 'dQw4w9WgXcQ', // Replace with actual video ID
      },
    },
    {
      key: 'tracking',
      title: 'Track',
      category: 'Track',
      heading: 'Track Marketing ROI',
      description:
        'Measure the effectiveness of your marketing campaigns with detailed call tracking and attribution.',
      features: [
        'Call Attribution',
        'Campaign Tracking',
        'ROI Analytics',
      ],
      ctaText: 'Book Free Demo',
      ctaLink: '#',
      video: {
        videoPlatform: 'youtube',
        videoId: 'dQw4w9WgXcQ', // Replace with actual video ID
      },
    },
    {
      key: 'patient-flow',
      title: 'Patient Flow',
      category: 'Dental CRM',
      heading: 'Never miss unbooked patient enquiries',
      description:
        'Streamline patient flow management with automated workflows and intelligent scheduling.',
      features: [
        'Automated Workflows',
        'Intelligent Scheduling',
        'Patient Journey Tracking',
      ],
      ctaText: 'Book Free Demo',
      ctaLink: '#',
      video: {
        videoPlatform: 'youtube',
        videoId: 'dQw4w9WgXcQ', // Replace with actual video ID
      },
    },
  ];

  return <ContentVideoTabs tabs={tabsData} />;
}
