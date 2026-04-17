export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold font-outfit text-charcoal-900 mb-4">
          Terms of Service
        </h1>
        <p className="text-stone-500 mb-8 font-inter">
          DRAFT — Pending lawyer review
        </p>

        <div className="space-y-6 text-stone-600 font-inter text-sm">
          <section>
            <h2 className="text-xl font-outfit font-semibold text-charcoal-900 mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By using Enhancr, you agree to these terms and conditions. If you
              do not agree, do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-outfit font-semibold text-charcoal-900 mb-3">
              2. User Accounts
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials. You agree to accept responsibility for all
              activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-outfit font-semibold text-charcoal-900 mb-3">
              3. Prohibited Uses
            </h2>
            <p>
              You may not use Enhancr to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Remove watermarks or copyright notices</li>
              <li>Create deceptive images of real people</li>
              <li>Violate any applicable laws</li>
              <li>Interfere with service operation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-outfit font-semibold text-charcoal-900 mb-3">
              4. Limitation of Liability
            </h2>
            <p>
              Enhancr is provided &quot;as is&quot; without warranties. We are not liable
              for indirect or consequential damages arising from your use of the
              service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-outfit font-semibold text-charcoal-900 mb-3">
              5. Modifications
            </h2>
            <p>
              We may modify these terms at any time. Changes take effect when
              posted. Continued use constitutes acceptance.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
