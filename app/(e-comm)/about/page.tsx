import { Truck, Star, MapPin, Droplet, ShieldCheck, Award, User } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Import CVA variants
import Link from '@/components/link';

import { generatePageMetadata } from '../../../lib/seo-utils';

// app/about-us/page.tsx

export async function generateMetadata() {
  return generatePageMetadata('about-us');
}

const AboutUs = () => {
  const testimonials = [
    {
      name: 'محمد العتيبي',
      text: 'مياه أمواج غيرت تجربتي اليومية! نقاء لا مثيل له وخدمة توصيل لا تتأخر أبدًا.',
      rating: 5,
      avatarColor: 'bg-blue-500',
    },
    {
      name: 'سارة القحطاني',
      text: 'أفضل خيار للمياه النقية! الجودة ممتازة والتوصيل دائمًا في الموعد.',
      rating: 4.5,
      avatarColor: 'bg-green-500',
    },
    {
      name: 'أحمد السعدي',
      text: 'مذاق رائع وخدمة عملاء ودودة جدًا، أمواج فعلاً تستحق الثقة!',
      rating: 5,
      avatarColor: 'bg-yellow-500',
    },
    {
      name: 'نورة المالكي',
      text: 'لا أستطيع العيش بدون أمواج الآن! التوصيل السريع والنقاء المثالي يبهراني.',
      rating: 5,
      avatarColor: 'bg-purple-500',
    },
    {
      name: 'فيصل الدوسري',
      text: 'جودة مضمونة في كل قطرة، أشعر بالفرق منذ اليوم الأول!',
      rating: 4.8,
      avatarColor: 'bg-red-500',
    },
  ];

  return (
    <div className='container mx-auto bg-gray-50 px-6 py-16'>
      {/* Hero Section */}
      <div className='flex animate-fade-in flex-col items-center justify-center gap-8 text-center'>
        <h1 className='text-5xl font-extrabold leading-tight text-blue-600 md:text-5xl'>
          من نحن | أمواج – مياه نقية لحياة صحية 💧
        </h1>
        <p className='mx-auto mt-6 max-w-3xl text-xl text-gray-700 md:text-2xl'>
          نحن في أمواج نؤمن أن الماء ليس مجرد حاجة، بل هو أساس الحياة الصحية. نقدم لكم مياهًا نقية
          بأعلى معايير الجودة العالمية، مع تقنيات تنقية متطورة لضمان النقاء والانتعاش كل يوم.
        </p>

        <Link
          href={'/'}
          className='rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground transition duration-300 hover:bg-secondary hover:text-secondary-foreground'
        >
          تواصلوا معنا الآن
        </Link>
      </div>

      {/* Mission Statement */}
      <div className='mt-16 rounded-xl bg-blue-100 p-8 text-center'>
        <h2 className='text-3xl font-bold text-blue-800'>رسالتنا</h2>
        <p className='mx-auto mt-4 max-w-2xl text-lg text-gray-600'>
          نسعى لتوفير مياه شرب نقية وصحية لكل منزل ومكتب في المملكة، مع الالتزام بالاستدامة البيئية
          والجودة العالمية، لنكون جزءًا من حياة صحية ومستدامة لمجتمعنا.
        </p>
      </div>

      {/* Why Choose Us Section */}
      <div className='mt-16'>
        <h2 className='mb-10 text-center text-4xl font-semibold text-blue-600'>
          لماذا تختار أمواج؟
        </h2>
        <div className='grid gap-8 md:grid-cols-3'>
          <div className='flex flex-col items-center rounded-lg bg-white p-6 shadow-xl transition duration-300 hover:scale-105'>
            <Truck className={iconVariants({ size: 'lg', className: 'text-blue-500' })} /> {/* Use direct import + CVA */}
            <h3 className='mt-4 text-xl font-semibold text-gray-800'>توصيل فوري</h3>
            <p className='mt-2 text-center text-gray-600'>
              أسطولنا الحديث يصلك أينما كنت، بسرعة وكفاءة، لضمان راحتك دائمًا.
            </p>
          </div>
          <div className='flex flex-col items-center rounded-lg bg-white p-6 shadow-xl transition duration-300 hover:scale-105'>
            <Star className={iconVariants({ size: 'lg', className: 'text-blue-500' })} /> {/* Use direct import + CVA */}
            <h3 className='mt-4 text-xl font-semibold text-gray-800'>جودة لا تضاهى</h3>
            <p className='mt-2 text-center text-gray-600'>
              مياهنا معتمدة عالميًا، مفلترة بتقنيات متطورة لنقاء لا مثيل له.
            </p>
          </div>
          <div className='flex flex-col items-center rounded-lg bg-white p-6 shadow-xl transition duration-300 hover:scale-105'>
            <MapPin className={iconVariants({ size: 'lg', className: 'text-blue-500' })} /> {/* Use direct import + CVA */}
            <h3 className='mt-4 text-xl font-semibold text-gray-800'>تغطية شاملة</h3>
            <p className='mt-2 text-center text-gray-600'>
              فروعنا منتشرة لنكون دائمًا بالقرب منك، جاهزون لخدمتك في أي وقت.
            </p>
          </div>
        </div>
      </div>

      {/* Additional Benefits */}
      <div className='mt-16'>
        <div className='grid gap-8 md:grid-cols-3'>
          <div className='rounded-lg bg-white p-6 shadow-xl transition duration-300 hover:shadow-2xl'>
            <Droplet className={iconVariants({ size: 'lg', className: 'mx-auto text-blue-500' })} /> {/* Use direct import + CVA */}
            <h3 className='mt-4 text-center text-xl font-semibold text-gray-800'>تركيبة صحية</h3>
            <p className='mt-2 text-center text-gray-600'>
              مياه غنية بالمعادن الأساسية لدعم صحتك ونشاطك اليومي.
            </p>
          </div>
          <div className='rounded-lg bg-white p-6 shadow-xl transition duration-300 hover:shadow-2xl'>
            <ShieldCheck className={iconVariants({ size: 'lg', className: 'mx-auto text-blue-500' })} /> {/* Use direct import + CVA */}
            <h3 className='mt-4 text-center text-xl font-semibold text-gray-800'>أمان مضمون</h3>
            <p className='mt-2 text-center text-gray-600'>
              اختبارات جودة يومية لضمان سلامتك وراحة بالك.
            </p>
          </div>
          <div className='rounded-lg bg-white p-6 shadow-xl transition duration-300 hover:shadow-2xl'>
            <Award className={iconVariants({ size: 'lg', className: 'mx-auto text-blue-500' })} /> {/* Use direct import + CVA */}
            <h3 className='mt-4 text-center text-xl font-semibold text-gray-800'>ثقة وتميز</h3>
            <p className='mt-2 text-center text-gray-600'>
              نفخر بخدمة آلاف العملاء بجودة وثقة لا تتزعزع.
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Smooth Testimonials Section */}
      <div className='mt-16'>
        <h2 className='mb-10 text-center text-4xl font-semibold text-blue-600'>
          ماذا يقول عملاؤنا؟
        </h2>
        <div className='relative overflow-hidden py-4'>
          <div className='animate-seamless-marquee flex'>
            {[...testimonials, ...testimonials].map((review, index) => (
              <div
                key={index}
                className='mx-3 w-80 flex-shrink-0 rounded-lg bg-white p-6 shadow-lg transition duration-300 hover:shadow-2xl'
              >
                <div className='mb-4 flex items-center'>
                  <div
                    className={`h-12 w-12 rounded-full ${review.avatarColor} flex items-center justify-center`}
                  >
                    <User className={iconVariants({ size: 'sm', className: 'text-white' })} /> {/* Use direct import + CVA */}
                  </div>
                  <div className='ml-3'>
                    <h3 className='text-lg font-semibold text-gray-800'>{review.name}</h3>
                    <div className='flex'>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star // Use direct import + CVA
                          key={i}
                          // Apply conditional class directly within the className prop
                          className={iconVariants({
                            size: 'xs',
                            className: i < Math.floor(review.rating)
                              ? 'fill-yellow-400 text-yellow-400' // Filled star style
                              : 'text-gray-300' // Empty star style
                          })}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className='text-sm italic text-gray-600'>{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className='mt-16 flex flex-col items-center justify-center gap-8 rounded-xl bg-blue-600 p-8 text-center text-white'>
        <h2 className='text-3xl font-bold'>جاهز لتجربة النقاء؟</h2>
        <p className='mt-4 text-lg'>انضم إلى آلاف العملاء السعداء واستمتع بمياه أمواج اليوم!</p>
        <Link
          href={'/'}
          className='rounded-full bg-white px-8 py-3 font-semibold text-blue-600 transition duration-300 hover:bg-gray-100'
        >
          اطلب الآن
        </Link>
      </div>
    </div>
  );
};

export default AboutUs;
