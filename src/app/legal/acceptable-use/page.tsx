export default function AcceptableUsePage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold font-outfit text-charcoal-900 mb-4">
          Acceptable Use Policy
        </h1>
        <p className="text-stone-500 mb-8 font-inter">
          DRAFT — Pending lawyer review
        </p>

        <div className="space-y-6 text-stone-600 font-inter text-sm">
          <section>
            <h2 className="text-xl font-outfit font-semibold text-charcoal-900 mb-3">
              1. Prohibited Content
            </h2>
            <p>
              You agree not to upload or edit photos that:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Contain child sexual abuse material</li>
              <li>Violate intellectual property rights</li>
              <li>Contain illegal content</li>
              <li>Are defamatory or harassing</li>
              <li>Violate privacy of others without consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-outfit font-semibold text-charcoal-900 mb-3">
              2. Watermark Removal
            </h2>
            <p>
              You may not use Enhancr to remove watermarks, signatures, or
              copyright notices from photos you do not own.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-outfit font-semibold text-charcoal-900 mb-3">
              3. Deceptive Use
            </h2>
            <p>
              You agree not to create manipulated images intended to deceive
              others about the identity of people shown.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-outfit font-semibold text-charcoal-900 mb-3">
              4. Commercial Unauthorized Use
            </h2>
            <p>
              You may not edit or sell photos without owning the rights to them.
              This applies to stock photos, found images, and others&apos; work.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-outfit font-semibold text-charcoal-900 mb-3">
              5. Enforcement
            </h2>
            <p>
              Violations may result in account suspension, content removal, or
              legal action.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
