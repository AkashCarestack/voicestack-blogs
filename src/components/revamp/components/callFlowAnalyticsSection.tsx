"use client";
import React from 'react';
import Section from '~/components/structure/Section';
import Container from '~/components/structure/Container';
import SectionHeaderV2 from './common/sectionHeaderV2';
import Button from '~/components/common/Button';
import AutoExpandTabs from './common/autoExpandTabs';

interface CallFlowAnalyticsSectionProps {
  data?: any;
  className?: string;
}

const callFlowTabsData = [
  {
    key: 'log-identify',
    step: 'STEP 01',
    title: 'Log & Identify Calls',
    description:
      'Every incoming and outgoing call is logged. If the number matches an existing patient, the call is tagged with their details; new or unknown callers are flagged.',
    thumbnail: 'https://cdn.sanity.io/images/76tr0pyh/develop/982a5e476cebb1f8a1cb181c7dd0328eb7f29c45-2400x1260.png',
  },
  {
    key: 'transcribe-analyze',
    step: 'STEP 02',
    title: 'Transcribe & Analyze',
    description:
      'Every incoming and outgoing call is logged. If the number matches an existing patient, the call is tagged with their details; new or unknown callers are flagged.',
    video: {
      videoPlatform: 'mp4',
      videoUrl: 'https://cdn.sanity.io/files/76tr0pyh/develop/8dcf31a3d9628f6a8f3c53d581225cb11bfb2d91.mp4',
    },
  },
  {
    key: 'categorize-outcomes',
    step: 'STEP 03',
    title: 'Categorize Outcomes',
    description:
      'Calls are automatically tagged based on outcome — appointment booked, follow-up needed, voicemail left, missed opportunity, and more — so you know exactly what happened.',
    thumbnail: 'https://cdn.sanity.io/images/76tr0pyh/develop/8eb0a5de69571bcf9a341342cc4581d1351cd8a8-1600x952.png',
  },
  {
    key: 'visualize-insights',
    step: 'STEP 04',
    title: 'Visualize Insights',
    description:
      'View trends in real-time dashboards. Understand where patients drop off, which staff performs best, and where your phone system is losing revenue.',
      thumbnail: 'https://cdn.sanity.io/images/76tr0pyh/develop/982a5e476cebb1f8a1cb181c7dd0328eb7f29c45-2400x1260.png',
    },
  {
    key: 'follow-up-improve',
    step: 'STEP 05',
    title: 'Follow-Up & Improve',
    description:
      'Set automated reminders for missed calls. Trigger follow-up workflows for unbooked leads. Coach teams based on actual call data and continuously improve patient experience.',
    video: {
      videoPlatform: 'mp4',
      videoUrl: 'https://cdn.sanity.io/files/76tr0pyh/develop/8dcf31a3d9628f6a8f3c53d581225cb11bfb2d91.mp4',
    },
  },
];

export default function CallFlowAnalyticsSection({
  data,
  className,
}: CallFlowAnalyticsSectionProps) {
  return (
    <Section className="w-full flex flex-col !bg-white">
      <Container className="w-full pb-12" type="V2" border="t-0">
        {/* Header Section */}
        <div className="flex items-center justify-center md:py-32 py-16 md:px-12 px-4">
          <div className="flex flex-col md:gap-8 gap-6 items-start w-full lg:w-[712px]">
            <div className="flex flex-col md:gap-3 gap-2 items-start w-full text-center">
              <div className="flex flex-col font-manrope font-semibold justify-center w-full md:text-[48px] text-[32px] text-gray-950 md:tracking-[-0.8px] tracking-[-0.5px] md:leading-[56px] leading-[40px]">
                <p className="whitespace-pre-wrap">
                  {data?.sectionHeadingDynamic || 'How Call Flow Analytics Works'}
                </p>
              </div>
              <p className="font-geist font-normal md:leading-7 leading-6 w-full text-gray-700 md:text-lg text-base tracking-normal whitespace-pre-wrap">
                {data?.description ||
                  'Every call captured, analyzed, and turned into actionable insight'}
              </p>
            </div>
            <div className="flex items-start justify-center w-full">
              <Button type="primary" link="/demo">
                <span className="md:text-base text-sm font-medium">Book Free Demo</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Auto Expand Tabs */}
        <AutoExpandTabs tabs={callFlowTabsData} autoPlayDuration={5000} />
      </Container>
    </Section>
  );
}
