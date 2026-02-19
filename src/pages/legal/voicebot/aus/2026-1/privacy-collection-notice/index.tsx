import Section from "~/components/structure/Section";

function PrivacyCollectionNoticePage() {
    return (
        <div className="w-full flex justify-center border py-40 px-8">
            <Section className=" w-full md:max-w-5xl flex flex-col">
                <div className="flex flex-col text-center justify-center mb-10">
                    <h1 className="text-4xl font-semibold">
                        VoiceBot Privacy Collection Notice
                    </h1>
                </div>

                <div className="legal-content">
                    <p className="legal__text">
                        <strong>Effective Date : 1st January 2026</strong>
                    </p>
                    <p className="legal__text">
                        Your personal information is collected by Good Methods Pty Ltd (ACN 664 796 310) located at Level 6, 200 Adelaide Street, Brisbane City, Queensland 4000 (&quot;VoiceStack&quot;, &quot;us&quot;, &quot;we&quot;, &quot;our&quot;).
                    </p>

                    <h2 className="legal__section-title">What personal information do we collect?</h2>
                    <p className="legal__text">
                        We may collect personal information about you, including your name, date of birth, mobile number, and email address, as well as other information (such as billing information or aggregated data for analytics) in order to provide our products and services.
                    </p>
                    <p className="legal__text">
                        We will collect this information directly from you where you provide it to us in the course of using the VoiceStack Platform, our Website (located at <a href="https://voicestack.com/en-AU" className="text-blue-600 underline">https://voicestack.com/en-AU</a> ] or otherwise when using our products or services.
                    </p>
                    <p className="legal__text">
                        We will also receive information from a third party – such as, your dental practice, clinic, dentist or health practitioner or provider, who uses our products or services, including the VoiceStack Platform to manage your appointment bookings, to provide you with their services.
                    </p>
                    <p className="legal__text">
                        If you choose to disclose further information to us while using our products or services, either on the VoiceStack Platform, via our Website or otherwise (or you consent to a third party providing this information to us), we may also collect your health information, such as your health or dental records (in whole or part), health or dental conditions, medications, allergies, specialist referrals, and/or medical reports.
                    </p>

                    <h2 className="legal__section-title">Why do we collect your personal information?</h2>
                    <p className="legal__text">
                        VoiceStack is collecting your personal information to provide you with access to, and use of, our products and services, including the VoiceStack Platform and/or Website.
                    </p>
                    <p className="legal__text">
                        We use your personal information as reasonably necessary for our functions and activities, including to verify your identity and provide the functionality of the VoiceStack Platform and/or Website and our products and services, including enabling you to book and manage appointments with your healthcare/dental practitioners, receive real time updates about your appointments with healthcare/dental practitioners, store your health/dental information, and store and receive notifications about your specialist referrals, requests and/or medical reports.
                    </p>
                    <p className="legal__text">
                        If you are a dental or healthcare practice representative or provider, we may also use your personal information to respond to your queries, provide you with marketing or promotional information about our products or services (where you have not opted-out from this service), or otherwise interact with you.
                    </p>
                    <p className="legal__text">
                        We may also collect your personal information from specialists to allow us to improve the functionality of any of our products and services.
                    </p>

                    <h2 className="legal__section-title">To whom we may disclose your personal information</h2>
                    <p className="legal__text">
                        In the course of and to provide our products and services, we may disclose your personal information to healthcare/dental practitioners, dental practices and other healthcare providers and clinics. We may also disclose your personal information to our affiliates, partners and other members of VoiceStack, our service providers, and/or consultants but always and only for the sole purpose of providing our products and services to you. We may disclose your personal information to overseas recipients and will take reasonable steps to put in place appropriate agreements to safeguard the protection of your personal information when we do so. Otherwise, we will only disclose your personal information where you have consented to do so or as required by law.
                    </p>

                    <h2 className="legal__section-title">What happens if we can&apos;t collect your personal information?</h2>
                    <p className="legal__text">
                        If you do not provide us with all or some of the requested personal information, we may not be able to provide you with access to and/or use of the VoiceStack Platform and/or Website or you may not receive the full benefit, or the entire functionality, of our products and/or services.
                    </p>

                    <h2 className="legal__section-title">More information</h2>
                    <p className="legal__text">
                        Our Privacy Policy [available at [<a href="https://www.voicestack.com/legal/voicebot/aus/2026-1/privacy-policy" className="text-blue-600 underline">https://www.voicestack.com/legal/voicebot/aus/2026-1/privacy-policy</a>] sets out our approach to managing your personal information in more detail, including how to make a privacy complaint and how to seek access to or correct your personal information.
                    </p>
                    <p className="legal__text">
                        If you have any privacy queries, please feel free to contact us at <a href="mailto:privacyconcerns@carestack.com" className="text-blue-600 underline">privacyconcerns@carestack.com</a>.
                    </p>
                </div>
            </Section>
        </div>
    )
}

export default PrivacyCollectionNoticePage;
