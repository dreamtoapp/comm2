export default function AddProductLoading() {
  return (
    <div className="animate-pulse space-y-4 rounded-xl border border-border bg-gradient-to-br from-background to-muted/60 p-4 shadow-xl">
      {/* Skeleton for SupplierSelect or general header */}
      <div className="mb-4">
        <div className="mb-1 h-4 w-1/4 rounded bg-muted"></div>
        <div className="h-10 w-full rounded bg-muted"></div>
      </div>

      <div className="space-y-6">
        {/* Skeleton for Section 1: Basic Information */}
        <div className="rounded-lg bg-card p-6 shadow-md">
          <div className="mb-6 h-6 w-1/3 rounded bg-muted"></div> {/* Section Title */}
          <div className="flex flex-col justify-start gap-6 md:flex-row">
            <div className="flex flex-1 flex-col items-center justify-center gap-2 md:items-start">
              {/* Skeleton for ImageUpload */}
              <div className="h-48 w-48 rounded-md bg-muted"></div>
              <div className="mt-2 h-8 w-full rounded bg-muted"></div> {/* Upload button placeholder */}
            </div>
            <div className="mx-auto flex w-full max-w-2xl flex-[2] flex-col gap-4">
              {/* Skeleton for InputFields */}
              <div className="mb-1 h-4 w-1/4 rounded bg-muted"></div>
              <div className="h-10 w-full rounded bg-muted"></div>
              <div className="mb-1 mt-2 h-4 w-1/4 rounded bg-muted"></div>
              <div className="h-10 w-full rounded bg-muted"></div>
              <div className="mb-1 mt-2 h-4 w-1/4 rounded bg-muted"></div>
              <div className="h-10 w-full rounded bg-muted"></div>
              {/* Skeleton for TextareaField */}
              <div className="mb-1 mt-2 h-4 w-1/4 rounded bg-muted"></div>
              <div className="h-20 w-full rounded bg-muted"></div>
            </div>
          </div>
        </div>

        {/* Skeleton for Section 1.b: Product Gallery (Optional) */}
        <div className="rounded-lg bg-card p-6 shadow-md">
          <div className="mb-6 h-6 w-1/2 rounded bg-muted"></div> {/* Section Title */}
          <div className="h-32 w-full rounded-md bg-muted"></div> {/* Gallery placeholder */}
        </div>

        {/* Skeleton for Section 2: Categories */}
        <div className="rounded-lg bg-card p-6 shadow-md">
          <div className="mb-6 h-6 w-1/3 rounded bg-muted"></div> {/* Section Title */}
          <div className="mb-2 h-4 w-1/2 rounded bg-muted"></div> {/* Label */}
          <div className="max-h-60 space-y-2 overflow-y-auto rounded-md border bg-input/10 p-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-2 space-x-reverse">
                <div className="h-5 w-5 rounded bg-muted"></div>
                <div className="h-4 w-1/3 rounded bg-muted"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Skeleton for Section 3: Specifications (Simplified) */}
        <div className="rounded-lg bg-card p-6 shadow-md">
          <div className="mb-6 h-6 w-1/3 rounded bg-muted"></div> {/* Section Title */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1">
                <div className="h-4 w-1/3 rounded bg-muted"></div>
                <div className="h-10 w-full rounded bg-muted"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Skeleton for Section 4: Inventory (Simplified) */}
        <div className="rounded-lg bg-card p-6 shadow-md">
          <div className="mb-6 h-6 w-1/3 rounded bg-muted"></div> {/* Section Title */}
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center space-x-2 space-x-reverse">
                <div className="h-5 w-5 rounded bg-muted"></div>
                <div className="h-4 w-2/5 rounded bg-muted"></div>
              </div>
            ))}
            <div className="space-y-1 pt-2">
              <div className="h-4 w-1/3 rounded bg-muted"></div>
              <div className="h-10 w-1/2 rounded bg-muted"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Skeleton for Submit Button */}
      <div className="flex justify-end gap-2 pt-2">
        <div className="h-10 w-36 rounded bg-muted"></div>
      </div>
    </div>
  );
}
