import Section from '~/components/structure/Section'

function Terms() {
  return (
    <div className="w-full flex justify-center border py-40 px-8">
      <Section className=" w-full md:max-w-5xl flex flex-col">
        <div className="flex flex-col text-center justify-center mb-10">
          <h1 className="text-4xl font-semibold">VOICEBOT Terms and Conditions</h1>
        </div>

        <div className="legal-content">
          <p className="c0">
            <span className="c1">Effective Date: 1</span>
            <span className="c7 c8">st</span>
            <span className="c1">&nbsp;January 2026</span>
          </p>
          <p className="c0 c4">
            <span className="c2"></span>
          </p>
          <p className="c0">
            <span className="c1">
              These VOICEBOT Terms and Conditions (&ldquo;Terms&rdquo;) are entered
              into by and between Good Methods Global Inc., (&ldquo;Service
              Provider&rdquo;) and the customer identified in the applicable order
              form or subscription agreement (&ldquo;Customer&rdquo;). These Terms
              govern Customer&rsquo;s access to and use of Service Provider&rsquo;s
              AI-powered voice assistant services (&ldquo;VOICEBOT
              Services&rdquo;).
            </span>
          </p>
          <p className="c0">
            <span className="c1">
              These Terms are incorporated into and governed by the Order Form /
              SAAS Agreement, Subscription Agreement, or similar governing agreement
              between the parties (the &ldquo;Agreement&rdquo;). In the event of a
              conflict, these Terms shall control with respect to the VOICEBOT
              Services.
            </span>
          </p>
          <h2 className="c0 c6" id="h.definitions">
            <span className="c9">1. Definitions</span>
          </h2>
          <p className="c0">
            <span className="c1">
              1.1 &ldquo;VOICEBOT&rdquo; means Provider&rsquo;s artificial
              intelligence&ndash;powered automated voice agent that interacts with
              callers through voice over telephony, using natural language
              understanding and generation to receive inputs and produce Outputs.
              &ldquo;Voicebot&rdquo; includes the underlying models (including
              machine learning models), prompts, conversation logic, call flows,
              telephony and speech components (e.g., speech-to-text and
              text-to-speech), configurations, integrations, analytics, safety
              controls, and updates made available by Provider as part of the
              services.
            </span>
          </p>
          <p className="c0">
            <span className="c1">
              1.2 &ldquo;IVA Voicebot&rdquo; (Interactive Voice Assistant) means a
              Voicebot primarily intended to (a) identify or infer a caller&rsquo;s
              intent, (b) collect minimal information required to determine next
              steps, and (c) route, transfer, or hand off the interaction in
              accordance with Customer&rsquo;s configuration, including routing to:
              (i) a telephone number, (ii) an extension, or (iii) a designated
              Service Bot or other automated workflow. For clarity, an IVA
              Voicebot&rsquo;s primary function is orchestration and call routing
              rather than completing a substantive customer transaction.
            </span>
          </p>
          <p className="c0">
            <span className="c1">
              1.3 &ldquo;Service Bot&rdquo; (Service Voicebot) means a Voicebot
              intended to perform configured administrative, operational, or
              informational tasks through automated conversation, including (as
              enabled by Customer) scheduling-related functions (e.g., appointment
              scheduling, confirmations, reminders, rescheduling, cancellations),
              intake of administrative details, FAQs and general inquiries (e.g.,
              office hours, location, directions, policies), and other non-clinical
              workflows, including by interacting with Customer systems or
              third-party systems via integrations.
            </span>
          </p>
          <p className="c0 c4">
            <span className="c1"></span>
          </p>
          <p className="c0">
            <span className="c1">
              1.4 &ldquo;VOICEBOT Services&rdquo; means the provision, hosting,
              operation, support, and maintenance of the VOICEBOT(s) (including any
              IVA VOICEBOT and/or Service Bot) solely for inbound and outbound
              telephone-based administrative, operational, and non-clinical
              communications, as configured and authorized by Customer, including
              related integrations, call flows, and telephony connectivity including
              appointment scheduling, confirmations, reminders, rescheduling,
              cancellations, call routing, and general inquiries.
            </span>
          </p>
          <p className="c0">
            <span className="c1">
              1.5 &ldquo;PMS&rdquo; means Customer&rsquo;s practice management system
              or any other third-party system authorized by Customer for
              integration.
            </span>
          </p>
          <p className="c0">
            <span className="c1">
              1.6 &ldquo;PHI&rdquo; has the meaning set forth under the Health
              Insurance Portability and Accountability Act of 1996
              (&ldquo;HIPAA&rdquo;).
            </span>
          </p>
          <p className="c0">
            <span className="c1">
              1.7 &ldquo;Applicable Law&rdquo; means all federal, state, and local
              laws, regulations, and rules applicable to Customer&rsquo;s use of the
              VOICEBOT Services, including but not limited to HIPAA, TCPA, FTC Act,
              state privacy laws, and call-recording consent laws.
            </span>
          </p>
          <p className="c0">
            <span className="c1">
              1.8 &ldquo;Outputs&rdquo; refers to any content, actions, responses,
              communications, call outcomes, recordings, transcriptions, or other
              materials produced, generated, or initiated by the VOICEBOT Services
              through automated, artificial intelligence driven, or machine learning
              based processes.
            </span>
          </p>
          <h2 className="c0 c6" id="h.scope">
            <span className="c9">2. Scope of VOICEBOT Services</span>
          </h2>
          <p className="c0">
            <span className="c1">
              2.1 Provision and Availability. Provider shall make the VOICEBOT
              Services available for inbound and outbound telephone interactions, as
              configured and authorized by Customer. Customer may deploy one or more
              VOICEBOTs, including (i) an IVA VOICEBOT and/or (ii) one or more
              Service Bots, each with Customer-configured Call Flows, destinations,
              business rules, and Escalation conditions.
            </span>
          </p>
          <p className="c0">
            <span className="c1">
              2.2 IVA VOICEBOT Scope (Routing and Orchestration). Where Customer
              enables an IVA VOICEBOT, its scope is limited to: (a) identifying or
              inferring caller intent, (b) collecting information necessary to
              determine routing or handoff, and (c) transferring or routing the call
              in accordance with Customer&rsquo;s configuration to a phone number,
              extension, queue, Service Bot, or other Customer-authorized
              destination. The IVA VOICEBOT is not intended to complete substantive
              transactions unless Customer explicitly configures the IVA VOICEBOT to
              hand off to a Service Bot or other workflow that performs such
              transactions.
            </span>
          </p>
          <p className="c0 c4">
            <span className="c1"></span>
          </p>
          <p className="c0">
            <span className="c1">
              2.3 Service Bot Scope (Task and Information Workflows). Where
              Customer enables a Service Bot, its scope is limited to performing
              Customer-configured administrative, operational, and informational
              workflows, including, as enabled: appointment scheduling, confirmations,
              reminders, rescheduling, cancellations, collection of administrative
              details, and responses to general inquiries (e.g., office hours,
              location, directions, policies). Service Bots may interact with
              Customer&rsquo;s PMS and other Customer-authorized systems solely
              through configured integrations and permissions.
            </span>
          </p>
          <p className="c0">
            <span className="c1">
              2.4 Administrative and Non-Clinical Use Only. The VOICEBOT Services are
              intended solely for administrative, operational, and informational
              purposes. The VOICEBOT Services are not designed to (and shall not)
              replace human personnel, professional judgment, or clinical
              decision-making, and shall not be used to provide medical advice,
              diagnosis, triage, or treatment recommendations.
            </span>
          </p>
          <p className="c0 c4">
            <span className="c1"></span>
          </p>
          <p className="c0">
            <span className="c1">
              2.5 Customer Configuration and Control. Customer retains full
              responsibility and control over the configuration and operation of the
              VOICEBOT Services, including without limitation:
            </span>
          </p>
          <ul className="c12 lst-kix_list_14-0 start">
            <li className="c0 c5 li-bullet-0">
              <span className="c1">
                Enabled use cases and features: deciding which VOICEBOTs, features,
                and workflows are enabled or disabled;
              </span>
            </li>
            <li className="c0 c5 li-bullet-0">
              <span className="c1">
                Call Flows and routing logic: scripts, prompts, intent categories,
                destinations, call routing behavior, and hours of operation;
              </span>
            </li>
            <li className="c0 c5 li-bullet-0">
              <span className="c1">
                Escalation rules: when and how calls are transferred to human staff
                or other destinations (including after-hours handling);
              </span>
            </li>
            <li className="c0 c5 li-bullet-0">
              <span className="c1">
                Integration permissions: which systems are connected (including PMS),
                what data fields are accessible, and what actions are permitted; and
              </span>
            </li>
          </ul>
          <p className="c0">
            <span className="c1">
              Content and disclosures: any customer-provided messaging, policies, and
              required notices (including call recording and consent language, where
              applicable).
            </span>
          </p>
          <p className="c0">
            <span className="c1">
              2.6 Customer shall not rely on, apply, or permit the use of Outputs in
              connection with any decision or activity that may produce legal,
              medical, financial, or similarly significant effects on an individual,
              including but not limited to decisions involving healthcare diagnosis or
              treatment, creditworthiness, insurance eligibility, employment,
              education, or any other decisions or actions subject to legal,
              regulatory, or significant risk considerations.
            </span>
          </p>
          <h2 className="c0 c6" id="h.ai-disclosure">
            <span className="c9">3. Artificial Intelligence Disclosure and Transparency</span>
          </h2>
          <p className="c0">
            <span className="c1">
              3.1 Use of Artificial Intelligence. Customer acknowledges that the
              VOICEBOT and VOICEBOT Services utilizes artificial intelligence,
              machine learning, and probabilistic models and does not produce
              deterministic or guaranteed outputs.
            </span>
          </p>
          <p className="c0">
            <span className="c1">
              3.2 AI Identification. VOICEBOT is designed to identify itself as an
              automated or AI-powered system as and when:
            </span>
          </p>
          <ul className="c12 lst-kix_list_2-0 start">
            <li className="c0 c5 li-bullet-0">
              <span className="c1">Required by Applicable Law; or</span>
            </li>
            <li className="c0 c5 li-bullet-0">
              <span className="c1">Asked directly by a caller.</span>
            </li>
          </ul>
          <p className="c0">
            <span className="c1">
              3.3 Caller Awareness. Customer acknowledges that interactions may
              reasonably indicate to callers that they are communicating with an
              automated system.
            </span>
          </p>
          <p className="c0">
            <span className="c1">
              3.4 Any Outputs generated by VOICEBOT or VOICEBOT Services are produced
              through automated processes and do not reflect the opinions, positions,
              or endorsements of the Service Provider. Mentions of third party
              products, services, organizations, or entities are provided solely for
              informational purposes and do not imply sponsorship, partnership, or
              approval.
            </span>
          </p>
          <h2 className="c0 c6" id="h.ai-limitations">
            <span className="c9">4. AI Limitations and Disclaimers</span>
          </h2>
          <p className="c0">
            <span className="c1">4.1 No Guarantee of Accuracy. Customer acknowledges that:</span>
          </p>
          <ul className="c12 lst-kix_list_3-0 start">
            <li className="c0 c5 li-bullet-0">
              <span className="c1">
                VOICEBOT may generate inaccurate, incomplete, or unexpected responses
              </span>
            </li>
            <li className="c0 c5 li-bullet-0">
              <span className="c1">
                VOICEBOT may misunderstand speech, intent, accents, context, or
                caller inputs
              </span>
            </li>
            <li className="c0 c5 li-bullet-0">
              <span className="c1">
                Performance may vary based on call conditions and scenarios
              </span>
            </li>
          </ul>
          <p className="c0">
            <span className="c1">
              4.2 Customer acknowledges that, due to the nature of artificial
              intelligence systems, the VOICEBOT Services may generate responses or
              actions that are similar or identical to those produced for other
              customers, users, or scenarios.
            </span>
          </p>
          <p className="c0">
            <span className="c1">
              4.3 Guardrails and Scripts. While Provider implements configurable
              prompts, logic, and guardrails, Provider does not guarantee that the
              VOICEBOT will always adhere to scripts or constraints.
            </span>
          </p>
          <p className="c0">
            <span className="c1">4.4 Disclaimer of Warranties.</span>
          </p>
          <p className="c0">
            <span className="c1">
              THE VOICEBOT AND VOICEBOT SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND
              &ldquo;AS AVAILABLE&rdquo;, EXCEPT AS EXPRESSLY SET FORTH IN THESE TERMS,
              AND WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY,
              OR OTHERWISE, INCLUDING, WITHOUT LIMITATION, ANY IMPLIED WARRANTIES OF
              TITLE, NON-INFRINGEMENT, MERCHANTABILITY, FITNESS FOR A PARTICULAR
              PURPOSE, ACCURACY, RELIABILITY, COMPLETENESS, OR ANY WARRANTIES IMPLIED
              BY ANY COURSE OF PERFORMANCE, COURSE OF DEALING, OR USAGE OF TRADE, ALL
              OF WHICH ARE EXPRESSLY DISCLAIMED.
            </span>
          </p>
          <p className="c0">
            <span className="c1">
              WITHOUT LIMITING THE FOREGOING, PROVIDER DOES NOT WARRANT THAT THE
              VOICEBOT SERVICES OR ANY VOICEBOT OUTPUTS WILL BE ERROR-FREE,
              UNINTERRUPTED, TIMELY, SECURE, COMPLETE, OR HUMAN-EQUIVALENT, OR THAT
              THE VOICEBOT WILL ACCURATELY UNDERSTAND, INTERPRET, OR CORRECTLY
              PROCESS ALL CALLER INPUTS, SPEECH, ACCENTS, CONTEXT, OR REQUESTS.
            </span>
          </p>
          <p className="c0 c4">
            <span className="c1"></span>
          </p>
          <h2 className="c0 c6" id="h.pms-access">
            <span className="c9">5. PMS and Third Party System Access</span>
          </h2>
          <p className="c0">
            <span className="c1">
              5.1 Authorization at Customer&rsquo;s Risk. Any authorization to
              integrate the VOICEBOT with a PMS or third-party system is granted at
              Customer&rsquo;s sole discretion and risk.
            </span>
          </p>
          <p className="c0">
            <span className="c1">5.2 No Responsibility for PMS Actions. Provider shall not be responsible or liable for:</span>
          </p>
          <ul className="c12 lst-kix_list_4-0 start">
            <li className="c0 c5 li-bullet-0">
              <span className="c1">
                Appointments created, modified, rescheduled, or cancelled by VOICEBOT
              </span>
            </li>
            <li className="c0 c5 li-bullet-0">
              <span className="c1">Data written to or retrieved from the PMS</span>
            </li>
            <li className="c0 c5 li-bullet-0">
              <span className="c1">
                Any operational, financial, clinical, or reputational consequences of
                such actions
              </span>
            </li>
          </ul>
          <p className="c0">
            <span className="c1">5.3 Customer Responsibilities. Customer remains solely responsible for:</span>
          </p>
          <ul className="c12 lst-kix_list_5-0 start">
            <li className="c0 c5 li-bullet-0">
              <span className="c1">Reviewing and auditing PMS data</span>
            </li>
            <li className="c0 c5 li-bullet-0">
              <span className="c1">Verifying appointment accuracy</span>
            </li>
            <li className="c0 c5 li-bullet-0">
              <span className="c1">
                Implementing corrective actions and controls
              </span>
            </li>
          </ul>
          <h2 className="c0 c6" id="h.human-oversight">
            <span className="c9">6. Human Oversight and Operational Responsibility</span>
          </h2>
          <p className="c0">
            <span className="c1">
              6.1 Human Oversight Required. Customer acknowledges that appropriate
              human oversight is required when deploying the VOICEBOT.
            </span>
          </p>
          <p className="c0">
            <span className="c1">6.2 Customer Obligations. Customer shall:</span>
          </p>
          <ul className="c12 lst-kix_list_6-0 start">
            <li className="c0 c5 li-bullet-0">
              <span className="c1">Monitor VOICEBOT activity</span>
            </li>
            <li className="c0 c5 li-bullet-0">
              <span className="c1">
                Manually review call recordings, logs, transcripts, and reports
              </span>
            </li>
            <li className="c0 c5 li-bullet-0">
              <span className="c1">
                Maintain escalation paths to trained human staff
              </span>
            </li>
            <li className="c0 c5 li-bullet-0">
              <span className="c1">
                Restrict VOICEBOT usage solely to appropriate non-clinical use cases
              </span>
            </li>
          </ul>
          <p className="c0">
            <span className="c1">
              6.3 Customer bears sole responsibility for independently reviewing,
              validating, and confirming the accuracy and appropriateness of any
              Outputs prior to acting upon, relying on, distributing, or
              incorporating such Outputs into business operations or communications.
            </span>
          </p>
          <p className="c0">
            <span className="c1">
              6.4 No Provider Liability. Provider shall not be liable for issues
              arising from Customer&rsquo;s failure to provide adequate oversight or
              supervision.
            </span>
          </p>
          <h2 className="c0 c6" id="h.hipaa">
            <span className="c9">7. HIPAA and Healthcare Data Compliance</span>
          </h2>
          <p className="c0">
            <span className="c1">
              7.1 HIPAA Compliance. To the extent the VOICEBOT Services involve PHI,
              the parties shall comply with HIPAA and its implementing regulations.
            </span>
          </p>
          <p className="c0">
            <span className="c1">7.2 Provider Safeguards. Provider shall:</span>
          </p>
          <ul className="c12 lst-kix_list_7-0 start">
            <li className="c0 c5 li-bullet-0">
              <span className="c1">
                Implement reasonable administrative, technical, and physical
                safeguards
              </span>
            </li>
            <li className="c0 c5 li-bullet-0">
              <span className="c1">
                Limit PHI access to the minimum necessary
              </span>
            </li>
            <li className="c0 c5 li-bullet-0">
              <span className="c1">
                Execute a Business Associate Agreement (&ldquo;BAA&rdquo;) upon request
                or where required
              </span>
            </li>
          </ul>
          <p className="c0">
            <span className="c1">7.3 Caller-Provided Information. Customer acknowledges that:</span>
          </p>
          <ul className="c12 lst-kix_list_8-0 start">
            <li className="c0 c5 li-bullet-0">
              <span className="c1">PHI may be verbally disclosed by callers</span>
            </li>
            <li className="c0 c5 li-bullet-0">
              <span className="c1">Data accuracy depends on caller input</span>
            </li>
            <li className="c0 c5 li-bullet-0">
              <span className="c1">
                Provider is not responsible for inaccuracies introduced by callers
              </span>
            </li>
          </ul>
          <p className="c0">
            <span className="c1">
              7.4 Customer remains exclusively responsible for ensuring the lawful
              collection, security, confidentiality, integrity, and permitted use of
              all data, including PHI, that is transmitted, processed, or handled
              through the VOICEBOT Services.
            </span>
          </p>
          <h2 className="c0 c6" id="h.no-medical-advice">
            <span className="c9">8. No Medical, Dental, or Professional Advice</span>
          </h2>
          <p className="c0">
            <span className="c1">
              8.1 No Clinical Advice. VOICEBOT does not provide medical, dental,
              legal, or professional advice, diagnoses, or treatment
              recommendations.
            </span>
          </p>
          <p className="c0">
            <span className="c1">
              8.2 Informational Use Only. Any information provided is administrative
              or general in nature.
            </span>
          </p>
          <p className="c0">
            <span className="c1">
              8.3 Clinical Routing. Customer is solely responsible for ensuring that
              clinical or professional inquiries are routed to qualified personnel.
            </span>
          </p>
          <h2 className="c0 c6" id="h.regulatory">
            <span className="c9">9. Regulatory, TCPA, and Consent Compliance</span>
          </h2>
          <p className="c0">
            <span className="c1">9.1 Customer Compliance Responsibility. Customer is solely responsible for ensuring compliance with:</span>
          </p>
          <ul className="c12 lst-kix_list_9-0 start">
            <li className="c0 c5 li-bullet-0">
              <span className="c1">
                Telephone Consumer Protection Act (TCPA)
              </span>
            </li>
            <li className="c0 c5 li-bullet-0">
              <span className="c1">FCC regulations</span>
            </li>
            <li className="c0 c5 li-bullet-0">
              <span className="c1">
                Applicable Call recording and consent laws
              </span>
            </li>
            <li className="c0 c5 li-bullet-0">
              <span className="c1">
                Applicable State privacy and consumer protection laws
              </span>
            </li>
            <li className="c0 c5 li-bullet-0">
              <span className="c1">
                Applicable Professional licensing and board regulations
              </span>
            </li>
          </ul>
          <p className="c0">
            <span className="c1">9.2 Consent Management. Customer represents and warrants that it has obtained or will obtain all lawfully required:</span>
          </p>
          <ul className="c12 lst-kix_list_10-0 start">
            <li className="c0 c5 li-bullet-0">
              <span className="c1">Call, text, and voicemail consents</span>
            </li>
            <li className="c0 c5 li-bullet-0">
              <span className="c1">Recording and monitoring disclosures</span>
            </li>
            <li className="c0 c5 li-bullet-0">
              <span className="c1">AI interaction disclosures</span>
            </li>
          </ul>
          <p className="c0">
            <span className="c1">
              9.3 No Legal Advice. Provider does not provide legal or regulatory
              compliance advice.
            </span>
          </p>
          <h2 className="c0 c6" id="h.data-use">
            <span className="c9">10. Data Use, Recording, and Model Improvement</span>
          </h2>
          <p className="c0">
            <span className="c1">
              10.1 Customer understands and agrees that calls and interactions
              involving the VOICEBOT Services may be recorded, monitored, and stored
              for purposes including service delivery, quality assurance, system
              optimization, troubleshooting, and training, subject to Applicable Law
              and required consents.
            </span>
          </p>
          <p className="c0">
            <span className="c1">
              10.2 Service Operation. Provider may process call metadata, transcripts,
              and interaction data as necessary to provide and support the VOICEBOT
              Services.
            </span>
          </p>
          <p className="c0">
            <span className="c1">
              10.3 Customer grants Provider a non exclusive right to utilize
              interaction data, call content, transcripts, and related materials in
              anonymized and aggregated form, in compliance with Applicable Law and
              HIPAA de-identification standards, for purposes including enhancing
              system performance, improving AI models, developing new features,
              conducting analytics, and refining speech recognition and language
              processing capabilities.
            </span>
          </p>
          <p className="c0">
            <span className="c1">
              10.4 De-Identification. Provider may use de-identified and aggregated
              data to improve system performance, analytics, and reliability.
            </span>
          </p>
          <p className="c0">
            <span className="c1">
              10.5 No Sale of PHI. Provider does not sell PHI or use PHI for
              advertising purposes.
            </span>
          </p>
          <p className="c0">
            <span className="c1">
              10.6 Customer is solely responsible for determining and fulfilling any
              legal, regulatory, or operational requirements related to the retention,
              archiving, or production of call recordings, transcripts, or interaction
              records. Provider has no duty to preserve, store, or make such records
              available unless expressly agreed in writing.
            </span>
          </p>
          <h2 className="c0 c6" id="h.limitation-liability">
            <span className="c9">11. Limitation of Liability</span>
          </h2>
          <p className="c0">
            <span className="c1">
              11.1 To the maximum extent permitted by law, except for the
              parties&rsquo; indemnification obligations, in no event shall Provider,
              nor its directors, officers, employees, agents, partners, suppliers, or
              content providers, be liable under contract, tort, strict liability,
              negligence, or any other legal or equitable theory for any lost
              profits, loss of revenue, loss of data, cost of procurement of
              substitute goods or services, or any special, indirect, incidental,
              consequential, exemplary, or punitive damages of any kind whatsoever,
              whether arising out of or related to the VOICEBOT Services, including
              without limitation VOICEBOT AI Outputs, automated or outbound calls,
              misinterpretations of caller intent, transcription errors, scheduling
              errors, system downtime, model errors, integration failures, or other
              system or AI-related errors, regardless of whether such damages were
              foreseeable or whether Provider has been advised of the possibility of
              such damages.
            </span>
          </p>
          <p className="c0">
            <span className="c1">
              Without limiting the foregoing, Provider shall have no liability for any
              damages arising from bugs, defects, viruses, trojan horses, model
              hallucinations, harmful code, corrupted data, or other harmful
              components, regardless of the source of origination.
            </span>
          </p>
          <p className="c0 c4">
            <span className="c1"></span>
          </p>
          <p className="c0">
            <span className="c1">
              11.2 To the maximum extent permitted by law, except for the
              parties&rsquo; indemnification obligations, Provider&rsquo;s total
              cumulative liability for any and all claims arising out of or relating
              to the VOICEBOT Services or these Terms, whether in contract, tort,
              strict liability, negligence, or otherwise, shall not exceed, in the
              aggregate, the fees paid or payable by Customer for the VOICEBOT
              Services during the twelve (12) months immediately preceding the event
              giving rise to the claim.
            </span>
          </p>
          <h2 className="c0 c6" id="h.indemnification">
            <span className="c9">12. Indemnification by Customer</span>
          </h2>
          <p className="c0">
            <span className="c1">
              Customer agrees to indemnify, defend, and hold harmless Provider from
              and against any claims, damages, fines, penalties, or expenses arising
              out of:
            </span>
          </p>
          <ul className="c12 lst-kix_list_12-0 start">
            <li className="c0 c5 li-bullet-0">
              <span className="c1">
                Customer&rsquo;s or it&rsquo;s end users use or misuse of VOICEBOT
                service. Any use or misuse of VOICEBOT service by Customer or
                it&rsquo;s end users , including but not limited to incorrect
                scheduling , rescheduling or cancellation of appointments, or reliance
                on the service for purposes beyond its intended scope, including but
                not limited to seeking clinical or medical advice.
              </span>
            </li>
            <li className="c0 c5 li-bullet-0">
              <span className="c1">
                Reliance on Outputs. Any reliance by Customer or its end users on
                outputs, responses or information provided by VOICEBOT, including
                errors or inaccuracies in appointment details, reminders or other non
                clinical information.
              </span>
            </li>
            <li className="c0 c5 li-bullet-0">
              <span className="c1">
                PMS or third-party system errors. Errors, failures or malfunctions in
                Customers Practice Management System, third party systems or
                integration that impact the functioning of VOICEBOT or lead to
                scheduling conflicts, missed appointments or data discrepancies.
              </span>
            </li>
            <li className="c0 c5 li-bullet-0">
              <span className="c1">
                Failure to obtain required consents. Customer&rsquo;s failure to
                obtain all necessary consents, authorizations or permission from
                patients or end users for the collection, processing and use of
                personal data in connection with VOICEBOT service.
              </span>
            </li>
            <li className="c0 c5 li-bullet-0">
              <span className="c1">
                Failure to provide human oversight. Customers failure to implement
                appropriate human oversight and review of outputs generated by
                VOICEBOT, particularly where such oversight is necessary to prevent
                errors in scheduling or compliance breaches.
              </span>
            </li>
            <li className="c0 c5 li-bullet-0">
              <span className="c1">
                Violations of Applicable Law. Any violation of applicable laws,
                regulations or professional standards by Customers or its end users,
                including but not limited to data protection laws
              </span>
            </li>
            <li className="c0 c5 li-bullet-0">
              <span className="c1">
                Inaccurate, incomplete, or unlawful information provided by Customer
                or its end users
              </span>
            </li>
          </ul>
          <h2 className="c0 c6" id="h.service-evolution">
            <span className="c9">13. Service Evolution and Changes</span>
          </h2>
          <p className="c0">
            <span className="c1">
              13.1 Evolving Technology. Customer acknowledges that AI technologies
              evolve rapidly.
            </span>
          </p>
          <p className="c0">
            <span className="c1">
              13.2 Updates. Provider may modify, update, or enhance the VOICEBOT
              Services.
            </span>
          </p>
          <p className="c0">
            <span className="c1">
              13.3 No Guarantee of Consistency. Behaviour, responses, and performance
              may change over time.
            </span>
          </p>
          <h2 className="c0 c6" id="h.acceptance-risk">
            <span className="c9">14. Acceptance of AI Risk</span>
          </h2>
          <p className="c0">
            <span className="c1">
              By enabling or using the VOICEBOT Services, Customer expressly
              acknowledges, understands &nbsp;and agrees that:
            </span>
          </p>
          <ul className="c12 lst-kix_list_13-0 start">
            <li className="c0 c5 li-bullet-0">
              <span className="c1">The probabilistic nature of AI:</span>
            </li>
          </ul>
          <p className="c0 c11">
            <span className="c1">
              VOICEBOT services utilizes artificial intelligence and machine learning
              technologies that operate on probabilistic models. As such, outputs are
              generated based on patterns and predictions, not certainties. The
              service may not always produce accurate, complete or contextually
              appropriate responses.
            </span>
          </p>
          <ul className="c12 lst-kix_list_13-0">
            <li className="c0 c5 li-bullet-0">
              <span className="c1">The possibility of errors or unintended outcomes: </span>
            </li>
          </ul>
          <p className="c0 c11">
            <span className="c1">
              Due to inherent limitations of AI systems, the Services may occasionally
              provide incorrect, incomplete or unintended outputs, including but not
              limited to scheduling errors, misinterpretation of users input, or
              failure to process certain requests. Customer assumes full responsibility
              for reviewing and validating all outputs before acting upon them.
            </span>
          </p>
          <ul className="c12 lst-kix_list_13-0">
            <li className="c0 c5 li-bullet-0">
              <span className="c1">That Outputs do not equal human judgment:</span>
            </li>
          </ul>
          <p className="c0 c11">
            <span className="c1">
              The service provided does not replace professional judgment, human
              decision making, or clinical expertise. Customer must ensure that human
              oversight is applied where necessary and that no reliance is placed on
              the Service for medical, diagnostic, or treatment advice.
            </span>
          </p>
          <h2 className="c0 c6" id="h.governing-law">
            <span className="c9">15. Governing Law and Venue</span>
          </h2>
          <p className="c0">
            <span className="c1">
              These Terms shall be governed by and construed in accordance with the
              laws of the State of Florida, without regard to its conflict of laws
              principles. Any legal action or proceeding arising out of or relating
              to these Terms shall be brought exclusively in the State or Federal
              Courts of competent jurisdiction located within the State of Florida,
              and the parties hereby consent to the personal jurisdiction and venue
              of such courts.
            </span>
          </p>
          <h2 className="c0 c6" id="h.severability">
            <span className="c9">16. Severability</span>
          </h2>
          <p className="c0">
            <span className="c1">
              If any provision of these Terms is held to be invalid, illegal, or
              unenforceable by a court of competent jurisdiction, such provision shall
              be enforced to the maximum extent permissible so as to effect the intent
              of the parties, and the remaining provisions of these Terms shall
              remain in full force and effect and shall not be affected or impaired
              in any way. In the event that any such invalid, illegal, or
              unenforceable provision cannot be enforced as written, the parties
              agree that such provision shall be modified or replaced with a valid and
              enforceable provision that most closely reflects the original intent and
              economic effect of the invalid provision.
            </span>
          </p>
          <h2 className="c0 c6" id="h.survival">
            <span className="c9">17. Survival</span>
          </h2>
          <p className="c0">
            <span className="c1">
              Sections relating to limitations of liability, indemnification, HIPAA,
              disclaimers, data use, AI training rights, acceptance of risk, and
              governing law shall survive termination or expiration of the Agreement.
            </span>
          </p>
          <p className="c0 c4">
            <span className="c1"></span>
          </p>
        </div>
      </Section>
    </div>
  )
}
export default Terms
