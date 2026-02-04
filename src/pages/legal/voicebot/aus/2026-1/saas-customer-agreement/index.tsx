import Section from "~/components/structure/Section";

function SAASCustomerAgreementPage() {
    return (
        <div className="w-full flex justify-center border py-40 px-8">
            <Section className=" w-full md:max-w-5xl flex flex-col">
                <div className="flex flex-col text-center justify-center mb-10">
                    <h1 className="text-4xl font-semibold">
                        Terms and Conditions
                    </h1>
                    <h2 className="text-3xl font-semibold mt-4">
                        SAAS CUSTOMER AGREEMENT
                    </h2>
                </div>

                <div className="legal-content">
                    <p className="legal__text">
                        <strong>Effective Date: 1st January 2026</strong>
                    </p>
                    <p className="legal__text">
                        This SAAS Customer Agreement (the &quot;Agreement&quot;) contains the Terms and Conditions that apply to the use of VOICEBOT Services (&quot;as defined below&quot;) offered by Good Methods Pty Ltd (ACN 664 796 310\) (VoiceStack/ Service Provider&quot;) to the Customer identified in the applicable order form or subscription agreement (&quot;Customer&quot;). BY EXECUTING AN ORDER FORM, SUBSCRIPTION AGREEMENT, OR BY ACCESSING OR USING THE SERVICES, CUSTOMER AGREES TO BE BOUND BY THIS AGREEMENT. These Terms govern Customer&apos;s access to and use of Service Provider&apos;s AI-powered voice assistant services (&quot;VOICEBOT Services&quot;). These Terms are incorporated into and governed by the Order Form / SAAS Agreement, Subscription Agreement, or similar governing agreement between the parties (the &quot;Agreement&quot;). In the event of a conflict between these Terms and any Order Form, these Terms shall control with respect to the VOICEBOT Services unless expressly stated otherwise.
                    </p>

                    <h2 className="legal__section-title">1. Definitions</h2>
                    <p className="legal__section-sub-title">
                        <strong>1.1 &quot;VOICEBOT&quot;</strong> means Service Provider&apos;s artificial intelligence–powered automated voice agent that interacts with callers through voice over telephony, using natural language understanding and generation to receive inputs and produce Outputs. &quot;VOICEBOT&quot; includes the underlying models (including machine learning models), prompts, conversation logic, call flows, telephony and speech components (e.g., speech-to-text and text-to-speech), configurations, integrations, analytics, safety controls, and updates made available by Service Provider as part of the services.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>1.2 &quot;VOICEBOT Services&quot;</strong> means the provision, hosting, operation, support, and maintenance of the VOICEBOT(s)) solely for inbound and outbound telephone-based communications on behalf of the Customer, as configured, authorized, and controlled by the Customer.
                    </p>
                    <p className="legal__text">
                        VOICEBOT Services are intended to support administrative, operational, and limited clinical communications related to dental practice management, including but not limited to appointment scheduling, confirmations, reminders, rescheduling, cancellations, call routing, general inquiries, treatment plan follow-ups, case acceptance communications, and discussions regarding payment plans, tax plans, or financial options as recorded in and sourced from the Customer&apos;s practice management system (&quot;PMS&quot;).
                    </p>
                    <p className="legal__text">
                        For clarity, VOICEBOT Services may communicate information related to existing treatment plans, the importance of timely completion of prescribed treatments, and available financial or scheduling options, provided such information is pre-defined, documented, and made available by the Customer within the PMS.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>1.3 &quot;PMS&quot;</strong> means Customer&apos;s practice management system or any other third-party system authorized by Customer for integration.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>1.4 &quot;PHI&quot;</strong> means health information and sensitive information as defined under the Privacy Act 1988 (Cth), including information relating to an individual&apos;s physical or mental health, dental records, or healthcare services.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>1.5 &quot;Applicable Law&quot;</strong>
                    </p>
                    <p className="legal__text">
                        &quot;Applicable Law&quot; means all applicable Commonwealth, State, and Territory laws, regulations, rules, codes, and standards in Australia applicable to Customer&apos;s use of the VOICEBOT Services, including without limitation the Privacy Act 1988 (Cth) and Australian Privacy Principles, the Notifiable Data Breaches Scheme, Telecommunications Act 1997 (Cth), Spam Act 2003 (Cth), Do Not Call Register Act 2006 (Cth), Australian Consumer Law (Schedule 2 of the Competition and Consumer Act 2010 (Cth)), State and Territory surveillance and listening devices legislation, health records legislation, and professional standards issued by AHPRA and the Dental Board of Australia.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>1.6 &quot;Outputs&quot;</strong> refers to any content, actions, responses, communications, call outcomes, recordings, transcriptions, or other materials produced, generated, or initiated by the VOICEBOT Services through automated, artificial intelligence driven, or machine learning based processes.
                    </p>

                    <h2 className="legal__section-title">2. Scope of VOICEBOT Services</h2>
                    <p className="legal__section-sub-title">
                        <strong>2.1 Provision and Availability.</strong> Service Provider shall make the VOICEBOT Services available for inbound and outbound telephone interactions, as configured and authorized by Customer. Customer may deploy one or more VOICEBOTs, , each with Customer-configured Call Flows, destinations, business rules, and Escalation conditions.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>2.2</strong> No Medical Advice or Clinical Decision Making.
                    </p>
                    <p className="legal__text">
                        VOICEBOT Services do not provide medical or dental advice, diagnoses, prognoses, or treatment recommendations, and do not engage in clinical decision making of any kind.
                    </p>
                    <p className="legal__text">
                        VOICEBOT:
                    </p>
                    <ul className="legal__list">
                        <li className="legal__list-item">
                            Do not independently determine, suggest, modify, or recommend treatment plans
                        </li>
                        <li className="legal__list-item">
                            Do not assess patient symptoms, conditions, or outcomes
                        </li>
                        <li className="legal__list-item">
                            Do not replace licensed dental professionals or clinical staff
                        </li>
                    </ul>
                    <p className="legal__text">
                        Any treatment-related information communicated by the VOICEBOT(s) is strictly limited to repeating, clarifying, or reinforcing information already entered, approved, and maintained by the Customer or its licensed providers in the PMS.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>2.3 Administrative Use Only.</strong> The VOICEBOT Services are intended solely for administrative, operational, and informational purposes. The VOICEBOT Services are not designed to (and shall not) replace human personnel, professional judgment, or clinical decision-making, and shall not be used to provide medical advice, diagnosis, triage, or treatment recommendations.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>2.4 Customer Configuration and Control.</strong> Customer retains full responsibility and control over the configuration and operation of the VOICEBOT Services, including without limitation:
                    </p>
                    <ul className="legal__list">
                        <li className="legal__list-item">
                            <strong>Enabled use cases and features:</strong> deciding which VOICEBOTs, features, and workflows are enabled or disabled;
                        </li>
                        <li className="legal__list-item">
                            <strong>Call Flows and routing logic:</strong> scripts, prompts, intent categories, destinations, call routing behavior, and hours of operation;
                        </li>
                        <li className="legal__list-item">
                            <strong>Escalation rules:</strong> when and how calls are transferred to human staff or other destinations (including after-hours handling);
                        </li>
                        <li className="legal__list-item">
                            <strong>Integration permissions:</strong> which systems are connected (including PMS), what data fields are accessible, and what actions are permitted; and
                        </li>
                        <li className="legal__list-item">
                            <strong>Content and disclosures:</strong> any customer-provided messaging, policies, and required notices (including call recording and consent language, where applicable).
                        </li>
                    </ul>
                    <p className="legal__section-sub-title">
                        <strong>2.5</strong> Customer shall not rely on, apply, or permit the use of Outputs in connection with any decision or activity that may produce legal, medical, financial, or similarly significant effects on an individual, including but not limited to decisions involving healthcare diagnosis or treatment, creditworthiness, insurance eligibility, employment, education, or any other decisions or actions subject to legal, regulatory, or significant risk considerations.
                    </p>

                    <h2 className="legal__section-title">3. Artificial Intelligence Disclosure and Transparency</h2>
                    <p className="legal__section-sub-title">
                        3.1 Use of Artificial Intelligence. Customer acknowledges that the VOICEBOT and VOICEBOT Services utilizes artificial intelligence, machine learning, and probabilistic models and does not produce deterministic or guaranteed outputs.
                    </p>
                    <p className="legal__section-sub-title">
                        3.2 AI Identification. VOICEBOT is designed to identify itself as an automated or AI-powered system as and when:
                    </p>
                    <ul className="legal__list">
                        <li className="legal__list-item">
                            Required by Applicable Law; or
                        </li>
                        <li className="legal__list-item">
                            Asked directly by a caller.
                        </li>
                    </ul>
                    <p className="legal__text">
                        Such identification shall be provided in a manner consistent with guidance issued by the Office of the Australian Information Commissioner (OAIC) regarding transparency and automated decision-making.
                    </p>
                    <p className="legal__section-sub-title">
                        3.3 Caller Awareness. Customer acknowledges that interactions may reasonably indicate to callers that they are communicating with an automated system.
                    </p>
                    <p className="legal__section-sub-title">
                        3.4 Any Outputs generated by VOICEBOT or VOICEBOT Services are produced through automated processes and do not reflect the opinions, positions, or endorsements of the Service Provider.
                    </p>

                    <h2 className="legal__section-title">4. AI Limitations and Disclaimers</h2>
                    <p className="legal__section-sub-title">
                        <strong>4.1</strong> No Guarantee of Accuracy. Customer acknowledges that:
                    </p>
                    <ul className="legal__list">
                        <li className="legal__list-item">
                            VOICEBOT may generate inaccurate, incomplete, or unexpected responses
                        </li>
                        <li className="legal__list-item">
                            VOICEBOT may misunderstand speech, intent, accents, context, or caller inputs
                        </li>
                        <li className="legal__list-item">
                            Performance may vary based on call conditions and scenarios
                        </li>
                    </ul>
                    <p className="legal__section-sub-title">
                        <strong>4.2</strong> Customer acknowledges that, due to the nature of artificial intelligence systems, the VOICEBOT Services may generate responses or actions that are similar or identical to those produced for other customers, users, or scenarios.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>4.3</strong> Guardrails and Scripts. While Service Provider implements configurable prompts, logic, and guardrails, Service Provider does not guarantee that the VOICEBOT will always adhere to scripts or constraints.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>4.4 Disclaimer of Warranties.</strong>
                    </p>
                    <p className="legal__text">
                        THE VOICEBOT AND VOICEBOT SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;, EXCEPT AS EXPRESSLY SET FORTH IN THESE TERMS, AND WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING, WITHOUT LIMITATION, ANY IMPLIED WARRANTIES OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, RELIABILITY, COMPLETENESS, OR ANY WARRANTIES IMPLIED BY ANY COURSE OF PERFORMANCE, COURSE OF DEALING, OR USAGE OF TRADE, ALL OF WHICH ARE EXPRESSLY DISCLAIMED.
                    </p>
                    <p className="legal__text">
                        WITHOUT LIMITING THE FOREGOING, SERVICE PROVIDER DOES NOT WARRANT THAT THE VOICEBOT SERVICES OR ANY VOICEBOT OUTPUTS WILL BE ERROR-FREE, UNINTERRUPTED, TIMELY, SECURE, COMPLETE, OR HUMAN-EQUIVALENT, OR THAT THE VOICEBOT WILL ACCURATELY UNDERSTAND, INTERPRET, OR CORRECTLY PROCESS ALL CALLER INPUTS, SPEECH, ACCENTS, CONTEXT, OR REQUESTS. Nothing in this Agreement excludes, restricts, or modifies any consumer guarantees, rights, or remedies that cannot be excluded under the Australian Consumer Law.
                    </p>

                    <h2 className="legal__section-title">5. PMS and Third Party System Access</h2>
                    <p className="legal__section-sub-title">
                        <strong>5.1</strong> Authorization at Customer&apos;s Risk. Any authorization to integrate the VOICEBOT with a PMS or third-party system is granted at Customer&apos;s sole discretion and risk.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>5.2</strong> No Responsibility for PMS Actions. Service Provider shall not be responsible or liable for:
                    </p>
                    <ul className="legal__list">
                        <li className="legal__list-item">
                            Appointments created, modified, rescheduled, or cancelled by VOICEBOT
                        </li>
                        <li className="legal__list-item">
                            Data written to or retrieved from the PMS
                        </li>
                        <li className="legal__list-item">
                            Any operational, financial, clinical, or reputational consequences of such actions
                        </li>
                    </ul>
                    <p className="legal__section-sub-title">
                        <strong>5.3</strong> Customer Responsibilities. Customer remains solely responsible for:
                    </p>
                    <ul className="legal__list">
                        <li className="legal__list-item">
                            Reviewing and auditing PMS data
                        </li>
                        <li className="legal__list-item">
                            Verifying appointment accuracy
                        </li>
                        <li className="legal__list-item">
                            Implementing corrective actions and controls
                        </li>
                    </ul>

                    <h2 className="legal__section-title">6. Human Oversight and Operational Responsibility</h2>
                    <p className="legal__section-sub-title">
                        <strong>6.1</strong> Human Oversight Required. Customer acknowledges that appropriate human oversight is required when deploying the VOICEBOT.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>6.2</strong> Customer Obligations. Customer shall:
                    </p>
                    <ul className="legal__list">
                        <li className="legal__list-item">
                            Monitor VOICEBOT activity
                        </li>
                        <li className="legal__list-item">
                            Manually review call recordings, logs, transcripts, and reports
                        </li>
                        <li className="legal__list-item">
                            Maintain escalation paths to trained human staff
                        </li>
                        <li className="legal__list-item">
                            Restrict VOICEBOT usage solely to appropriate non-clinical use cases
                        </li>
                    </ul>
                    <p className="legal__section-sub-title">
                        <strong>6.3</strong> Customer bears sole responsibility for independently reviewing, validating, and confirming the accuracy and appropriateness of any Outputs prior to acting upon, relying on, distributing, or incorporating such Outputs into business operations or communications.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>6.4</strong> No Service Provider Liability. Service Provider shall not be liable for issues arising from Customer&apos;s failure to provide adequate oversight or supervision.
                    </p>

                    <h2 className="legal__section-title">7. Privacy and Healthcare Data Compliance</h2>
                    <p className="legal__section-sub-title">
                        <strong>7.1</strong> Compliance.
                    </p>
                    <p className="legal__text">
                        To the extent the VOICEBOT Services involve health information or sensitive information, the parties shall comply with the Privacy Act 1988 (Cth), Australian Privacy Principles, applicable State and Territory health records legislation, and the Notifiable Data Breaches Scheme.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>7.2</strong> Safeguards. Service Provider shall:
                    </p>
                    <ul className="legal__list">
                        <li className="legal__list-item">
                            Implement reasonable administrative, technical, and physical safeguards
                        </li>
                        <li className="legal__list-item">
                            Limit PHI access to the minimum necessary
                        </li>
                        <li className="legal__list-item">
                            Enter into required data processing, privacy, or health information handling agreement as required under Australian Law.
                        </li>
                    </ul>
                    <p className="legal__section-sub-title">
                        <strong>7.3</strong> Caller-Provided Information. Customer acknowledges that:
                    </p>
                    <ul className="legal__list">
                        <li className="legal__list-item">
                            PHI may be verbally disclosed by callers
                        </li>
                        <li className="legal__list-item">
                            Data accuracy depends on caller input
                        </li>
                        <li className="legal__list-item">
                            Service Provider is not responsible for inaccuracies introduced by callers
                        </li>
                    </ul>
                    <p className="legal__section-sub-title">
                        <strong>7.4</strong> Customer Responsibility
                    </p>
                    <p className="legal__text">
                        Customer remains exclusively responsible for ensuring the lawful collection, security, confidentiality, integrity, and permitted use of all data.
                    </p>
                    <p className="legal__text">
                        Customer acknowledges that Service Provider may store or process data outside Australian and that Customer is responsible for ensuring compliance with cross border disclosure requirements under APP 8\.
                    </p>

                    <h2 className="legal__section-title">8. No Medical, Dental, or Professional Advice</h2>
                    <p className="legal__section-sub-title">
                        <strong>8.1</strong> No Clinical Advice. VOICEBOT does not provide medical, dental, legal, or professional advice, diagnoses, or treatment recommendations.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>8.2</strong> Informational Use Only. Any information provided is administrative or general in nature.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>8.3</strong> Clinical Routing. Customer is solely responsible for ensuring that clinical or professional inquiries are routed to qualified personnel.
                    </p>

                    <h2 className="legal__section-title">9. Regulatory, Telecommunications, and Consent Compliance</h2>
                    <p className="legal__section-sub-title">
                        <strong>9.1</strong> Customer Compliance Responsibility.
                    </p>
                    <p className="legal__text">
                        Customer is solely responsible for ensuring compliance with:
                    </p>
                    <ul className="legal__list">
                        <li className="legal__list-item">
                            Telecommunications Act 1997 (Cth)
                        </li>
                        <li className="legal__list-item">
                            Spam Act 2003
                        </li>
                        <li className="legal__list-item">
                            Do Not Call Register Act 2006 (Cth)
                        </li>
                        <li className="legal__list-item">
                            State and Territory surveillance and listing devices legislation
                        </li>
                        <li className="legal__list-item">
                            Privacy Act 1988 (Cth) and Australian Privacy Principles
                        </li>
                        <li className="legal__list-item">
                            Australian Consumer Law
                        </li>
                        <li className="legal__list-item">
                            Applicable State privacy and consumer protection laws
                        </li>
                        <li className="legal__list-item">
                            Applicable Professional licensing and board regulations
                        </li>
                    </ul>
                    <p className="legal__section-sub-title">
                        <strong>9.2</strong> Consent Management. Customer represents and warrants that it has obtained or will obtain all lawfully required:
                    </p>
                    <ul className="legal__list">
                        <li className="legal__list-item">
                            Call, text, and voicemail consents
                        </li>
                        <li className="legal__list-item">
                            Recording and monitoring disclosures
                        </li>
                        <li className="legal__list-item">
                            AI interaction disclosures
                        </li>
                    </ul>
                    <p className="legal__section-sub-title">
                        <strong>9.3</strong> No Legal Advice. Service Provider does not provide legal or regulatory compliance advice.
                    </p>

                    <h2 className="legal__section-title">10. Data Use, Recording, and Model Improvement</h2>
                    <p className="legal__section-sub-title">
                        <strong>10.1</strong> Customer understands and agrees that calls and interactions involving the VOICEBOT Services may be recorded, monitored, and stored for purposes including service delivery, quality assurance, system optimization, troubleshooting, and training, subject to Applicable Law and required consents.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>10.2</strong> Service Operation. Service Provider may process call metadata, transcripts, and interaction data as necessary to provide and support the VOICEBOT Services.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>10.3</strong> Customer grants Service Provider a non exclusive right to utilize interaction data, call content, transcripts, and related materials in anonymized and aggregated form, in compliance with Applicable Law and de-identification standards, for purposes including enhancing system performance, improving AI models, developing new features, conducting analytics, and refining speech recognition and language processing capabilities.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>10.4</strong> De-Identification. Service Provider may use de-identified and aggregated data to improve system performance, analytics, and reliability.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>10.5</strong> No Sale of PHI. Service Provider does not sell PHI or use PHI for advertising purposes.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>10.6</strong> Customer is solely responsible for determining and fulfilling any legal, regulatory, or operational requirements related to the retention, archiving, or production of call recordings, transcripts, or interaction records. Service Provider has no duty to preserve, store, or make such records available unless expressly agreed in writing.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>10.7</strong> <strong>Call Recording; Legal Compliance</strong>
                    </p>
                    <p className="legal__text">
                        Customer acknowledges and agrees that all inbound and outbound calls made through or in connection with the VOICEBOT Services may be automatically recorded by VOICESTACK as part of the VOICEBOT Services. Customer shall be solely responsible for obtaining all legally required consents, authorizations, and permissions from all applicable parties to permit the recording, storage, processing, use, and analysis of such calls in connection with the provision, maintenance, and improvement of the VOICEBOT Services. Customer represents and warrants that it is familiar with, and shall comply with, all applicable international, federal, state, and local laws, regulations, and rules relating to calling, recording, monitoring, storage, processing, and receipt of communications, including without limitation notice and consent requirements. Customer shall not use the VOICEBOT Services or any recordings for any unlawful, illegal, or fraudulent purpose. Customer acknowledges that the VOICESTACK does not provide legal advice and has no obligation to monitor or ensure Customer&apos;s compliance with applicable laws. Customer assumes sole and exclusive responsibility for any confidential, private, or privileged communications, recordings, data, or information created, transmitted, stored, or accessed through the VOICEBOT Services. Any liability arising out of or relating to this Section shall be subject to <strong>Section 11 (Limitation of Liability)</strong>. Customer&apos;s indemnification obligations arising out of or relating to this Section are governed by <strong>Section 12 (Indemnification by Customer)</strong>.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>10.8</strong> <strong>Notifiable Data Breaches</strong>
                    </p>
                    <p className="legal__text">
                        Service Provider will comply with the Notifiable Data Breaches Scheme under Part IIC of the Privacy Act 1988 (Cth) where applicable.
                    </p>

                    <h2 className="legal__section-title">11. Service Updates</h2>
                    <p className="legal__section-sub-title">
                        <strong>11.1</strong> Subject to all of the terms and conditions of this Agreement (including any limitations and restrictions set forth on the applicable Order Form), VoiceStack grants Customer the right to access and use the services specified in each Order Form (collectively, the &quot;Service,&quot; or &quot;Services&quot;) during the applicable Order Form Term (as defined below) for the internal business purposes of such Customer, only as provided herein and only pursuant to VoiceStack&apos;s applicable user documentation.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>11.2</strong> From time to time, VoiceStack may provide upgrades, patches, enhancements, or fixes for the Services to its customers generally without additional charge (&quot;Updates&quot;), and such Updates will become part of the Services and subject to this Agreement; provided that VoiceStack shall have no obligation under this Agreement or otherwise to provide any such Updates. Customer understands that VoiceStack may cease supporting old versions or releases of the Services at any time in its sole discretion; provided that VoiceStack shall use commercially reasonable efforts to give Customer sixty (60) days prior notice of any major changes. VoiceStack may in its sole discretion modify, enhance or otherwise change the Services, provided that such changes do not materially limit or adversely affect the Services provided to Customer hereunder.
                    </p>

                    <h2 className="legal__section-title">12. Professional Services</h2>
                    <p className="legal__text">
                        Upon payment of any applicable fees set forth in each Order Form, VoiceStack agrees to use reasonable commercial efforts to provide professional services for the Service only if and to the extent such professional services is set forth on such Order Form (&quot;Professional Services&quot;). The parties may enter into by mutual execution separate statements of work (the &quot;SOW&quot;), for the provision by VoiceStack of Professional Services to Customer, which may include customization, configuration, implementation, deployment, guided services, consultation, or training services. The fees and terms for such Professional Services will be as provided in the applicable SOW. If VoiceStack provides Professional Services in excess of any agreed-upon hours estimate, or if VoiceStack otherwise provides additional services beyond those agreed in an Order Form, Customer will pay VoiceStack at its then-current hourly rates for such services.
                    </p>

                    <h2 className="legal__section-title">13. Support; Service Levels</h2>
                    <p className="legal__text">
                        Subject to the terms and conditions of this Agreement, VoiceStack will provide its standard support and maintenance services for the Service that it generally provides to other customers without additional charges. VoiceStack will undertake commercially reasonable efforts to make the Services available.
                    </p>

                    <h2 className="legal__section-title">14. Ownership; Third Party; Feedback</h2>
                    <p className="legal__section-sub-title">
                        <strong>14.1</strong> As between the parties, VoiceStack retains all right, title, and interest in and to the Services, and all software, products, works, and other intellectual property and moral rights related thereto or created, used, or provided by VoiceStack for the purposes of this Agreement, including any copies and derivative works of the foregoing. Any software which is distributed or otherwise provided to Customer hereunder (including without limitation any software identified on an Order Form) shall be deemed a part of the &quot;Services&quot; and subject to all of the terms and conditions of this Agreement. No rights or licenses are granted except as expressly and unambiguously set forth in this Agreement.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>14.2</strong> Third-Party Services. Customer acknowledges and agrees that: (a) the Services may incorporate or contain, or operate in or with, certain software, services, information, data and materials operated or provided by third parties (&quot;Third-Party Services&quot;); (b) VoiceStack may provide certain Third-Party Services together with the Services as set forth in the applicable Order Form (&quot;VoiceStack Provided TPS&quot;), and such VoiceStack Provided TPS may only be used in conjunction with the Services; (c) Customer is solely responsible for procuring any and all rights necessary for it to access Third-Party Services (other than VoiceStack Provided TPS); and (d) Customer&apos;s use of the Third-Party Services shall be subject to (and Customer agrees it is bound by) any additional third-party terms and conditions (collectively, the &quot;Third-Party Terms&quot;), which are hereby incorporated into this Agreement by this reference. Customer is responsible for checking the Third-Party Terms for updates, and any use by Customer of the Services following a change to the Third-Party Terms shall constitute acceptance of such change. VoiceStack cannot and does not guarantee that the Services shall incorporate (or continue to incorporate) any particular Third-Party Services. Notwithstanding anything else, VoiceStack does not make any representations or warranties or provide any indemnification with respect to Third-Party Services or any third-party providers. Customer will rely on and seek remedies solely from the original licensors or vendors of such Third-Party Services. Unless otherwise specified in the applicable Order Form, VoiceStack is not responsible for fulfillment of any third-party warranty or for problems attributable to the use or operations of Third-Party Services (including, but not limited to, the availability or operation of the Services to the extent such availability and operation is dependent upon Third-Party Services).
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>14.3</strong> Customer may from time to time provide suggestions, comments or other feedback to VoiceStack with respect to the Service (&quot;Feedback&quot;). Feedback, even if designated as confidential by Customer, shall not create any confidentiality obligation for VoiceStack notwithstanding anything else. Customer shall, and hereby does, grant to VoiceStack a nonexclusive, worldwide, perpetual, irrevocable, transferable, sublicensable, royalty-free, fully paid up license to use and exploit the Feedback for any purpose. Nothing in this Agreement will impair VoiceStack&apos;s right to develop, acquire, license, market, promote or distribute products, software or technologies that perform the same or similar functions as, or otherwise compete with any products, software or technologies that Customer may develop, produce, market, or distribute.
                    </p>

                    <h2 className="legal__section-title">15. Restrictions</h2>
                    <p className="legal__text">
                        Except as expressly set forth in this Agreement, Customer shall not (and shall not permit any third party to), directly or indirectly:
                    </p>
                    <ul className="legal__list">
                        <li className="legal__list-item">
                            (i) reverse engineer, decompile, disassemble, or otherwise attempt to discover the source code, object code, or underlying structure, ideas, or algorithms of the Service (except to the extent applicable laws specifically prohibit such restriction);
                        </li>
                        <li className="legal__list-item">
                            (ii) modify, translate, or create derivative works based on the Service;
                        </li>
                        <li className="legal__list-item">
                            (iii) copy, rent, lease, distribute, pledge, assign, or otherwise transfer or encumber rights to the Service;
                        </li>
                        <li className="legal__list-item">
                            (iv) use the Service for the benefit of a third party;
                        </li>
                        <li className="legal__list-item">
                            (v) remove or otherwise alter any proprietary notices or labels from the Service or any portion thereof;
                        </li>
                        <li className="legal__list-item">
                            (vi) use the Service to build an application or product that is competitive with any VoiceStack product or service;
                        </li>
                        <li className="legal__list-item">
                            (vii) interfere or attempt to interfere with the proper working of the Service or any activities conducted on the Service; or
                        </li>
                        <li className="legal__list-item">
                            (viii) bypass any measures VoiceStack may use to prevent or restrict access to the Service (or other accounts, computer systems or networks connected to the Service).
                        </li>
                    </ul>
                    <p className="legal__text">
                        Customer is responsible for all of its activity in connection with the Service, including but not limited to uploading Customer Data (as defined below) onto the Service. Customer shall use the Service in compliance with all applicable local, state, national and foreign laws, treaties and regulations in connection with Customer&apos;s use of the Service (including those related to data privacy, international communications, export laws and the transmission of technical or personal data laws), and shall not use the Service in a manner that violates any third party intellectual property, contractual or other proprietary rights.
                    </p>

                    <h2 className="legal__section-title">16. Limitation of Liability</h2>
                    <p className="legal__section-sub-title">
                        <strong>16.1 Exclusion of Damages</strong>
                    </p>
                    <p className="legal__text">
                        To the maximum extent permitted by law and subject to non excludable rights under the Australian Consumer Law, in no event shall the Service Provider, nor its directors, officers, employees, agents, partners, suppliers, or content providers, be liable under any theory of law (including contract, tort, negligence, strict liability, or otherwise) for any indirect, incidental, special, consequential, exemplary, or punitive damages, or for any loss of profits, loss of revenue, loss of data, loss of goodwill, or cost of procurement of substitute goods or services, arising out of or relating to the VOICEBOT Services.
                    </p>
                    <p className="legal__text">
                        Without limiting the foregoing, the Service Provider shall have no liability arising from or relating to:
                    </p>
                    <ul className="legal__list">
                        <li className="legal__list-item">
                            automated or outbound calls;
                        </li>
                        <li className="legal__list-item">
                            call recording or monitoring;
                        </li>
                        <li className="legal__list-item">
                            VOICEBOT AI Outputs;
                        </li>
                        <li className="legal__list-item">
                            misinterpretations of caller intent;
                        </li>
                        <li className="legal__list-item">
                            transcription errors, scheduling errors, or reminder errors;
                        </li>
                        <li className="legal__list-item">
                            system downtime, integration failures, model errors, or model hallucinations; or
                        </li>
                        <li className="legal__list-item">
                            bugs, defects, viruses, harmful code, corrupted data, or other harmful components, regardless of source.
                        </li>
                    </ul>
                    <p className="legal__section-sub-title">
                        <strong>16.2</strong> Liability Cap
                    </p>
                    <p className="legal__text">
                        To the maximum extent permitted by law and subject to non excludable rights under the Australian Consumer Law, Service Provider&apos;s total cumulative liability for any and all claims arising out of or relating to the VOICEBOT Services or these Terms, whether in contract, tort, strict liability, negligence, or otherwise, shall not exceed, in the aggregate, the fees paid or payable by Customer for the VOICEBOT Services during the twelve (12) months immediately preceding the event giving rise to the claim.
                    </p>

                    <h2 className="legal__section-title">17. Indemnification by Customer</h2>
                    <p className="legal__text">
                        Customer agrees to indemnify, defend, and hold harmless the Service Provider and its affiliates, directors, officers, employees, agents, and representatives from and against any and all claims, demands, damages, losses, liabilities, fines, penalties, costs, and expenses (including reasonable attorneys&apos; fees) arising out of or relating to:
                    </p>
                    <ul className="legal__list">
                        <li className="legal__list-item">
                            Customer&apos;s or its end users&apos; use or misuse of the VOICEBOT Services, including reliance on the VOICEBOT Services for purposes beyond their intended scope, including but not limited to seeking clinical or medical advice.
                        </li>
                        <li className="legal__list-item">
                            Any reliance by Customer or its end users on outputs, responses, recordings, transcriptions, or information generated by VOICEBOT, including errors or inaccuracies in appointment scheduling, reminders, or other non-clinical information.
                        </li>
                        <li className="legal__list-item">
                            Any failure by Customer or its end users to obtain all required consents, authorizations, or permissions for call recording, monitoring, data collection, processing, or use, including under applicable wiretapping, privacy, or data protection laws.
                        </li>
                        <li className="legal__list-item">
                            Any violation of applicable international, federal, state, or local laws, regulations, or professional standards by Customer or its end users, including data protection, privacy, telecommunications, or healthcare-related laws.
                        </li>
                        <li className="legal__list-item">
                            Errors, failures, or malfunctions in Customer&apos;s practice management system, third-party systems, or integrations that impact the functioning of VOICEBOT or result in scheduling conflicts, missed appointments, or data discrepancies.
                        </li>
                        <li className="legal__list-item">
                            Customer&apos;s failure to implement appropriate human oversight, review, or validation of outputs generated by VOICEBOT, particularly where such oversight is necessary to prevent errors, compliance breaches, or patient impact.
                        </li>
                        <li className="legal__list-item">
                            Any inaccurate, incomplete, misleading, or unlawful information provided by Customer or its end users to the VOICEBOT Services.
                        </li>
                    </ul>

                    <h2 className="legal__section-title">18. Service Evolution and Changes</h2>
                    <p className="legal__section-sub-title">
                        <strong>18.1</strong> Evolving Technology. Customer acknowledges that AI technologies evolve rapidly.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>18.2</strong> Updates. Service Provider may modify, update, or enhance the VOICEBOT Services.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>18.3</strong> No Guarantee of Consistency. Behaviour, responses, and performance may change over time.
                    </p>

                    <h2 className="legal__section-title">19. Acceptance of AI Risk</h2>
                    <p className="legal__text">
                        By enabling or using the VOICEBOT Services, Customer expressly acknowledges, understands  and agrees that:
                    </p>
                    <ul className="legal__list">
                        <li className="legal__list-item">
                            <strong>The probabilistic nature of AI:</strong>
                            <br />
                            VOICEBOT services utilizes artificial intelligence and machine learning technologies that operate on probabilistic models. As such, outputs are generated based on patterns and predictions, not certainties. The service may not always produce accurate, complete or contextually appropriate responses.
                        </li>
                        <li className="legal__list-item">
                            <strong>The possibility of errors or unintended outcomes:</strong>
                            <br />
                            Due to inherent limitations of AI systems, the Services may occasionally provide incorrect, incomplete or unintended outputs, including but not limited to scheduling errors, misinterpretation of users input, or failure to process certain requests. Customer assumes full responsibility for reviewing and validating all outputs before acting upon them.
                        </li>
                        <li className="legal__list-item">
                            <strong>That Outputs do not equal human judgment:</strong>
                            <br />
                            The service provided does not replace professional judgment, human decision making, or clinical expertise. Customer must ensure that human oversight is applied where necessary and that no reliance is placed on the Service for medical, diagnostic, or treatment advice.
                        </li>
                    </ul>

                    <h2 className="legal__section-title">19. FEES &amp; PAYMENT TERMS</h2>
                    <p className="legal__section-sub-title">
                        19.1 Notwithstanding any other provision of this Agreement, Customer will pay VoiceStack the fees for the Services, as set out in an applicable Order Form (&quot;Fees&quot;). The Fees are inclusive of all charges for the Services provided under this Agreement.
                    </p>
                    <p className="legal__section-sub-title">
                        19.2 Unless otherwise specified in an Order Form, VoiceStack will invoice Customer for the Fees monthly in arrears. All invoices issued under this Agreement are payable (in the currency referenced in the Order Form) within no later than ten (10) days from date of issue of the invoice. You will make payment of the Fees in line with the payment method disclosed to and agreed by VoiceStack as the Payment Method for the purposes of this Agreement. It is your responsibility to ensure that:
                    </p>
                    <p className="legal__text">
                        (a) the Payment Method (including all details provided to VoiceStack) are and remain true, accurate, complete and up-to-date at all times;
                    </p>
                    <p className="legal__text">
                        (b) sufficient funds are available via the Payment Method to discharge all amounts due and payable under this Agreement, and
                    </p>
                    <p className="legal__text">
                        (c) any changes to the Payment Method are notified to VoiceStack in writing at least thirty (30) Business Days prior to the date of issue of any subsequent monthly invoice for Fees.
                    </p>
                    <p className="legal__section-sub-title">
                        19.3 Subject to the following Clause 19.4 (Disputed Amount(s)), we may elect that any outstanding invoices that are overdue by more than thirty (30) days are subject to interest on any outstanding balance of a rate of one per-cent (1%) per month (or the highest rate permitted by Applicable Law, if less).
                    </p>
                    <p className="legal__section-sub-title">
                        19.4 If the Customer, acting reasonably, raises a good faith dispute in respect of all or part of any invoice provided by VoiceStack, it must provide full details to VoiceStack of the disputed amount(s) to support its reasons for the dispute in good time prior to the due date for payment of the applicable invoice. The parties will seek to resolve the dispute in accordance with Clause 22 (Dispute Resolution). Any disputed invoice does not reduce the Customer&apos;s liability to pay any and all undisputed amounts in accordance with the terms and timelines of this Agreement (and any Order Form).
                    </p>
                    <p className="legal__section-sub-title">
                        19.5 Subject to the application of the Non-Excludable Rights, all Fees paid are non-refundable and Fees paid and payable are not subject to any set-off, counter-claim, withholding or deduction of any kind.
                    </p>
                    <p className="legal__section-sub-title">
                        19.6 VoiceStack and Customer agree that the Fees will increase each year, on reasonable notice to Customer, by the greater of: (i) the prevailing Consumer Price Index (CPI) rate; and (ii) such other reasonable percentage as specified and agreed between the parties under an Order Form. New fees and/or charges may also be added on reasonable prior written notice to Customer.
                    </p>
                    <p className="legal__section-sub-title">
                        19.7 All Fees are exclusive of GST. Where applicable, GST and other taxes, duties or levies will be added to the Fees payable at the then prevailing rate.
                    </p>

                    <h2 className="legal__section-title">20. PRIVACY</h2>
                    <p className="legal__section-sub-title">
                        20.1 If the performance of rights and obligations under this Agreement involves the handling of any Personal Information, then each Party must:
                    </p>
                    <p className="legal__text">
                        (a) comply with all Privacy Laws applicable to, and binding on, it in its handling of Personal information;
                    </p>
                    <p className="legal__text">
                        (b) in the case of Customer Data, VoiceStack will comply with all reasonable and documented directions of Customer under this Agreement (and any Order Form);
                    </p>
                    <p className="legal__text">
                        (c) use or handle Personal Information only for the purposes of performing its obligations under this Agreement;
                    </p>
                    <p className="legal__text">
                        (d) take all reasonable steps to protect Personal Information from misuse, loss and unauthorised access or disclosure; and
                    </p>
                    <p className="legal__text">
                        (e) without undue delay, notify the other Party if it becomes aware of a breach of any applicable Privacy Laws relating to the Services or Customer Data.
                    </p>
                    <p className="legal__section-sub-title">
                        20.2 Without undue delay after becoming aware of a Security Incident, VoiceStack will:
                    </p>
                    <p className="legal__text">
                        (a) notify Customer; and
                    </p>
                    <p className="legal__text">
                        (b) take appropriate measures to address the Security Incident, including reasonable measures to seek to mitigate the adverse effects resulting from the Security Incident.
                    </p>
                    <p className="legal__section-sub-title">
                        20.3 To enable Customer to notify a Security Incident to relevant regulators, authorities and/or individuals (as applicable), VoiceStack will cooperate with and assist Customer by including in the notification under Clause 11.2 such information about the Security Incident as VoiceStack is able to disclose to Customer, taking into account the nature of the handling and processing of Customer Data, the information on the Security Incident available to VoiceStack at the relevant time, and any restrictions on disclosing the information, such as confidentiality. Taking into account the nature of the handling and processing of Customer Data, Customer agrees that it is best able to determine the likely consequences of a Security Incident.
                    </p>
                    <p className="legal__section-sub-title">
                        20.4 In the event that VoiceStack notifies Customer of a Security Incident, under Clause 11.2 above, or Customer otherwise becomes aware of any accidental or unlawful loss of, unauthorised access to, or disclosure of, Customer Data, Customer will be responsible for:
                    </p>
                    <p className="legal__text">
                        (a) determining if there is any resulting notification or other obligations arising under Privacy Laws; and
                    </p>
                    <p className="legal__text">
                        (b) taking necessary action to comply with those obligations.
                    </p>
                    <p className="legal__text">
                        This does not limit VoiceStack&apos;s obligations under this Clause 11(Privacy) or under applicable Privacy Laws to notify any Eligible Data Breach affecting VoiceStack.
                    </p>
                    <p className="legal__section-sub-title">
                        20.5 To the extent that the Customer determines that an Eligible Data Breach affecting Customer Data has arisen, and notification of that Eligible Data Breach is required under the Privacy Act, or if VoiceStack notifies Customer that an Eligible Data Breach has occurred, Customer will:
                    </p>
                    <p className="legal__text">
                        (a) meet with VoiceStack and endeavour to agree who will issue the resulting notification to the regulator, government body and/or individuals;
                    </p>
                    <p className="legal__text">
                        (b) if Customer is to issue the notification(s), promptly provide VoiceStack with a draft of the notification(s) and allow VoiceStack an opportunity to make any changes reasonably required by VoiceStack prior to issue, and then issue the notification(s) in accordance with the requirements of Privacy Laws (including applicable time periods),
                    </p>
                    <p className="legal__text">
                        (c) otherwise, allow VoiceStack to issue the notification(s) in accordance with the requirements of Privacy Laws (including applicable time periods).
                    </p>
                    <p className="legal__text">
                        (d) in any case, ensure that (to the extent feasible) VoiceStack is notified of any investigation or other action taken by any regulator, government body or individual in connection with a suspected or actual Eligible Data Breach and is kept informed of the developments in relation to that investigation or other action.
                    </p>
                    <p className="legal__section-sub-title">
                        20.6 Unless otherwise specified in an Order Form, VoiceStack&apos;s only obligation in respect of any loss of Customer Data arising from a Security Incident is the restoration of Customer Data from the last available backup.
                    </p>

                    <h2 className="legal__section-title">21. CONFIDENTIALITY</h2>
                    <p className="legal__text">
                        As between the parties, each Party retains all ownership rights in and to its Confidential Information.
                    </p>
                    <p className="legal__section-sub-title">
                        21.1 Each Party acknowledges the importance of the Confidential Information to the other Party. Accordingly, each Party undertakes to keep the Confidential Information of the other Party secret and to protect and preserve the confidential nature and secrecy of the Confidential Information of the other Party.
                    </p>
                    <p className="legal__section-sub-title">
                        21.2 The Recipient may only use the Confidential Information of the Discloser for the purposes of performing its obligations or exercising its rights under this Agreement. The Recipient will use the same degree of care that it uses to protect the confidentiality of its own confidential information of like kind (but not less than reasonable care) and will not use any Confidential Information of the Discloser for any purpose outside the scope of this Agreement.
                    </p>
                    <p className="legal__section-sub-title">
                        21.3 Except as otherwise authorised by the Discloser in writing, the Recipient may not disclose Confidential Information of the Discloser to any person except:
                    </p>
                    <p className="legal__text">
                        (a) representatives, legal advisers, auditors and other consultants of the Recipient including subcontractors, in the case of VoiceStack) who require it for the purposes of performing obligations or exercising rights consistent with this Agreement or the Services, and then only on a need-to-know basis, and who are each subject to obligations of confidentiality which are, materially, no less protective of the Confidential Information than the provisions set out in this Agreement; or
                    </p>
                    <p className="legal__text">
                        (b) if required to do so by Applicable Laws (subject always to Clause 8.6(b) (Government Demand)) or any applicable stock exchange (as relevant).
                    </p>

                    <h2 className="legal__section-title">22. DISPUTE RESOLUTION</h2>
                    <p className="legal__section-sub-title">
                        22.1 If any dispute or difference arises between the Parties with respect to the construction, effect or operation of this Agreement, or with respect to any matter connected with this Agreement or arising out of it (a &quot;Dispute&quot;), the Parties must take the following steps to attempt to resolve the Dispute:
                    </p>
                    <p className="legal__text">
                        (a) either Party may serve a written notice on the other Party stating the nature of the Dispute and invoking the dispute resolution process set out in this; and
                    </p>
                    <p className="legal__text">
                        (b) the Parties must meet (including remotely) within ten (10) Business Days after the date of the receipt of the Dispute Notice, or such other period as the Parties agree in writing, and negotiate in good faith to resolve the Dispute.
                    </p>
                    <p className="legal__section-sub-title">
                        22.2 lf the Dispute is not resolved in accordance with this clause within twenty (20) Business Days of the date of the Dispute Notice, or such other period as the Parties agree in writing, the Dispute will be referred to mediation in the first instance.
                    </p>
                    <p className="legal__section-sub-title">
                        22.3 Disputes will be ultimately resolved by arbitration administered by the Australian Centre for International Commercial Arbitration (&quot;ACICA&quot;) in accordance with the then-applicable ACICA Arbitration Rules, and judgment on the arbitral award may be entered in any court having jurisdiction. The arbitration will take place in Sydney, Australia. There will be one arbitrator. The fees and expenses of the arbitrator and the administering authority, if any, will be paid in equal proportion by the parties. The parties agree that the existence of and information relating to any such arbitration proceedings will not be disclosed by either party and will constitute Confidential Information.
                    </p>
                    <p className="legal__section-sub-title">
                        22.4 Other than proceedings for urgent interlocutory relief, a Party may not commence or maintain any proceedings in any court with respect to a Dispute unless and until that Party has complied with the procedures in this clause.
                    </p>

                    <h2 className="legal__section-title">23. License Grant/ SAAS Access</h2>
                    <p className="legal__section-sub-title">
                        <strong>23.1</strong> License Grant. Subject to this Agreement and the applicable Order Form, Service Provider grants Customer a limited, non-exclusive, non-transferable, non-sublicensable right to access and use the VOICEBOT Services during the applicable subscription term solely for Customer&apos;s internal business purposes.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>23.2</strong> SaaS Model. VOICEBOT Services are provided on a hosted, subscription-based software-as-a-service basis. No software is sold or transferred.
                    </p>

                    <h2 className="legal__section-title">24. Term and Termination</h2>
                    <p className="legal__section-sub-title">
                        <strong>24.1</strong> This Agreement shall commence upon the effective date set forth in the first Order Form, and, unless earlier terminated in accordance herewith, shall last until the expiration of all Order Form Terms. For each Order Form, the &quot;Order Form Term&quot; shall begin as of the effective date set forth on such Order Form, and unless earlier terminated as set forth herein, shall continue for the initial term specified on the Order Form (the &quot;Initial Order Form Term&quot;), and following the Initial Order Form Term, shall automatically renew for additional successive periods of one year each (each, a &quot;Renewal Order Form Term&quot;) unless either party notifies the other party of such party&apos;s intention not to renew no later than thirty (30) days prior to the expiration of the Initial Order Form Term or then-current Renewal Order Form Term, as applicable.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>24.2</strong> In the event of a material breach of this Agreement by either party, the non-breaching party may terminate this Agreement by providing written notice to the breaching party, provided that the breaching party does not materially cure such breach within thirty (30) days of receipt of such notice.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>24.3</strong> VOICESTACK may suspend or limit Customer&apos;s access to or use of the Service if
                    </p>
                    <p className="legal__text">
                        (i) for scheduled or emergency maintenance,
                    </p>
                    <p className="legal__text">
                        (ii) in the event Customer&apos;s account is sixty (60) days or more delinquent, or
                    </p>
                    <p className="legal__text">
                        (iii) Customer&apos;s use of the Service results in (or is reasonably likely to result in) damage to or material degradation of the Service which interferes with VOICESTACK&apos;s ability to provide access to the VOICEBOT Service to other customers; provided that in the case of subsection
                    </p>
                    <ul className="legal__list">
                        <li className="legal__list-item">
                            (a) VOICESTACK shall use reasonable good faith efforts to work with Customer to resolve or mitigate the damage or degradation in order to resolve the issue without resorting to suspension or limitation;
                        </li>
                        <li className="legal__list-item">
                            (b) prior to any such suspension or limitation, VOICESTACK shall use commercially reasonable efforts to provide notice to Customer describing the nature of the damage or degradation; and
                        </li>
                        <li className="legal__list-item">
                            (c) VOICESTACK shall reinstate Customer&apos;s use of or access to the Service, as applicable, if Customer remediates the issue within thirty (30) days of receipt of such notice.
                        </li>
                    </ul>
                    <p className="legal__section-sub-title">
                        <strong>24.4</strong> Upon expiration or termination of this Agreement, all provisions of this Agreement which by their nature should survive termination shall survive termination, including, without limitation, accrued payment obligations, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>24.5</strong> In the event the Customer terminates this Order form for any reason whatsoever, before completion of the initial term from the effective date, Customer shall pay applicable early termination charges.
                    </p>

                    <h2 className="legal__section-title">25. Severability</h2>
                    <p className="legal__text">
                        If any provision of these Terms is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such provision shall be enforced to the maximum extent permissible so as to effect the intent of the parties, and the remaining provisions of these Terms shall remain in full force and effect and shall not be affected or impaired in any way. In the event that any such invalid, illegal, or unenforceable provision cannot be enforced as written, the parties agree that such provision shall be modified or replaced with a valid and enforceable provision that most closely reflects the original intent and economic effect of the invalid provision.
                    </p>

                    <h2 className="legal__section-title">26. Survival</h2>
                    <p className="legal__text">
                        Sections relating to limitations of liability, indemnification, disclaimers, data use, AI training rights, acceptance of risk, and governing law shall survive termination or expiration of the Agreement.
                    </p>

                    <h2 className="legal__section-title">27. Miscellaneous</h2>
                    <p className="legal__text">
                        This Agreement represents the entire agreement between Customer and VOICESTACK with respect to the subject matter hereof, and supersedes all prior or contemporaneous communications and proposals (whether oral, written or electronic) between Customer and VOICESTACK with respect thereto. The Agreement shall be governed by and construed in accordance with the laws of the Victoria, Australia, excluding its conflicts of law rules, and the parties consent to exclusive jurisdiction and venue of the Courts of the State of Victoria and  Commonwealth of Australia. All notices under this Agreement shall be in writing and shall be deemed to have been duly given when received, if personally delivered or sent by certified or registered mail, return receipt requested; when receipt is electronically confirmed, if transmitted by facsimile or e-mail; or the day after it is sent, if sent for next day delivery by recognized overnight delivery service. Notices must be sent to the contacts for each party set forth on the Order Form. Either party may update its address set forth above by giving notice in accordance with this section. The Customer acknowledges that the Company&apos;s Terms and Conditions may be amended, updated, or modified from time to time. The most current version of the Terms and Conditions will be made available through the link provided on the Company&apos;s website, and it is the Customer&apos;s responsibility to review such updates periodically. Continued use of the Company&apos;s products or services shall constitute acceptance of the updated Terms and Conditions. Except for payment obligations, neither party shall be liable for any failure to perform its obligations hereunder where such failure results from any cause beyond such party&apos;s reasonable control, including, without limitation, the elements; fire; flood; severe weather; earthquake; vandalism; accidents; sabotage; power failure; denial of service attacks or similar attacks; Internet failure; acts of God and the public enemy; acts of war; acts of terrorism; riots; civil or public disturbances; strikes lock-outs or labor disruptions; any laws, orders, rules, regulations, acts or restraints of any government or governmental body or authority, civil or military, including the orders and judgments of courts. Customer may not assign any of its rights or obligations hereunder without VOICESTACK&apos;s consent, except that Customer may assign all of its rights and obligations hereunder without such consent to a successor-in-interest in connection with a sale of substantially all of such party&apos;s business relating to this Agreement, which is not a competitor of VOICESTACK. VOICESTACK may utilize subcontractors in the performance of its obligations hereunder and may freely transfer and assign any of its rights and obligations under this Agreement. No agency, partnership, joint venture, or employment relationship is created as a result of this Agreement and neither party has any authority of any kind to bind the other in any respect. In any action or proceeding to enforce rights under this Agreement, the prevailing party shall be entitled to recover costs and attorneys&apos; fees. If any provision of this Agreement is held to be unenforceable for any reason, such provision shall be reformed only to the extent necessary to make it enforceable. The failure of either party to act with respect to a breach of this Agreement by the other party shall not constitute a waiver and shall not limit such party&apos;s rights with respect to such breach or any subsequent breaches.
                    </p>

                    <h2 className="legal__section-title">28. DEFINITIONS &amp; INTERPRETATIONS</h2>
                    <p className="legal__text">
                        In this Agreement, unless the context otherwise requires, or otherwise expressly stated herein:
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>Aggregated Anonymous Data</strong> means data submitted to, collected by, or generated by VoiceStack in connection with its provision of the Services, including as a result of Customer&apos;s use which has been fully aggregated, anonymized and de-identified such that it can in no way be linked specifically to any individual nor identify any particular individual of any kind, nor constitute Personal Information of the Customer (or any of its end-users).
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>Applicable Laws</strong> means all Australian (Federal, State &amp; Territory) laws and regulations, together with international applicable laws, enactments, regulations, regulatory policies, guidelines, mandatory and legally required industry codes, regulatory permits and regulatory licences which are in force from time to time during the Term, including, in respect of the Customer and/or any Customer personnel, any statutory duty;
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>Australian Consumer Law</strong> means the Australian Consumer Law under Schedule 2 to the Competition and Consumer Act 2010 (Cth), as amended or updated from time to time;
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>VoiceStack Provided TPS</strong> has the meaning given in clause 14;
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>Confidential Information</strong> means all confidential, non-public or proprietary information, regardless of how the information is stored or delivered, exchanged between the Parties, before, on or after the date of this Agreement, relating to the business, products, services, customers or other affairs of the Discloser of the information but does not include information which is in or becomes part of the public domain other than through breach of this Agreement;
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>Customer Data</strong> means any data, information or other material embodied in any medium that is provided, uploaded, or submitted by or on behalf of Customer to the Services, and platforms and websites forming part of the Services (including the VoiceStack Platform), including Personal Information (but excluding always any publicly available information or information obtained from third-party providers to VoiceStack and made available to Customer through the Services);
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>Discloser</strong> means a discloser of Confidential Information;
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>Dispute</strong> has the meaning given in clause 22
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>Dispute Notice</strong> has the meaning given in clause 22.1(a);
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>Eligible Data Breach</strong> means, as more particularly defined in Section 26WE/WF of the Privacy Act, any loss of, unauthorised access to, or unauthorised disclosure of, Customer Data which is likely to result in serious harm to any of the individuals to whom the Customer Data relates, and remedial action taken does not prevent that serious harm.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>GST</strong> has the meaning given in the GST Law;
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>GST Law</strong> has the meaning given in the A New Tax System (Goods and Services Tax) Act 1999 (Cth), and terms used which are not defined in this Agreement, but which are defined in the GST Law, have the meanings given in the GST Law;
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>Insolvency Event</strong> means in respect of a Party, the occurrence of one or more of the following events:
                    </p>
                    <p className="legal__text">
                        (a) an application or order is made for the winding up or dissolution or a resolution is passed or any steps are taken to pass a resolution for the winding up or dissolution of the company;
                    </p>
                    <p className="legal__text">
                        (b) a provisional liquidator, liquidator or person having a similar function under the laws of any relevant jurisdiction is appointed in respect of the company or any action is taken to appoint such a person and the action is not stayed, dismissed or withdrawn within ten (10) Business Days;
                    </p>
                    <p className="legal__text">
                        (c) the company is deregistered under the Corporations Act 2001 (Cth) or other legislation or notice of its proposed deregistration is given to it; or
                    </p>
                    <p className="legal__text">
                        (d) anything analogous to or of a similar effect to anything described above under the laws of any relevant jurisdiction.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>Intellectual Property Rights</strong> or &apos;IPR&apos; means copyright, patents, database rights and rights in trademarks, designs, know-how and confidential information whether in software or otherwise (and whether registered or unregistered); applications for registration, and the right to apply for registration, for any of these rights; and all other intellectual property rights and equivalent or similar forms of protection existing anywhere in the world;
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>Order Form</strong> means the order form provided by VoiceStack that incorporates the Agreement, under which Customer may order the Services, as varied by VoiceStack from time to time;
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>Order Form Term</strong> means the period set out in an Order Form during which VoiceStack will provide the Services, comprising the Initial Order Form Term and any Renewal Order Form Term(s);
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>Personal Information</strong> has the meaning given in the Privacy Act, and includes data or information (including an opinion), whether true or not, about an individual who can be identified or reasonably identifiable either from that data or from that data when combined with other information to which an entity has access or is likely to have access;
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>Privacy Act</strong> means the Privacy Act, 1988 (Cth), including the Australian Privacy Principles (APPs), together with all codes of practice, guidance and rules and orders issued thereunder, including all amendments, updates, replacements and/or additions to each or any of them from time to time;
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>Privacy Laws</strong> means the Privacy Act, the SPAM Act (2003), and all other Applicable Laws in force relating to or impacting on the handling and/or privacy of Personal Information, together with all codes of practice, guidance and rules and orders issued thereunder, including all amendments, updates, replacements and/or additions to each or any of them from time to time;
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>Professional Services</strong> has the meaning given in clause 12;
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>Recipient</strong> means a recipient of Confidential Information;
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>Security Incident</strong> means any breach of VoiceStack&apos;s security controls or environment leading to the accidental or unlawful loss of, unauthorised access to, or disclosure of, Customer Data.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>Services</strong> means all services provided by VoiceStack to Customer under this Agreement (including any Order Form), including the Professional Services, VoiceStack Platform, Maintenance &amp; Support Services and all other services or works provided from time to time (as each are amended or updated from time to time);
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>1. ACCEPTABLE USE POLICY.</strong> Customer hereby acknowledges that Customer has read, and is familiar with, VoiceStack&apos;s Acceptable Use Policy (&quot;AUP&quot;) as mentioned below and incorporated by this reference. Customer hereby acknowledges that any violation of the AUP by Customer shall entitle VoiceStack to terminate or suspend the Services provided hereunder to customer. The AUP may be updated from time to time at the sole discretion of VoiceStack. VoiceStack shall communicate any changes to the AUP and Customer may terminate this agreement within 30 days of such communication if the changes to the AUP are not acceptable by the Customer.
                    </p>
                    <p className="legal__section-sub-title">
                        <strong>2. Fair and Reasonable Use:</strong> Services are for normal, reasonable business use and consistent with the types and levels of usage by typical customers using Services on same or similar plans. &quot;Typical&quot; refers to the calling patterns of at least 95% of VoiceStack&apos;s Customers on the same or similar plan. Certain plans, including unlimited call minutes, are designed for normal commercial use and are not intended to represent typical usage by unique organizations such as call centers (other than the internal call centers inside a dental practice), resellers, fax messaging services or telemarketing firms. Unauthorized or excessive use beyond that Typical use may cause extreme network capacity and congestion issues for VoiceStack and third-party networks. VoiceStack may suspend services in the event of unauthorized or excessive use. Notwithstanding the above, Customer shall be considered in violation of this section if aggregate call minutes for the Customer are more than 3000 minutes per User per calendar month.
                    </p>

                    <h2 className="legal__section-title">ACCEPTABLE USE POLICY</h2>
                    <p className="legal__text">
                        Good Methods Pty Ltd (&quot;VoiceStack&quot;) has formulated this Acceptable Use Policy (&quot;AUP&quot;) in order to encourage the responsible use of VoiceStack&apos;s networks, equipment, systems, services, web sites, and products (collectively, the &quot;VoiceStack Services&quot;) by its customers, users granted access by customers, and any other users of the VoiceStack Services (collectively, &quot;Users&quot;), and to enable it to provide its Users with secure, reliable and productive services. By using the VoiceStack Services, Users consent to be bound by the terms of this AUP. VoiceStack reserves the right to modify this AUP in its discretion at any time. Any use of the VoiceStack Services after such modification shall constitute acceptance of such modification. VoiceStack Services are for Users&apos; direct business use and Users shall not, under any circumstances, resell, retail, repackage for sale, distribute or wholesale or otherwise commercially distribute the services described herein by itself or in conjunction with any other services provided by Users. The VoiceStack Services must be used in a manner that is consistent with the intended purpose of the VoiceStack Services and may be used only for lawful purposes. Users shall not use the VoiceStack Services to transmit, distribute or store material: (a) in violation of any applicable law or regulation, including export or encryption laws or regulations; or (b) that may expose VoiceStack to criminal or civil liability. Users are further prohibited from assisting any other person in violating any part of this AUP. VoiceStack takes no responsibility for any material created or accessible on or through the VoiceStack Services. VoiceStack is not obligated to monitor or exercise any editorial control over such material but reserves the right to do so. In the event that VoiceStack becomes aware that any such material may violate this AUP and/or expose VoiceStack to civil or criminal liability, VoiceStack reserves the right to block access to such material and suspend or terminate any Users creating, storing or disseminating such material. VoiceStack further reserves the right to cooperate with legal authorities and third parties in the investigation of alleged wrongdoing, including disclosing the identity of the Users that VoiceStack deems responsible for the wrongdoing. Users shall not use the VoiceStack Services to transmit, distribute or store material that is illegal or illicit. Material accessible through the VoiceStack Services may be subject to protection under privacy, publicity, or other personal rights and intellectual property rights, including but not limited to, copyrights and laws protecting patents, trademarks, trade secrets or other proprietary information. Users shall not use the VoiceStack Services in any manner that would infringe, dilute, misappropriate, or otherwise violate any such rights. Users shall not use the VoiceStack Services to transmit, distribute or store material that contains a virus, worm, Trojan horse, or other component harmful to the VoiceStack Services, any other network or equipment, or other users. Users shall not use the VoiceStack Services to transmit or distribute material containing fraudulent offers for goods or services, or any advertising or promotional materials that contain false, deceptive, or misleading statements, claims, or representations. In addition, Users are prohibited from submitting any false or inaccurate data on any order form, contract or online application, including the fraudulent use of credit cards. Users shall only use authentic credentials to make and receive phone calls and services on approved VoiceStack devices. Users shall not use any device and/or software that has not been authorized by VoiceStack. User agrees to only use Services for normal and regular business use. Any attempt to use any other device or software not approved by VoiceStack in writing or use VoiceStack for any other purpose than normal business service as approved by VoiceStack will be investigated and prosecuted to the full extent of the law. Users shall not use the VoiceStack Services to send unsolicited email messages, including, without limitation, bulk commercial advertising or informational announcements (&quot;spam&quot;). Further, Users are prohibited from using the service of another provider to send spam or to promote a site hosted on or connected to the VoiceStack Services. Users are prohibited from violating or attempting to violate the security of the VoiceStack Services , including, without limitation, (a) accessing data not intended for such Users or logging into a server or account which such Users is not authorized to access, (b) impersonating VoiceStack personnel, (c) attempting to probe, scan or test the vulnerability of a system or network or to breach security or authentication measures without proper authorization, (d) attempting to interfere with, disrupt or disable service to any subscriber, host or network, including, without limitation, via means of overloading, &quot;flooding&quot;, &quot;mailbombing&quot;, &quot;denial of service&quot; attacks or &quot;crashing&quot;, (e) forging any TCP/IP packet header or any part of the header information in any e mail or newsgroup posting, (f) taking any action in order to obtain services to which such User is not entitled, or (g) attempting to utilize another subscriber&apos;s account name or persona without authorization from that User. Users are also prohibited from attempting any action designed to circumvent or alter any method of measuring or billing for VoiceStack services. Violations of system or network security may result in civil or criminal liability. VoiceStack will investigate occurrences which may involve such violations and may involve, and cooperate with, law enforcement authorities in prosecuting Users who are involved in such violations.
                    </p>
                </div>
            </Section>
        </div>
        )}

export default SAASCustomerAgreementPage;