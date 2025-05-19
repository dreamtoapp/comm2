import React from 'react';
import BackButton from '@/components/BackButton';
import { Button } from '@/components/ui/button';

const PIXEL_PLATFORMS = [
	{ id: 'google-analytics', label: 'Google Analytics' },
	{ id: 'facebook-pixel', label: 'Facebook Pixel' },
	{ id: 'tiktok-pixel', label: 'TikTok Pixel' },
	{ id: 'snapchat-pixel', label: 'Snapchat Pixel' },
	{ id: 'pinterest-tag', label: 'Pinterest Tag' },
	{ id: 'linkedin-insight', label: 'LinkedIn Insight' },
];

export default function PixelsAndAnalyticsPage() {
	const [active, setActive] = React.useState('google-analytics');
	React.useEffect(() => {
		const onHashChange = () => {
			setActive(window.location.hash.replace('#', '') || 'google-analytics');
		};
		window.addEventListener('hashchange', onHashChange);
		onHashChange();
		return () => window.removeEventListener('hashchange', onHashChange);
	}, []);

	return (
		<div className="max-w-2xl mx-auto p-6">
			<BackButton />
			<h1 className="text-2xl font-bold mb-4 text-primary">
				إعداد وربط البيكسل والتحليلات
			</h1>
			<p className="mb-6 text-muted-foreground">
				أدخل معلومات التتبع الخاصة بك لكل منصة أدناه. جميع الحقول اختيارية ويمكنك
				تفعيل أو تعطيل أي منصة حسب الحاجة.
			</p>
			{/* Modern pill-style horizontal nav bar */}
			<nav
				className="flex gap-2 mb-8 overflow-x-auto pb-2 rtl:flex-row-reverse"
				aria-label="Pixel platforms navigation"
			>
				{PIXEL_PLATFORMS.map((platform) => (
					<a
						key={platform.id}
						href={`#${platform.id}`}
						tabIndex={0}
						className="focus:outline-none"
						onClick={() => setActive(platform.id)}
					>
						<Button
							variant={active === platform.id ? 'default' : 'outline'}
							className={`rounded-full px-4 py-1 text-sm font-medium transition-all ${
								active === platform.id
									? 'bg-primary text-primary-foreground shadow'
									: ''
							}`}
							aria-current={
								active === platform.id ? 'page' : undefined
							}
						>
							{platform.label}
						</Button>
					</a>
				))}
			</nav>
			<form className="space-y-6">
				<div id="google-analytics">
					<label
						htmlFor="googleAnalytics"
						className="block font-medium mb-1"
					>
						Google Analytics Measurement ID
					</label>
					<input
						id="googleAnalytics"
						name="googleAnalytics"
						type="text"
						className="w-full border rounded px-3 py-2"
						placeholder="G-XXXXXXXXXX"
					/>
					<div className="mt-1 text-xs text-muted-foreground">
						<a
							href="https://support.google.com/analytics/answer/9539598?hl=ar"
							target="_blank"
							rel="noopener noreferrer"
							className="underline hover:text-primary transition"
						>
							شرح ربط Google Analytics (رابط رسمي)
						</a>
					</div>
				</div>
				<div id="facebook-pixel">
					<label htmlFor="facebookPixel" className="block font-medium mb-1">
						Facebook Pixel ID
					</label>
					<input
						id="facebookPixel"
						name="facebookPixel"
						type="text"
						className="w-full border rounded px-3 py-2"
						placeholder="123456789012345"
					/>
					<div className="mt-1 text-xs text-muted-foreground">
						<a
							href="https://www.facebook.com/business/help/952192354843755"
							target="_blank"
							rel="noopener noreferrer"
							className="underline hover:text-primary transition"
						>
							شرح ربط Facebook Pixel (رابط رسمي)
						</a>
					</div>
				</div>
				<div id="tiktok-pixel">
					<label htmlFor="tiktokPixel" className="block font-medium mb-1">
						TikTok Pixel ID
					</label>
					<input
						id="tiktokPixel"
						name="tiktokPixel"
						type="text"
						className="w-full border rounded px-3 py-2"
						placeholder="XXXXXXXXXX"
					/>
					<div className="mt-1 text-xs text-muted-foreground">
						<a
							href="https://ads.tiktok.com/help/article?aid=100006276"
							target="_blank"
							rel="noopener noreferrer"
							className="underline hover:text-primary transition"
						>
							شرح ربط TikTok Pixel (رابط رسمي)
						</a>
					</div>
				</div>
				<div id="snapchat-pixel">
					<label htmlFor="snapchatPixel" className="block font-medium mb-1">
						Snapchat Pixel ID
					</label>
					<input
						id="snapchatPixel"
						name="snapchatPixel"
						type="text"
						className="w-full border rounded px-3 py-2"
						placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
					/>
					<div className="mt-1 text-xs text-muted-foreground">
						<a
							href="https://businesshelp.snapchat.com/s/article/pixel-setup"
							target="_blank"
							rel="noopener noreferrer"
							className="underline hover:text-primary transition"
						>
							شرح ربط Snapchat Pixel (رابط رسمي)
						</a>
					</div>
				</div>
				<div id="pinterest-tag">
					<label htmlFor="pinterestTag" className="block font-medium mb-1">
						Pinterest Tag ID
					</label>
					<input
						id="pinterestTag"
						name="pinterestTag"
						type="text"
						className="w-full border rounded px-3 py-2"
						placeholder="XXXXXXXXXX"
					/>
					<div className="mt-1 text-xs text-muted-foreground">
						<a
							href="https://help.pinterest.com/en/business/article/set-up-the-pinterest-tag"
							target="_blank"
							rel="noopener noreferrer"
							className="underline hover:text-primary transition"
						>
							شرح ربط Pinterest Tag (رابط رسمي)
						</a>
					</div>
				</div>
				<div id="linkedin-insight">
					<label htmlFor="linkedinInsight" className="block font-medium mb-1">
						LinkedIn Insight Tag ID
					</label>
					<input
						id="linkedinInsight"
						name="linkedinInsight"
						type="text"
						className="w-full border rounded px-3 py-2"
						placeholder="XXXXXXXXXX"
					/>
					<div className="mt-1 text-xs text-muted-foreground">
						<a
							href="https://www.linkedin.com/help/lms/answer/a427660"
							target="_blank"
							rel="noopener noreferrer"
							className="underline hover:text-primary transition"
						>
							شرح ربط LinkedIn Insight (رابط رسمي)
						</a>
					</div>
				</div>
				{/* You can add save logic and validation as needed */}
				<Button type="submit" className="w-full">
					حفظ الإعدادات
				</Button>
			</form>
			<div className="mt-8 text-xs text-muted-foreground">
				<b>المنصات المدعومة:</b> Google Analytics, Facebook Pixel, TikTok Pixel,
				Snapchat Pixel, Pinterest Tag, LinkedIn Insight.
			</div>
		</div>
	);
}