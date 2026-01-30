import Section from "~/components/structure/Section";

function TermsAndConditionsPage() {
    return (
        <div className="w-full flex justify-center border py-40 px-8">
            <Section className=" w-full md:max-w-5xl flex flex-col">
                <div className="flex flex-col text-center justify-center mb-10">
                    <h1 className="text-4xl font-semibold">
                        TERMS AND CONDITIONS
                    </h1>
                    <h2 className="text-3xl font-semibold mt-4">
                        SAAS CUSTOMER AGREEMENT
                    </h2>
                </div>

                <div className="legal-content">
                    <p className="legal__text">
                        <strong>Effective Date:: 01 January 2026</strong>
                    </p>
                    <p className="legal__text">
                        This SAAS Customer Agreement (the &quot;Agreement&quot;) contains the Terms and Conditions that apply to the use of VOICEBOT Services (&quot;as defined below&quot;) offered by Good Methods Global Inc. (VoiceStack/ Service Provider&quot;) to the Customer identified in the applicable order form or subscription agreement (&quot;Customer&quot;). BY EXECUTING AN ORDER FORM, SUBSCRIPTION AGREEMENT, OR BY ACCESSING OR USING THE SERVICES, CUSTOMER AGREES TO BE BOUND BY THIS AGREEMENT. These Terms govern Customer&apos;s access to and use of Service Provider&apos;s AI-powered voice assistant services (&quot;VOICEBOT Services&quot;). These Terms are incorporated into and governed by the Order Form / SAAS Agreement, Subscription Agreement, or similar governing agreement between the parties (the &quot;Agreement&quot;). In the event of a conflict between these Terms and any Order Form, these Terms shall control with respect to the VOICEBOT Services unless expressly stated otherwise.
                    </p>
                    <h2 className="legal__section-title">1. Definitions</h2>
                    <p className="legal__section-sub-title">
                    <strong>1.1 &quot;VOICEBOT&quot;</strong> means Service Provider&apos;s artificial intelligence–powered automated voice agent that interacts with callers through voice over telephony, using natural language understanding and generation to receive inputs and produce Outputs. &quot;VOICEBOT&quot; includes the underlying models (including machine learning models), prompts, conversation logic, call flows, telephony and speech components (e.g., speech-to-text and text-to-speech), configurations, integrations, analytics, safety controls, and updates made available by Service Provider as part of the services.</p>
                    
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
                    <strong>1.4 &quot;PHI&quot;</strong> has the meaning set forth under the Health Insurance Portability and Accountability Act of 1996 (&quot;HIPAA&quot;).
                    </p>
                    <p className="legal__section-sub-title">
                    <strong>1.5 &quot;Applicable Law&quot;</strong> means all federal, state, and local laws, regulations, and rules applicable to Customer&apos;s use of the VOICEBOT Services, including but not limited to HIPAA, TCPA, FTC Act, state privacy laws, and call-recording consent laws.
                    </p>
                    <p className="legal__section-sub-title">
                    <strong>1.6 &quot;Outputs&quot;</strong> refers to any content, actions, responses, communications, call outcomes, recordings, transcriptions, or other materials produced, generated, or initiated by the VOICEBOT Services through automated, artificial intelligence driven, or machine learning based processes.
                    </p>
                    <h2 className="legal__section-title">2. Scope of VOICEBOT Services</h2>
                    <h3 className="legal__section-sub-title">
                        2.1 Provision and Availability.
                    </h3>
                    <p className="legal__text">
                        Service Provider shall make the VOICEBOT Services available for inbound and outbound telephone interactions, as configured and authorized by Customer. Customer may deploy one or more VOICEBOTs, , each with Customer-configured Call Flows, destinations, business rules, and Escalation conditions.
                    </p>
                    <h3 className="legal__section-sub-title">
                        2.2 No Medical Advice or Clinical Decision Making.
                    </h3>
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
                    <h3 className="legal__section-sub-title">
                        2.3 Administrative Use Only.
                    </h3>
                    <p className="legal__text">
                        The VOICEBOT Services are intended solely for administrative, operational, and informational purposes. The VOICEBOT Services are not designed to (and shall not) replace human personnel, professional judgment, or clinical decision-making, and shall not be used to provide medical advice, diagnosis, triage, or treatment recommendations.
                    </p>
                    <h3 className="legal__section-sub-title">
                        2.4 Customer Configuration and Control.
                    </h3>
                    <p className="legal__text">
                        Customer retains full responsibility and control over the configuration and operation of the VOICEBOT Services, including without limitation:
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
                    <p className="legal__text">
                        2.5 Customer shall not rely on, apply, or permit the use of Outputs in connection with any decision or activity that may produce legal, medical, financial, or similarly significant effects on an individual, including but not limited to decisions involving healthcare diagnosis or treatment, creditworthiness, insurance eligibility, employment, education, or any other decisions or actions subject to legal, regulatory, or significant risk considerations.
                    </p>
                    <h2 className="legal__section-title">3. Artificial Intelligence Disclosure and Transparency</h2>
                    <h3 className="legal__section-sub-title">
                        3.1 Use of Artificial Intelligence.
                    </h3>
                    <p className="legal__text">
                        Customer acknowledges that the VOICEBOT and VOICEBOT Services utilizes artificial intelligence, machine learning, and probabilistic models and does not produce deterministic or guaranteed outputs.
                    </p>
                    <h3 className="legal__section-sub-title">
                        3.2 AI Identification.
                    </h3>
                    <p className="legal__text">
                        VOICEBOT is designed to identify itself as an automated or AI-powered system as and when:
                    </p>
                    <ul className="legal__list">
                        <li className="legal__list-item">
                            Required by Applicable Law; or
                        </li>
                        <li className="legal__list-item">
                            Asked directly by a caller.
                        </li>
                    </ul>
                    <h3 className="legal__section-sub-title">
                        3.3 Caller Awareness.
                    </h3>
                    <p className="legal__text">
                        Customer acknowledges that interactions may reasonably indicate to callers that they are communicating with an automated system.
                    </p>
                    <h3 className="legal__section-sub-title">
                        3.4
                    </h3>
                    <p className="legal__text">
                        Any Outputs generated by VOICEBOT or VOICEBOT Services are produced through automated processes and do not reflect the opinions, positions, or endorsements of the Service Provider.
                    </p>
                    <h2 className="legal__section-title">4. AI Limitations and Disclaimers</h2>
                    <h3 className="legal__section-sub-title">
                        4.1 No Guarantee of Accuracy.
                    </h3>
                    <p className="legal__text">
                        Customer acknowledges that:
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
                    <h3 className="legal__section-sub-title">
                        4.2
                    </h3>
                    <p className="legal__text">
                        Customer acknowledges that, due to the nature of artificial intelligence systems, the VOICEBOT Services may generate responses or actions that are similar or identical to those produced for other customers, users, or scenarios.
                    </p>
                    <h3 className="legal__section-sub-title">
                        4.3 Guardrails and Scripts.
                    </h3>
                    <p className="legal__text">
                        While Service Provider implements configurable prompts, logic, and guardrails, Service Provider does not guarantee that the VOICEBOT will always adhere to scripts or constraints.
                    </p>
                    <h3 className="legal__section-sub-title">
                        4.4 Disclaimer of Warranties.
                    </h3>
                    <p className="legal__text">
                        THE VOICEBOT AND VOICEBOT SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;, EXCEPT AS EXPRESSLY SET FORTH IN THESE TERMS, AND WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING, WITHOUT LIMITATION, ANY IMPLIED WARRANTIES OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, RELIABILITY, COMPLETENESS, OR ANY WARRANTIES IMPLIED BY ANY COURSE OF PERFORMANCE, COURSE OF DEALING, OR USAGE OF TRADE, ALL OF WHICH ARE EXPRESSLY DISCLAIMED.
                    </p>
                    <p className="legal__text">
                        WITHOUT LIMITING THE FOREGOING, SERVICE PROVIDER DOES NOT WARRANT THAT THE VOICEBOT SERVICES OR ANY VOICEBOT OUTPUTS WILL BE ERROR-FREE, UNINTERRUPTED, TIMELY, SECURE, COMPLETE, OR HUMAN-EQUIVALENT, OR THAT THE VOICEBOT WILL ACCURATELY UNDERSTAND, INTERPRET, OR CORRECTLY PROCESS ALL CALLER INPUTS, SPEECH, ACCENTS, CONTEXT, OR REQUESTS.
                    </p>
                    <h2 className="legal__section-title">5. PMS and Third Party System Access</h2>
                    <h3 className="legal__section-sub-title">
                        5.1 Authorization at Customer&apos;s Risk.
                    </h3>
                    <p className="legal__text">
                        Any authorization to integrate the VOICEBOT with a PMS or third-party system is granted at Customer&apos;s sole discretion and risk.
                    </p>
                    <h3 className="legal__section-sub-title">
                        5.2 No Responsibility for PMS Actions.
                    </h3>
                    <p className="legal__text">
                        Service Provider shall not be responsible or liable for:
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
                    <h3 className="legal__section-sub-title">
                        5.3 Customer Responsibilities.
                    </h3>
                    <p className="legal__text">
                        Customer remains solely responsible for:
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
                    <h3 className="legal__section-sub-title">
                        6.1 Human Oversight Required.
                    </h3>
                    <p className="legal__text">
                        Customer acknowledges that appropriate human oversight is required when deploying the VOICEBOT.
                    </p>
                    <h3 className="legal__section-sub-title">
                        6.2 Customer Obligations.
                    </h3>
                    <p className="legal__text">
                        Customer shall:
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
                    <h3 className="legal__section-sub-title">
                        6.3
                    </h3>
                    <p className="legal__text">
                        Customer bears sole responsibility for independently reviewing, validating, and confirming the accuracy and appropriateness of any Outputs prior to acting upon, relying on, distributing, or incorporating such Outputs into business operations or communications.
                    </p>
                    <h3 className="legal__section-sub-title">
                        6.4 No Service Provider Liability.
                    </h3>
                    <p className="legal__text">
                        Service Provider shall not be liable for issues arising from Customer&apos;s failure to provide adequate oversight or supervision.
                    </p>
                    <h2 className="legal__section-title">7. HIPAA and Healthcare Data Compliance</h2>
                    <h3 className="legal__section-sub-title">
                        7.1 HIPAA Compliance.
                    </h3>
                    <p className="legal__text">
                        To the extent the VOICEBOT Services involve PHI, the parties shall comply with HIPAA and its implementing regulations.
                    </p>
                    <h3 className="legal__section-sub-title">
                        7.2 Service Provider Safeguards.
                    </h3>
                    <p className="legal__text">
                        Service Provider shall:
                    </p>
                    <ul className="legal__list">
                        <li className="legal__list-item">
                            Implement reasonable administrative, technical, and physical safeguards
                        </li>
                        <li className="legal__list-item">
                            Limit PHI access to the minimum necessary
                        </li>
                        <li className="legal__list-item">
                            Execute a Business Associate Agreement (&quot;BAA&quot;) upon request or where required
                        </li>
                    </ul>
                    <h3 className="legal__section-sub-title">
                        7.3 Caller-Provided Information.
                    </h3>
                    <p className="legal__text">
                        Customer acknowledges that:
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
                    <h3 className="legal__section-sub-title">
                        7.4
                    </h3>
                    <p className="legal__text">
                        Customer remains exclusively responsible for ensuring the lawful collection, security, confidentiality, integrity, and permitted use of all data, including PHI, that is transmitted, processed, or handled through the VOICEBOT Services.
                    </p>
                    <h2 className="legal__section-title">8. No Medical, Dental, or Professional Advice</h2>
                    <h3 className="legal__section-sub-title">
                        8.1 No Clinical Advice.
                    </h3>
                    <p className="legal__text">
                        VOICEBOT does not provide medical, dental, legal, or professional advice, diagnoses, or treatment recommendations.
                    </p>
                    <h3 className="legal__section-sub-title">
                        8.2 Informational Use Only.
                    </h3>
                    <p className="legal__text">
                        Any information provided is administrative or general in nature.
                    </p>
                    <h3 className="legal__section-sub-title">
                        8.3 Clinical Routing.
                    </h3>
                    <p className="legal__text">
                        Customer is solely responsible for ensuring that clinical or professional inquiries are routed to qualified personnel.
                    </p>
                    <h2 className="legal__section-title">9. Regulatory, TCPA, and Consent Compliance</h2>
                    <h3 className="legal__section-sub-title">
                        9.1 Customer Compliance Responsibility.
                    </h3>
                    <p className="legal__text">
                        Customer is solely responsible for ensuring compliance with:
                    </p>
                    <ul className="legal__list">
                        <li className="legal__list-item">
                            Telephone Consumer Protection Act (TCPA)
                        </li>
                        <li className="legal__list-item">
                            FCC regulations
                        </li>
                        <li className="legal__list-item">
                            Applicable Call recording and consent laws
                        </li>
                        <li className="legal__list-item">
                            Applicable State privacy and consumer protection laws
                        </li>
                        <li className="legal__list-item">
                            Applicable Professional licensing and board regulations
                        </li>
                    </ul>
                    <h3 className="legal__section-sub-title">
                        9.2 Consent Management.
                    </h3>
                    <p className="legal__text">
                        Customer represents and warrants that it has obtained or will obtain all lawfully required:
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
                    <h3 className="legal__section-sub-title">
                        9.3 No Legal Advice.
                    </h3>
                    <p className="legal__text">
                        Service Provider does not provide legal or regulatory compliance advice.
                    </p>
                    <h2 className="legal__section-title">10. Data Use, Recording, and Model Improvement</h2>
                    <h3 className="legal__section-sub-title">
                        10.1
                    </h3>
                    <p className="legal__text">
                        Customer understands and agrees that calls and interactions involving the VOICEBOT Services may be recorded, monitored, and stored for purposes including service delivery, quality assurance, system optimization, troubleshooting, and training, subject to Applicable Law and required consents.
                    </p>
                    <h3 className="legal__section-sub-title">
                        10.2 Service Operation.
                    </h3>
                    <p className="legal__text">
                        Service Provider may process call metadata, transcripts, and interaction data as necessary to provide and support the VOICEBOT Services.
                    </p>
                    <h3 className="legal__section-sub-title">
                        10.3
                    </h3>
                    <p className="legal__text">
                        Customer grants Service Provider a non exclusive right to utilize interaction data, call content, transcripts, and related materials in anonymized and aggregated form, in compliance with Applicable Law and HIPAA de-identification standards, for purposes including enhancing system performance, improving AI models, developing new features, conducting analytics, and refining speech recognition and language processing capabilities.
                    </p>
                    <h3 className="legal__section-sub-title">
                        10.4 De-Identification.
                    </h3>
                    <p className="legal__text">
                        Service Provider may use de-identified and aggregated data to improve system performance, analytics, and reliability.
                    </p>
                    <h3 className="legal__section-sub-title">
                        10.5 No Sale of PHI.
                    </h3>
                    <p className="legal__text">
                        Service Provider does not sell PHI or use PHI for advertising purposes.
                    </p>
                    <h3 className="legal__section-sub-title">
                        10.6
                    </h3>
                    <p className="legal__text">
                        Customer is solely responsible for determining and fulfilling any legal, regulatory, or operational requirements related to the retention, archiving, or production of call recordings, transcripts, or interaction records. Service Provider has no duty to preserve, store, or make such records available unless expressly agreed in writing.
                    </p>
                    <h3 className="legal__section-sub-title">
                        10.7 Call Recording; Legal Compliance
                    </h3>
                    <p className="legal__text">
                        Customer acknowledges and agrees that all inbound and outbound calls made through or in connection with the VOICEBOT Services may be automatically recorded by VoiceStack as part of the VOICEBOT Services. Customer shall be solely responsible for obtaining all legally required consents, authorizations, and permissions from all applicable parties to permit the recording, storage, processing, use, and analysis of such calls in connection with the provision, maintenance, and improvement of the VOICEBOT Services. Customer represents and warrants that it is familiar with, and shall comply with, all applicable international, federal, state, and local laws, regulations, and rules relating to calling, recording, monitoring, storage, processing, and receipt of communications, including without limitation notice and consent requirements. Customer shall not use the VOICEBOT Services or any recordings for any unlawful, illegal, or fraudulent purpose. Customer acknowledges that the VoiceStack does not provide legal advice and has no obligation to monitor or ensure Customer&apos;s compliance with applicable laws. Customer assumes sole and exclusive responsibility for any confidential, private, or privileged communications, recordings, data, or information created, transmitted, stored, or accessed through the VOICEBOT Services. Any liability arising out of or relating to this Section shall be subject to <strong>Section 11 (Limitation of Liability)</strong>. Customer&apos;s indemnification obligations arising out of or relating to this Section are governed by <strong>Section 12 (Indemnification by Customer)</strong>.
                    </p>
                    <h2 className="legal__section-title">11. Limitation of Liability</h2>
                    <h3 className="legal__section-sub-title">
                        11.1 Exclusion of Damages
                    </h3>
                    <p className="legal__text">
                        To the maximum extent permitted by law, except for the parties&apos; indemnification obligations, in no event shall the Service Provider, nor its directors, officers, employees, agents, partners, suppliers, or content providers, be liable under any theory of law (including contract, tort, negligence, strict liability, or otherwise) for any indirect, incidental, special, consequential, exemplary, or punitive damages, or for any loss of profits, loss of revenue, loss of data, loss of goodwill, or cost of procurement of substitute goods or services, arising out of or relating to the VOICEBOT Services.
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
                    <h3 className="legal__section-sub-title">
                        11.2
                    </h3>
                    <p className="legal__text">
                        To the maximum extent permitted by law, except for the parties&apos; indemnification obligations, Service Provider&apos;s total cumulative liability for any and all claims arising out of or relating to the VOICEBOT Services or these Terms, whether in contract, tort, strict liability, negligence, or otherwise, shall not exceed, in the aggregate, the fees paid or payable by Customer for the VOICEBOT Services during the twelve (12) months immediately preceding the event giving rise to the claim.
                    </p>
                    <h2 className="legal__section-title">12. Indemnification by Customer</h2>
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
                    <h2 className="legal__section-title">13. Service Evolution and Changes</h2>
                    <h3 className="legal__section-sub-title">
                        13.1 Evolving Technology.
                    </h3>
                    <p className="legal__text">
                        Customer acknowledges that AI technologies evolve rapidly.
                    </p>
                    <h3 className="legal__section-sub-title">
                        13.2 Updates.
                    </h3>
                    <p className="legal__text">
                        Service Provider may modify, update, or enhance the VOICEBOT Services.
                    </p>
                    <h3 className="legal__section-sub-title">
                        13.3 No Guarantee of Consistency.
                    </h3>
                    <p className="legal__text">
                        Behaviour, responses, and performance may change over time.
                    </p>
                    <h2 className="legal__section-title">14. Acceptance of AI Risk</h2>
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
                    <h2 className="legal__section-title">15 Service Updates</h2>
                    <h3 className="legal__section-sub-title">
                        15.1
                    </h3>
                    <p className="legal__text">
                        Subject to all of the terms and conditions of this Agreement (including any limitations and restrictions set forth on the applicable Order Form), VoiceStack grants Customer the right to access and use the services specified in each Order Form (collectively, the &quot;Service,&quot; or &quot;Services&quot;) during the applicable Order Form Term (as defined below) for the internal business purposes of such Customer, only as provided herein and only pursuant to VoiceStack&apos;s applicable user documentation.
                    </p>
                    <h3 className="legal__section-sub-title">
                        15.2
                    </h3>
                    <p className="legal__text">
                        From time to time, VoiceStack may provide upgrades, patches, enhancements, or fixes for the Services to its customers generally without additional charge (&quot;Updates&quot;), and such Updates will become part of the Services and subject to this Agreement; provided that VoiceStack shall have no obligation under this Agreement or otherwise to provide any such Updates. Customer understands that VoiceStack may cease supporting old versions or releases of the Services at any time in its sole discretion; provided that VoiceStack shall use commercially reasonable efforts to give Customer sixty (60) days prior notice of any major changes. VoiceStack may in its sole discretion modify, enhance or otherwise change the Services, provided that such changes do not materially limit or adversely affect the Services provided to Customer hereunder.
                    </p>
                    <h2 className="legal__section-title">16. Professional Services</h2>
                    <p className="legal__text">
                        Upon payment of any applicable fees set forth in each Order Form, VoiceStack agrees to use reasonable commercial efforts to provide professional services for the Service only if and to the extent such professional services is set forth on such Order Form (&quot;Professional Services&quot;). The parties may enter into by mutual execution separate statements of work (the &quot;SOW&quot;), for the provision by VoiceStack of Professional Services to Customer, which may include customization, configuration, implementation, deployment, guided services, consultation, or training services. The fees and terms for such Professional Services will be as provided in the applicable SOW. If VoiceStack provides Professional Services in excess of any agreed-upon hours estimate, or if VoiceStack otherwise provides additional services beyond those agreed in an Order Form, Customer will pay VoiceStack at its then-current hourly rates for such services.
                    </p>
                    <h2 className="legal__section-title">17. Support; Service Levels</h2>
                    <p className="legal__text">
                        Subject to the terms and conditions of this Agreement, VoiceStack will provide its standard support and maintenance services for the Service that it generally provides to other customers without additional charges. VoiceStack will undertake commercially reasonable efforts to make the Services available.
                    </p>
                    <h2 className="legal__section-title">18. Ownership; Third Party; Feedback</h2>
                    <h3 className="legal__section-sub-title">
                        18.1
                    </h3>
                    <p className="legal__text">
                        As between the parties, VoiceStack retains all right, title, and interest in and to the Services, and all software, products, works, and other intellectual property and moral rights related thereto or created, used, or provided by VoiceStack for the purposes of this Agreement, including any copies and derivative works of the foregoing. Any software which is distributed or otherwise provided to Customer hereunder (including without limitation any software identified on an Order Form) shall be deemed a part of the &quot;Services&quot; and subject to all of the terms and conditions of this Agreement. No rights or licenses are granted except as expressly and unambiguously set forth in this Agreement.
                    </p>
                    <h3 className="legal__section-sub-title">
                        18.2 Third-Party Services.
                    </h3>
                    <p className="legal__text">
                        Customer acknowledges and agrees that: (a) the Services may incorporate or contain, or operate in or with, certain software, services, information, data and materials operated or provided by third parties (&quot;Third-Party Services&quot;); (b) VoiceStack may provide certain Third-Party Services together with the Services as set forth in the applicable Order Form (&quot;VoiceStack Provided TPS&quot;), and such VoiceStack Provided TPS may only be used in conjunction with the Services; (c) Customer is solely responsible for procuring any and all rights necessary for it to access Third-Party Services (other than VoiceStack Provided TPS); and (d) Customer&apos;s use of the Third-Party Services shall be subject to (and Customer agrees it is bound by) any additional third-party terms and conditions (collectively, the &quot;Third-Party Terms&quot;), which are hereby incorporated into this Agreement by this reference. Customer is responsible for checking the Third-Party Terms for updates, and any use by Customer of the Services following a change to the Third-Party Terms shall constitute acceptance of such change. VoiceStack cannot and does not guarantee that the Services shall incorporate (or continue to incorporate) any particular Third-Party Services. Notwithstanding anything else, VoiceStack does not make any representations or warranties or provide any indemnification with respect to Third-Party Services or any third-party providers. Customer will rely on and seek remedies solely from the original licensors or vendors of such Third-Party Services. Unless otherwise specified in the applicable Order Form, VoiceStack is not responsible for fulfillment of any third-party warranty or for problems attributable to the use or operations of Third-Party Services (including, but not limited to, the availability or operation of the Services to the extent such availability and operation is dependent upon Third-Party Services).
                    </p>
                    <h3 className="legal__section-sub-title">
                        18.3
                    </h3>
                    <p className="legal__text">
                        Customer may from time to time provide suggestions, comments or other feedback to VoiceStack with respect to the Service (&quot;Feedback&quot;). Feedback, even if designated as confidential by Customer, shall not create any confidentiality obligation for VoiceStack notwithstanding anything else. Customer shall, and hereby does, grant to VoiceStack a nonexclusive, worldwide, perpetual, irrevocable, transferable, sublicensable, royalty-free, fully paid up license to use and exploit the Feedback for any purpose. Nothing in this Agreement will impair VoiceStack&apos;s right to develop, acquire, license, market, promote or distribute products, software or technologies that perform the same or similar functions as, or otherwise compete with any products, software or technologies that Customer may develop, produce, market, or distribute.
                    </p>
                    <h2 className="legal__section-title">19. Restrictions</h2>
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
                    <h2 className="legal__section-title">20. Customer Data Business Associate Agreement</h2>
                    <h3 className="legal__section-sub-title">
                        20.1
                    </h3>
                    <p className="legal__text">
                        For purposes of this Agreement, &quot;Customer Data&quot; shall mean any data, information or other material provided, uploaded, or submitted by or on behalf of Customer to the Service in the course of using the Service, which may include protected health information (&quot;PHI&quot;). Customer shall retain all right, title and interest in and to the Customer Data, including all intellectual property rights therein. Customer, not VoiceStack , shall have sole responsibility for the accuracy, quality, integrity, legality, reliability, appropriateness, and intellectual property ownership or right to use of all Customer Data. VoiceStack shall use commercially reasonable efforts to maintain the security and integrity of the Service and the Customer Data. VoiceStack is not responsible to Customer for unauthorized access to Customer Data or the unauthorized use of the Service unless such access is due to VoiceStack&apos;s gross negligence or willful misconduct. Customer is responsible for the use of the Service by any person to whom Customer has given access to the Service, even if Customer did not authorize such use.
                    </p>
                    <h3 className="legal__section-sub-title">
                        20.2
                    </h3>
                    <p className="legal__text">
                        If Customer is a Covered Entity or a Business Associate and includes Protected Health Information in Customer Data or otherwise provide any Protected Health Information to VoiceStack or via the Voicebot Services, execution of an Order Form that references to this Agreement will incorporate the terms of the HIPAA Business Associate Agreement (&quot;BAA&quot;) (available at <a href="https://www.voicestack.com/legal/2024-10/baa" className="text-blue-600 underline">https://www.voicestack.com/legal/2024-10/baa</a>  into that Agreement. In the event Customer directs VoiceStack to share PHI among different Covered Entities (each as defined in the BAA), Customer shall have obtained an executed and delivered consent certificate by authorized representatives of each such Covered Entity in the form attached to the applicable Order Form. Customer represents and warrants that it has full power and authority to grant the rights granted to VoiceStack in this Agreement and the BAA, and Customer will defend, indemnify and hold harmless VoiceStack from any loss, cost, liability, damage, settlement or other expense (including attorneys&apos; fees) due to a breach of the foregoing or due to a third party claim that if true would constitute a breach of the same.
                    </p>
                    <h2 className="legal__section-title">21. License Grant/ SAAS Access</h2>
                    <h3 className="legal__section-sub-title">
                        21.1 License Grant.
                    </h3>
                    <p className="legal__text">
                        Subject to this Agreement and the applicable Order Form, Service Provider grants Customer a limited, non-exclusive, non-transferable, non-sublicensable right to access and use the VOICEBOT Services during the applicable subscription term solely for Customer&apos;s internal business purposes.
                    </p>
                    <h3 className="legal__section-sub-title">
                        21.2 SaaS Model.
                    </h3>
                    <p className="legal__text">
                        VOICEBOT Services are provided on a hosted, subscription-based software-as-a-service basis. No software is sold or transferred.
                    </p>
                    <h2 className="legal__section-title">22. Fees, Payments and Taxes</h2>
                    <p className="legal__text">
                        Customer shall pay VoiceStack fees for the Service as set forth in each Order Form (&quot;Fees&quot;). Unless otherwise specified in an Order Form, all Fees shall be invoiced monthly in arrears and all invoices issued under this Agreement are payable in U.S. dollars within ten (10) days from date of invoice. Past due invoices are subject to interest on any outstanding balance of the lesser of 1.5% per month or the maximum amount permitted by law. Customer shall be responsible for all taxes associated with Service (excluding taxes based on VoiceStack&apos;s net income). All Fees paid are non-refundable and are not subject to set-off.
                    </p>
                    <h2 className="legal__section-title">23. Term and Termination</h2>
                    <h3 className="legal__section-sub-title">
                        23.1
                    </h3>
                    <p className="legal__text">
                        This Agreement shall commence upon the effective date set forth in the first Order Form, and, unless earlier terminated in accordance herewith, shall last until the expiration of all Order Form Terms. For each Order Form, the &quot;Order Form Term&quot; shall begin as of the effective date set forth on such Order Form, and unless earlier terminated as set forth herein, shall continue for the initial term specified on the Order Form (the &quot;Initial Order Form Term&quot;), and following the Initial Order Form Term, shall automatically renew for additional successive periods of one year each (each, a &quot;Renewal Order Form Term&quot;) unless either party notifies the other party of such party&apos;s intention not to renew no later than thirty (30) days prior to the expiration of the Initial Order Form Term or then-current Renewal Order Form Term, as applicable.
                    </p>
                    <h3 className="legal__section-sub-title">
                        23.2
                    </h3>
                    <p className="legal__text">
                        In the event of a material breach of this Agreement by either party, the non-breaching party may terminate this Agreement by providing written notice to the breaching party, provided that the breaching party does not materially cure such breach within thirty (30) days of receipt of such notice.
                    </p>
                    <h3 className="legal__section-sub-title">
                        23.3
                    </h3>
                    <p className="legal__text">
                        VoiceStack may suspend or limit Customer&apos;s access to or use of the Service if
                    </p>
                    <ul className="legal__list">
                        <li className="legal__list-item">
                            (i) for scheduled or emergency maintenance,
                        </li>
                        <li className="legal__list-item">
                            (ii) in the event Customer&apos;s account is sixty (60) days or more delinquent, or
                        </li>
                        <li className="legal__list-item">
                            (iii) Customer&apos;s use of the Service results in (or is reasonably likely to result in) damage to or material degradation of the Service which interferes with VoiceStack&apos;s ability to provide access to the VOICEBOT Service to other customers; provided that in the case of subsection
                        </li>
                    </ul>
                    <ul className="legal__list">
                        <li className="legal__list-item">
                            (a) VoiceStack shall use reasonable good faith efforts to work with Customer to resolve or mitigate the damage or degradation in order to resolve the issue without resorting to suspension or limitation;
                        </li>
                        <li className="legal__list-item">
                            (b) prior to any such suspension or limitation, VoiceStack shall use commercially reasonable efforts to provide notice to Customer describing the nature of the damage or degradation; and
                        </li>
                        <li className="legal__list-item">
                            (c) VoiceStack shall reinstate Customer&apos;s use of or access to the Service, as applicable, if Customer remediates the issue within thirty (30) days of receipt of such notice.
                        </li>
                    </ul>
                    <h3 className="legal__section-sub-title">
                        23.4
                    </h3>
                    <p className="legal__text">
                        Upon expiration or termination of this Agreement, all provisions of this Agreement which by their nature should survive termination shall survive termination, including, without limitation, accrued payment obligations, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
                    </p>
                    <h3 className="legal__section-sub-title">
                        23.5
                    </h3>
                    <p className="legal__text">
                        In the event the Customer terminates this Order form for any reason whatsoever, before completion of the initial term from the effective date, Customer shall pay applicable early termination charges.
                    </p>
                    <h2 className="legal__section-title">24. Severability</h2>
                    <p className="legal__text">
                    If any provision of these Terms is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such provision shall be enforced to the maximum extent permissible so as to effect the intent of the parties, and the remaining provisions of these Terms shall remain in full force and effect and shall not be affected or impaired in any way. In the event that any such invalid, illegal, or unenforceable provision cannot be enforced as written, the parties agree that such provision shall be modified or replaced with a valid and enforceable provision that most closely reflects the original intent and economic effect of the invalid provision.
                    </p>
                    <h2 className="legal__section-title">
                    25. Survival
                    </h2>
                    <p className="legal__text">
                    Sections relating to limitations of liability, indemnification, HIPAA, disclaimers, data use, AI training rights, acceptance of risk, and governing law shall survive termination or expiration of the Agreement.
                    </p>
                    <h2>
                    26. Miscellaneous
                    </h2>
                    <p className="legal__text">
                      This Agreement represents the entire agreement between Customer and VoiceStack with respect to the subject matter hereof, and supersedes all prior or contemporaneous communications and proposals (whether oral, written or electronic) between Customer and VoiceStack with respect thereto. The Agreement shall be governed by and construed in accordance with the laws of the State of Florida, excluding its conflicts of law rules, and the parties consent to exclusive jurisdiction and venue in the state and federal courts located in Orlando, Florida. All notices under this Agreement shall be in writing and shall be deemed to have been duly given when received, if personally delivered or sent by certified or registered mail, return receipt requested; when receipt is electronically confirmed, if transmitted by facsimile or e-mail; or the day after it is sent, if sent for next day delivery by recognized overnight delivery service. Notices must be sent to the contacts for each party set forth on the Order Form. Either party may update its address set forth above by giving notice in accordance with this section. The Customer acknowledges that the Company&apos;s Terms and Conditions may be amended, updated, or modified from time to time. The most current version of the Terms and Conditions will be made available through the link provided on the Company&apos;s website, and it is the Customer&apos;s responsibility to review such updates periodically. Continued use of the Company&apos;s products or services shall constitute acceptance of the updated Terms and Conditions. Except for payment obligations, neither party shall be liable for any failure to perform its obligations hereunder where such failure results from any cause beyond such party&apos;s reasonable control, including, without limitation, the elements; fire; flood; severe weather; earthquake; vandalism; accidents; sabotage; power failure; denial of service attacks or similar attacks; Internet failure; acts of God and the public enemy; acts of war; acts of terrorism; riots; civil or public disturbances; strikes lock-outs or labor disruptions; any laws, orders, rules, regulations, acts or restraints of any government or governmental body or authority, civil or military, including the orders and judgments of courts. Customer may not assign any of its rights or obligations hereunder without VoiceStack&apos;s consent, except that Customer may assign all of its rights and obligations hereunder without such consent to a successor-in-interest in connection with a sale of substantially all of such party&apos;s business relating to this Agreement, which is not a competitor of VoiceStack. VoiceStack may utilize subcontractors in the performance of its obligations hereunder and may freely transfer and assign any of its rights and obligations under this Agreement. No agency, partnership, joint venture, or employment relationship is created as a result of this Agreement and neither party has any authority of any kind to bind the other in any respect. In any action or proceeding to enforce rights under this Agreement, the prevailing party shall be entitled to recover costs and attorneys&apos; fees. If any provision of this Agreement is held to be unenforceable for any reason, such provision shall be reformed only to the extent necessary to make it enforceable. The failure of either party to act with respect to a breach of this Agreement by the other party shall not constitute a waiver and shall not limit such party&apos;s rights with respect to such breach or any subsequent breaches.
                    </p>
                </div>
              </Section>
            </div>
          )
}
export default TermsAndConditionsPage;