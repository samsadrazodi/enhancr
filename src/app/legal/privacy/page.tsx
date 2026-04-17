export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold font-outfit text-charcoal-900 mb-4">
          Privacy Policy
        </h1>
        <p className="text-stone-500 mb-8 font-inter">
          DRAFT — Pending lawyer review
        </p>

        <div className="space-y-6 text-stone-600 font-inter text-sm">
          <section>
            <h2 className="text-xl font-outfit font-semibold text-charcoal-900 mb-3">
              1. Information We Collect
            </h2>
            <p>
              We collect email, account preferences, and usage data. We do not
              train on your photos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-outfit font-semibold text-charcoal-900 mb-3">
              2. How We Use Information
            </h2>
            <p>
              We use information to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Operate and improve the service</li>
              <li>Communicate with you</li>
              <li>Enforce our terms</li>
              <li>Comply with law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-outfit font-semibold text-charcoal-900 mb-3">
              3. Photo Data
            </h2>
            <p>
              Photos you upload are processed to generate edits. Photos are not
              stored after processing unless you explicitly save them to your
              account. We do not train on your photos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-outfit font-semibold text-charcoal-900 mb-3">
              4. Third-Party Services
            </h2>
            <p>
              We use Supabase for authentication and storage, and Google Gemini
              for image processing. These services have their own privacy
              policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-outfit font-semibold text-charcoal-900 mb-3">
              5. Your Rights
            </h2>
            <p>
              You can request access to, correction of, or deletion of your
              personal data.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
