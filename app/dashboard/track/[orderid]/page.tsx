import BackButton from '../../../../components/BackButton';
import { fetchTrackInfo } from '../action/action';

export default async function Page({ params }: { params: Promise<{ orderid: string }> }) {
  const { orderid } = await params;
  const trackInfo = await fetchTrackInfo(orderid);

  // Fallback coordinates if none provided
  const latitude = trackInfo?.latitude || 0;
  const longitude = trackInfo?.longitude || 0;

  // Construct Google Maps URL without API key
  const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`;

  if (!trackInfo) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center p-6">
        <div className="mx-auto max-w-lg w-full rounded-xl bg-card shadow-2xl border border-border flex flex-col items-center p-10 gap-6">
          <div className="flex flex-col items-center gap-2">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-warning animate-pulse">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
            </svg>
            <h2 className="text-xl font-bold text-warning text-center">لم يبدأ السائق الرحلة بعد</h2>
            <p className="text-muted-foreground text-center">سيتم عرض تفاصيل التتبع هنا بمجرد بدء السائق الرحلة.</p>
          </div>
          <BackButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background p-6">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-xl bg-card shadow-2xl border border-border">
        {/* Header Section */}
        <div className="flex items-center justify-between bg-primary p-5 text-primary-foreground shadow">
          <h1 className="text-lg font-bold tracking-wide">
            رقم الطلبية: <span  >{trackInfo?.order.orderNumber || 'غير متوفر'}</span>
          </h1>
          <BackButton />
        </div>

        {/* Order Details */}
        <div className="space-y-6 p-6">
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted p-4 border border-border">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">اسم العميل</span>
              <span className="font-semibold text-foreground">
                {trackInfo?.order.customerName || 'غير محدد'}
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-xs text-muted-foreground font-medium">الإجمالي</span>
              <span className="font-semibold text-success">
                {trackInfo?.order.amount ? `${trackInfo.order.amount} ريال` : 'غير محدد'}
              </span>
            </div>
          </div>

          <div className="flex flex-col rounded-lg bg-success/10 p-4 border border-success/20">
            <span className="text-xs text-success font-medium">اسم السائق</span>
            <span className="font-semibold text-success">
              {trackInfo?.driver.name || 'غير معين'}
            </span>
          </div>
        </div>

        {/* Map Section */}
        <div className="p-6 pt-0">
          <h2 className="mb-3 font-bold text-primary">موقع التوصيل</h2>
          {latitude !== 0 && longitude !== 0 ? (
            <div className="relative h-96 w-full overflow-hidden rounded-lg border-2 border-border shadow-lg">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={mapUrl}
                title="Delivery Location"
              />
            </div>
          ) : (
            <div className="flex h-96 w-full items-center justify-center rounded-lg bg-muted border-2 border-border">
              <p className="text-center text-muted-foreground">الموقع غير متوفر</p>
            </div>
          )}
          <div className="mt-3 text-center">
            <p className="text-sm text-muted-foreground">
              الإحداثيات:{' '}
              <span className="font-bold text-foreground">
                {latitude !== 0 || longitude !== 0
                  ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                  : 'غير متوفرة'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
