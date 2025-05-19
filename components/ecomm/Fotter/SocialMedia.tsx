import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'; // Import directly
import { iconVariants } from '@/lib/utils'; // Correct import path for CVA variants

interface SocailProps {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

const SocialMedia = ({ facebook, instagram, twitter, linkedin }: SocailProps) => (
  <div className='flex items-center justify-center gap-8'>
    {[
      { icon: <Facebook className={iconVariants({ size: 'sm' })} />, link: facebook, label: 'Facebook' },
      { icon: <Instagram className={iconVariants({ size: 'sm' })} />, link: instagram, label: 'Instagram' },
      { icon: <Twitter className={iconVariants({ size: 'sm' })} />, link: twitter, label: 'Twitter' },
      { icon: <Linkedin className={iconVariants({ size: 'sm' })} />, link: linkedin, label: 'LinkedIn' },
    ].map((social, index) => (
      // Only render the link if the link prop exists
      // Ensure the <a> tag and its props are INSIDE the conditional block
      social.link ? (
        <a
          key={index} // Key should be on the outermost element returned by map
          href={social.link}
          aria-label={social.label}
          className='text-muted-foreground transition-colors duration-300 hover:text-primary'
          target='_blank'
          rel='noopener noreferrer'
        >
          {social.icon}
        </a>
      ) : null // Return null if the link doesn't exist
    ))}
  </div>
);
export default SocialMedia;
